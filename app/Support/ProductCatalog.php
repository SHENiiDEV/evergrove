<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Reads product data from Eloquent database and normalises it into the flat arrays
 * the storefront pages consume.
 */
class ProductCatalog
{
    /**
     * @var array<string, string>
     */
    public const CATEGORIES = [
        'jackets' => 'Jackets & Coats',
        'hoodies' => 'Hoodies & Sweatshirts',
        'vests' => 'Vests',
        'sweaters' => 'Sweaters',
        'tops' => 'Tops',
    ];

    /**
     * @var array<string, string>
     */
    public const GENDERS = [
        'men' => 'Men',
        'women' => 'Women',
    ];

    /**
     * @var array<string, array{label: string, min: float, max: float|null}>
     */
    public const PRICE_BANDS = [
        'under-100' => ['label' => 'Under 100', 'min' => 0.0, 'max' => 100.0],
        '100-200' => ['label' => '100 to 200', 'min' => 100.0, 'max' => 200.0],
        '200-300' => ['label' => '200 to 300', 'min' => 200.0, 'max' => 300.0],
        '300-plus' => ['label' => '300 and above', 'min' => 300.0, 'max' => null],
    ];

    /**
     * @var array<int, string>
     */
    public const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    /**
     * @var array<string, string>
     */
    public const SORTS = [
        'featured' => 'Featured',
        'newest' => 'Newest',
        'price-asc' => 'Price: low to high',
        'price-desc' => 'Price: high to low',
    ];

    /**
     * @var Collection<int, array<string, mixed>>|null
     */
    private ?Collection $products = null;

    /**
     * Every colourway in the catalogue.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function all(): Collection
    {
        return $this->products ??= $this->load();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(string $handle): ?array
    {
        // Try finding directly in database first
        $productModel = Product::with(['category', 'variants', 'images'])
            ->where('handle', $handle)
            ->first();

        if ($productModel) {
            return self::format($productModel);
        }

        return $this->all()->firstWhere('handle', $handle);
    }

    /**
     * Sibling colourways of the same feed product, the current one included.
     *
     * @param  array<string, mixed>  $product
     * @return Collection<int, array<string, mixed>>
     */
    public function colorwaysOf(array $product): Collection
    {
        return $this->all()
            ->where('groupId', $product['groupId'])
            ->values();
    }

    /**
     * @param  array<string, mixed>  $product
     * @return Collection<int, array<string, mixed>>
     */
    public function related(array $product, int $limit = 4): Collection
    {
        return $this->all()
            ->where('groupId', '!=', $product['groupId'])
            ->where('gender', $product['gender'])
            ->sortByDesc(fn (array $candidate): int => (int) ($candidate['category']['slug'] === $product['category']['slug']))
            ->unique('groupId')
            ->take($limit)
            ->values();
    }

    /**
     * Filter, sort and paginate the catalogue for the listing page.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function query(array $filters): array
    {
        $scoped = $this->all();

        if ($gender = $filters['gender'] ?? null) {
            $scoped = $scoped->where('gender', $gender);
        }

        if ($term = trim((string) ($filters['q'] ?? ''))) {
            $scoped = $scoped->filter(fn (array $product): bool => $this->matches($product, $term))->values();
        }

        $matched = $this->sort($this->applyFilters($scoped, $filters), $filters['sort'] ?? 'featured')
            ->unique('groupId')
            ->values();

        $allByGroup = $this->all()->groupBy('groupId');

        $perPage = (int) config('shop.per_page', 24);
        $pages = max(1, (int) ceil($matched->count() / $perPage));
        $page = min(max(1, (int) ($filters['page'] ?? 1)), $pages);

        $cards = $matched->forPage($page, $perPage)->map(function (array $product) use ($allByGroup): array {
            $colorways = $allByGroup->get($product['groupId']);

            return self::card($product, $colorways);
        })->values()->all();

        return [
            'products' => $cards,
            'total' => $matched->count(),
            'page' => $page,
            'pages' => $pages,
            'facets' => $this->facets($scoped, $filters),
            'sort' => $filters['sort'] ?? 'featured',
        ];
    }

    /**
     * @param  array<string, mixed>  $product
     */
    private function matches(array $product, string $term): bool
    {
        $haystack = Str::lower(implode(' ', [
            $product['title'],
            $product['color']['name'],
            $product['color']['family'],
            $product['category']['label'],
            implode(' ', $product['tags']),
        ]));

        foreach (preg_split('/\s+/', Str::lower($term)) ?: [] as $word) {
            if ($word !== '' && ! str_contains($haystack, $word)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $products
     * @param  array<string, mixed>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function applyFilters(Collection $products, array $filters, ?string $except = null): Collection
    {
        foreach (['category', 'size', 'color', 'price'] as $key) {
            $values = array_filter((array) ($filters[$key] ?? []));

            if ($key === $except || $values === []) {
                continue;
            }

            $products = $products->filter(fn (array $product): bool => match ($key) {
                'category' => in_array($product['category']['slug'], $values, true),
                'size' => $this->hasAnySize($product, $values),
                'color' => in_array($product['color']['family'], $values, true),
                'price' => $this->inAnyBand($product, $values),
            });
        }

        return $products->values();
    }

    /**
     * @param  array<string, mixed>  $product
     * @param  array<int, string>  $sizes
     */
    private function hasAnySize(array $product, array $sizes): bool
    {
        foreach ($product['sizes'] as $size) {
            if ($size['available'] && in_array($size['label'], $sizes, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  array<string, mixed>  $product
     * @param  array<int, string>  $bands
     */
    private function inAnyBand(array $product, array $bands): bool
    {
        foreach ($bands as $band) {
            $range = self::PRICE_BANDS[$band] ?? null;

            if ($range && $product['price'] >= $range['min'] && ($range['max'] === null || $product['price'] < $range['max'])) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $products
     * @return Collection<int, array<string, mixed>>
     */
    private function sort(Collection $products, string $sort): Collection
    {
        return match ($sort) {
            'newest' => $products->sortByDesc('publishedAt')->values(),
            'price-asc' => $products->sortBy('price')->values(),
            'price-desc' => $products->sortByDesc('price')->values(),
            default => $products,
        };
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $scoped
     * @param  array<string, mixed>  $filters
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function facets(Collection $scoped, array $filters): array
    {
        $facets = [];

        foreach (['category', 'size', 'color', 'price'] as $key) {
            $pool = $this->applyFilters($scoped, $filters, $key);

            $facets[$key] = match ($key) {
                'category' => collect(self::CATEGORIES)
                    ->map(fn (string $label, string $slug): array => [
                        'value' => $slug,
                        'label' => $label,
                        'count' => $pool->where('category.slug', $slug)->count(),
                    ])->values()->filter(fn (array $facet): bool => $facet['count'] > 0)->values()->all(),

                'size' => collect(self::SIZE_ORDER)
                    ->map(fn (string $label): array => [
                        'value' => $label,
                        'label' => $label,
                        'count' => $pool->filter(fn (array $product): bool => $this->hasAnySize($product, [$label]))->count(),
                    ])->filter(fn (array $facet): bool => $facet['count'] > 0)->values()->all(),

                'color' => $pool->groupBy('color.family')
                    ->map(fn (Collection $group, string $family): array => [
                        'value' => $family,
                        'label' => Str::title($family),
                        'hex' => $group->first()['color']['hex'],
                        'count' => $group->count(),
                    ])->sortBy('label')->values()->all(),

                'price' => collect(self::PRICE_BANDS)
                    ->map(fn (array $band, string $key): array => [
                        'value' => $key,
                        'label' => $band['label'],
                        'count' => $pool->filter(fn (array $product): bool => $this->inAnyBand($product, [$key]))->count(),
                    ])->filter(fn (array $facet): bool => $facet['count'] > 0)->values()->all(),
            };
        }

        return $facets;
    }

    /**
     * The subset a grid card needs.
     *
     * @param  array<string, mixed>|Product  $product
     * @param  Collection<int, array<string, mixed>>|null  $colorways
     * @return array<string, mixed>
     */
    public static function card(array|Product $product, mixed $colorways = null): array
    {
        if (! ($colorways instanceof Collection)) {
            $colorways = null;
        }

        if ($product instanceof Product) {
            $product = self::format($product);
        }

        $colorwaysList = $colorways ? $colorways->map(function ($c): array {
            $item = is_array($c) ? $c : self::format($c);

            return [
                'id' => $item['id'],
                'groupId' => $item['groupId'],
                'title' => $item['title'],
                'handle' => $item['handle'],
                'url' => $item['url'],
                'price' => $item['price'],
                'compareAtPrice' => $item['compareAtPrice'],
                'image' => $item['image'],
                'hoverImage' => $item['hoverImage'],
                'color' => $item['color'],
                'sizes' => $item['sizes'],
                'available' => $item['available'],
                'badges' => $item['badges'],
                'gender' => $item['gender'],
                'category' => $item['category'],
            ];
        })->values()->all() : [];

        return [
            'id' => $product['id'],
            'groupId' => $product['groupId'],
            'title' => $product['title'],
            'handle' => $product['handle'],
            'url' => $product['url'],
            'price' => $product['price'],
            'compareAtPrice' => $product['compareAtPrice'],
            'image' => $product['image'],
            'hoverImage' => $product['hoverImage'],
            'color' => $product['color'],
            'sizes' => $product['sizes'],
            'available' => $product['available'],
            'badges' => $product['badges'],
            'gender' => $product['gender'],
            'category' => $product['category'],
            'colorways' => $colorwaysList,
        ];
    }

    /**
     * Normalises an Eloquent Product model into the required storefront array shape.
     *
     * @return array<string, mixed>
     */
    public static function format(Product $product): array
    {
        $images = $product->images->map(fn ($img) => [
            'src' => $img->src,
            'alt' => $img->alt ?? ($product->title.' in '.($product->primary_color_name ?? 'Black')),
            'width' => $img->width,
            'height' => $img->height,
        ])->values()->all();

        $sizes = $product->variants->map(fn ($v) => [
            'label' => $v->option2_size ?? 'OS',
            'sku' => $v->sku,
            'variantId' => $v->shopify_variant_id ?? $v->id,
            'available' => (bool) $v->available,
        ])->values()->all();

        $color = [
            'name' => $product->primary_color_name ?? 'Black',
            'slug' => $product->primary_color_slug ?? Str::slug($product->primary_color_name ?? 'black'),
            'hex' => $product->primary_color_hex ?? '#191919',
            'family' => $product->primary_color_family ?? 'black',
        ];

        $category = [
            'slug' => $product->category?->slug ?? 'tops',
            'label' => $product->category?->name ?? (self::CATEGORIES[$product->category?->slug ?? 'tops'] ?? 'Tops'),
        ];

        return [
            'id' => $product->handle,
            'groupId' => (int) ($product->group_id ?? $product->shopify_id ?? $product->id),
            'title' => $product->title,
            'handle' => $product->handle,
            'url' => route('products.show', $product->handle),
            'descriptionHtml' => $product->description_html ?? '',
            'price' => (float) $product->price,
            'compareAtPrice' => $product->compare_at_price ? (float) $product->compare_at_price : null,
            'gender' => $product->gender,
            'category' => $category,
            'color' => $color,
            'sizes' => $sizes,
            'available' => (bool) $product->available,
            'badges' => $product->badges ?? [],
            'images' => $images,
            'image' => $images[0] ?? null,
            'hoverImage' => $images[1] ?? null,
            'publishedAt' => $product->published_at?->toISOString() ?? now()->toISOString(),
            'vendor' => $product->vendor ?? 'EverGrove',
            'tags' => $product->tags ?? [],
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function load(): Collection
    {
        $products = Product::with(['category', 'variants', 'images'])->get();

        if ($products->isNotEmpty()) {
            return $products->map(self::format(...))->values();
        }

        // Fallback to local json feed if database is empty
        $path = (string) config('shop.feed');
        if (file_exists($path)) {
            $feed = json_decode((string) file_get_contents($path), true);

            return collect($feed['products'] ?? [])
                ->flatMap(fn (array $product): array => $this->colorwaysFromFeed($product))
                ->values();
        }

        return collect();
    }

    /**
     * Fallback helper for feed products when database is empty.
     *
     * @param  array<string, mixed>  $feedProduct
     * @return array<int, array<string, mixed>>
     */
    private function colorwaysFromFeed(array $feedProduct): array
    {
        $color = ColorPalette::resolve($feedProduct['options'][0]['values'][0] ?? 'Black');
        $price = (float) ($feedProduct['variants'][0]['price'] ?? 0);
        $images = collect($feedProduct['images'] ?? [])->map(fn ($img) => [
            'src' => $img['src'],
            'alt' => $feedProduct['title'],
            'width' => $img['width'] ?? null,
            'height' => $img['height'] ?? null,
        ])->all();

        return [[
            'id' => $feedProduct['handle'],
            'groupId' => $feedProduct['id'],
            'title' => $feedProduct['title'],
            'handle' => $feedProduct['handle'],
            'url' => route('products.show', $feedProduct['handle']),
            'descriptionHtml' => $feedProduct['body_html'] ?? '',
            'price' => $price,
            'compareAtPrice' => null,
            'gender' => ($feedProduct['product_type'] ?? '') === 'Womens' ? 'women' : 'men',
            'category' => ['slug' => 'tops', 'label' => 'Tops'],
            'color' => $color,
            'sizes' => [],
            'available' => true,
            'badges' => [],
            'images' => $images,
            'image' => $images[0] ?? null,
            'hoverImage' => $images[1] ?? null,
            'publishedAt' => now()->toISOString(),
            'vendor' => $feedProduct['vendor'] ?? 'MonsterGym',
            'tags' => $feedProduct['tags'] ?? [],
        ]];
    }
}
