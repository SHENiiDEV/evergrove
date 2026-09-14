<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Support\ColorPalette;
use App\Support\ProductCatalog;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ImportProductsFromFeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shop:import-feed {--source= : Feed URL or local JSON path} {--fresh : Truncate products and variants before importing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products, variants, and CDN images from Tentree / Shopify JSON feed into SQLite';

    /**
     * Extra colorways palette for demo expansion.
     *
     * @var array<int, array{name: string, hex: string}>
     */
    private const EXTRA_COLORWAYS = [
        ['name' => 'Olive Night', 'hex' => '#4A4F3C'],
        ['name' => 'Sandstone', 'hex' => '#C9BBA5'],
        ['name' => 'Fired Brick', 'hex' => '#7E3B2B'],
        ['name' => 'Glacier Blue', 'hex' => '#9FB6C4'],
        ['name' => 'Bone White', 'hex' => '#EDE9E1'],
        ['name' => 'Slate Grey', 'hex' => '#555B60'],
        ['name' => 'Forest Night', 'hex' => '#2F4636'],
        ['name' => 'Clay', 'hex' => '#A9583F'],
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting product catalogue import...');

        $source = (string) ($this->option('source') ?: 'https://www.tentree.com/products.json?limit=250');
        $feed = $this->loadFeed($source);

        if ($feed === null || empty($feed['products'])) {
            $this->error('No products found in the feed.');

            return self::FAILURE;
        }

        $rawProducts = $feed['products'];
        $this->info(sprintf('Loaded %d raw products from feed source.', count($rawProducts)));

        // Setup categories
        $categoryMap = $this->ensureCategories();

        if ($this->option('fresh')) {
            $this->info('Clearing existing catalogue tables...');
            ProductImage::query()->delete();
            ProductVariant::query()->delete();
            Product::query()->delete();
        }

        $importedCount = 0;
        $variantsCount = 0;
        $imagesCount = 0;

        $colorwayMultiplier = (int) config('shop.colorways', 3);

        $bar = $this->output->createProgressBar(count($rawProducts));
        $bar->start();

        DB::beginTransaction();

        try {
            foreach ($rawProducts as $rawProduct) {
                $colorways = $this->buildColorways($rawProduct, $colorwayMultiplier);

                foreach ($colorways as $item) {
                    $categorySlug = $item['category_slug'];
                    $categoryId = $categoryMap[$categorySlug] ?? $categoryMap['tops'];

                    /** @var Product $product */
                    $product = Product::updateOrCreate(
                        ['handle' => $item['handle']],
                        [
                            'shopify_id' => $item['shopify_id'],
                            'group_id' => $item['group_id'],
                            'title' => $item['title'],
                            'vendor' => $item['vendor'],
                            'product_type' => $item['product_type'],
                            'gender' => $item['gender'],
                            'category_id' => $categoryId,
                            'description_html' => $item['description_html'],
                            'price' => $item['price'],
                            'compare_at_price' => $item['compare_at_price'],
                            'available' => $item['available'],
                            'tags' => $item['tags'],
                            'badges' => $item['badges'],
                            'primary_color_name' => $item['color']['name'],
                            'primary_color_slug' => $item['color']['slug'],
                            'primary_color_hex' => $item['color']['hex'],
                            'primary_color_family' => $item['color']['family'],
                            'published_at' => $item['published_at'],
                        ]
                    );

                    // Sync variants
                    $product->variants()->delete();
                    foreach ($item['variants'] as $v) {
                        $product->variants()->create([
                            'shopify_variant_id' => $v['shopify_variant_id'],
                            'title' => $v['title'],
                            'option1_color' => $v['option1_color'],
                            'option2_size' => $v['option2_size'],
                            'option3' => $v['option3'] ?? null,
                            'sku' => $v['sku'],
                            'price' => $v['price'],
                            'compare_at_price' => $v['compare_at_price'],
                            'available' => $v['available'],
                            'grams' => $v['grams'] ?? null,
                            'position' => $v['position'],
                            'featured_image_id' => $v['featured_image_id'] ?? null,
                        ]);
                        $variantsCount++;
                    }

                    // Sync images
                    $product->images()->delete();
                    foreach ($item['images'] as $img) {
                        $product->images()->create([
                            'shopify_image_id' => $img['shopify_image_id'],
                            'src' => $img['src'],
                            'alt' => $img['alt'],
                            'width' => $img['width'],
                            'height' => $img['height'],
                            'position' => $img['position'],
                            'variant_ids' => $img['variant_ids'] ?? [],
                        ]);
                        $imagesCount++;
                    }

                    $importedCount++;
                }

                $bar->advance();
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("\nImport failed: ".$e->getMessage());

            return self::FAILURE;
        }

        $bar->finish();
        $this->newLine(2);
        $this->info('Import successfully completed!');
        $this->table(
            ['Entity', 'Count'],
            [
                ['Products (with colorways)', $importedCount],
                ['Variants / SKUs', $variantsCount],
                ['CDN Images', $imagesCount],
                ['Categories', count($categoryMap)],
            ]
        );

        return self::SUCCESS;
    }

    /**
     * @return array<string, int> Map of category slug to database ID
     */
    private function ensureCategories(): array
    {
        $map = [];

        foreach (ProductCatalog::CATEGORIES as $slug => $name) {
            $cat = Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'description' => $name]
            );
            $map[$slug] = $cat->id;
        }

        return $map;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function loadFeed(string $source): ?array
    {
        if (str_starts_with($source, 'http://') || str_starts_with($source, 'https://')) {
            try {
                $this->info("Fetching remote feed from: {$source}");
                $response = Http::timeout(25)->get($source);

                if ($response->successful()) {
                    return $response->json();
                }

                $this->warn("Remote fetch failed with status: {$response->status()}. Falling back to local file.");
            } catch (\Throwable $e) {
                $this->warn("Remote fetch error: {$e->getMessage()}. Falling back to local file.");
            }
        }

        $localPath = file_exists($source) ? $source : database_path('data/products.json');

        if (file_exists($localPath)) {
            $this->info("Loading local feed: {$localPath}");

            return json_decode(file_get_contents($localPath), true);
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $feedProduct
     * @return array<int, array<string, mixed>>
     */
    private function buildColorways(array $feedProduct, int $multiplier): array
    {
        $colorways = [$this->normalizeProduct($feedProduct, null, 0)];

        if ($multiplier > 1) {
            $palette = self::EXTRA_COLORWAYS;
            $offset = crc32($feedProduct['handle']) % count($palette);

            for ($i = 1; $i < $multiplier; $i++) {
                $swatch = $palette[($offset + $i - 1) % count($palette)];
                $color = ColorPalette::resolve($swatch['name'], $swatch['hex']);
                $colorways[] = $this->normalizeProduct($feedProduct, $color, $i);
            }
        }

        return $colorways;
    }

    /**
     * @param  array<string, mixed>  $feedProduct
     * @param  array{name: string, slug: string, hex: string, family: string}|null  $color
     * @return array<string, mixed>
     */
    private function normalizeProduct(array $feedProduct, ?array $color, int $colorwayIndex): array
    {
        $color ??= ColorPalette::resolve($feedProduct['options'][0]['values'][0] ?? 'Black');

        $handle = $colorwayIndex === 0
            ? $feedProduct['handle']
            : $feedProduct['handle'].'-'.$color['slug'];

        $price = (float) ($feedProduct['variants'][0]['price'] ?? 0);
        $compareAt = $feedProduct['variants'][0]['compare_at_price'] ?? null;

        if ($compareAt === null && $colorwayIndex === 2) {
            $compareAt = round($price * 1.3, 2);
        }

        $tags = array_map(fn (string $tag): string => Str::lower($tag), $feedProduct['tags'] ?? []);

        $variants = [];
        $hasAvailable = false;

        foreach ($feedProduct['variants'] ?? [] as $index => $v) {
            $available = $colorwayIndex === 0
                ? (bool) ($v['available'] ?? true)
                : crc32($handle.($v['option2'] ?? '')) % 6 !== 0;

            if ($available) {
                $hasAvailable = true;
            }

            $sku = (string) ($v['sku'] ?? 'SKU');
            if ($colorwayIndex > 0) {
                $sku .= '-'.$color['slug'];
            }

            $variants[] = [
                'shopify_variant_id' => (int) ($v['id'] ?? 0) + ($colorwayIndex * 7),
                'title' => (string) ($v['title'] ?? ''),
                'option1_color' => $color['name'],
                'option2_size' => (string) ($v['option2'] ?? 'OS'),
                'option3' => $v['option3'] ?? null,
                'sku' => $sku,
                'price' => (float) ($v['price'] ?? $price),
                'compare_at_price' => $compareAt !== null ? (float) $compareAt : null,
                'available' => $available,
                'grams' => isset($v['grams']) ? (int) $v['grams'] : null,
                'position' => $index + 1,
                'featured_image_id' => isset($v['featured_image']['id']) ? (int) $v['featured_image']['id'] : null,
            ];
        }

        $images = [];
        foreach ($feedProduct['images'] ?? [] as $pos => $img) {
            $images[] = [
                'shopify_image_id' => (int) ($img['id'] ?? 0),
                'src' => $img['src'],
                'alt' => $feedProduct['title'].' in '.$color['name'],
                'width' => isset($img['width']) ? (int) $img['width'] : null,
                'height' => isset($img['height']) ? (int) $img['height'] : null,
                'position' => $pos + 1,
                'variant_ids' => $img['variant_ids'] ?? [],
            ];
        }

        $categorySlug = $this->determineCategorySlug($tags);
        $badges = $this->determineBadges($tags, $hasAvailable, $compareAt !== null);

        return [
            'shopify_id' => (int) ($feedProduct['id'] ?? 0),
            'group_id' => (int) ($feedProduct['id'] ?? 0),
            'title' => $feedProduct['title'],
            'handle' => $handle,
            'vendor' => $feedProduct['vendor'] ?? 'EverGrove',
            'product_type' => $feedProduct['product_type'] ?? '',
            'gender' => ($feedProduct['product_type'] ?? '') === 'Womens' ? 'women' : 'men',
            'category_slug' => $categorySlug,
            'description_html' => $feedProduct['body_html'] ?? '',
            'price' => $price,
            'compare_at_price' => $compareAt !== null ? (float) $compareAt : null,
            'available' => $hasAvailable,
            'tags' => $tags,
            'badges' => $badges,
            'color' => $color,
            'published_at' => isset($feedProduct['published_at']) ? Carbon::parse($feedProduct['published_at']) : now(),
            'variants' => $variants,
            'images' => $images,
        ];
    }

    /**
     * @param  array<int, string>  $tags
     */
    private function determineCategorySlug(array $tags): string
    {
        $rules = [
            'vests' => ['vest'],
            'jackets' => ['jackets-coats', 'jacket', 'rain-jacket', 'outerwear'],
            'hoodies' => ['hoodies-sweatshirts', 'hoodie', 'sweatshirt', 'zip-up'],
            'sweaters' => ['sweaters-cardigans', 'sweater'],
        ];

        foreach ($rules as $slug => $needles) {
            if (array_intersect($needles, $tags) !== []) {
                return $slug;
            }
        }

        return 'tops';
    }

    /**
     * @param  array<int, string>  $tags
     * @return array<int, string>
     */
    private function determineBadges(array $tags, bool $available, bool $onSale): array
    {
        $badges = [];

        if (! $available) {
            $badges[] = 'sold-out';
        }

        if ($onSale) {
            $badges[] = 'sale';
        }

        foreach ($tags as $tag) {
            if (str_contains($tag, 'new-style') || str_contains($tag, 'new-color')) {
                $badges[] = 'new';
                break;
            }
        }

        if ($available && in_array('low-in-stock', $tags, true)) {
            $badges[] = 'low-stock';
        }

        return array_values(array_unique($badges));
    }
}
