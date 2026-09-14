<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Support\ProductCatalog;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(ProductCatalog $catalog): Response
    {
        $all = $catalog->all();

        return Inertia::render('Home', [
            'hero' => $this->hero($all),
            'newIn' => $this->cards($all->sortByDesc('publishedAt')->unique('groupId')->take(8), $all),
            'categoryTiles' => $this->categoryTiles($all),
            'editorial' => $this->editorial($all),
            'bestSellers' => $this->cards(
                $all->filter(fn (array $product): bool => in_array('best-sellers', $product['tags'], true))
                    ->unique('groupId')
                    ->take(5),
                $all
            ),
            'stories' => $this->stories($all),
        ]);
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $products
     * @param  Collection<int, array<string, mixed>>|null  $all
     * @return array<int, array<string, mixed>>
     */
    private function cards(Collection $products, ?Collection $all = null): array
    {
        $allByGroup = ($all ?? $products)->groupBy('groupId');

        return $products->map(function (array $product) use ($allByGroup): array {
            $colorways = $allByGroup->get($product['groupId']);

            return ProductCatalog::card($product, $colorways);
        })->values()->all();
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $all
     * @return array<string, mixed>
     */
    private function hero(Collection $all): array
    {
        $product = $all->firstWhere('handle', 'heavy-weight-flannel-long-jacket-midnight-blue-cabin-plaid') ?? $all->first();

        return [
            'eyebrow' => 'Every Item Plants 10 Trees • 120M+ Planted',
            'title' => 'Earth-First Apparel',
            'copy' => 'Sustainable clothing crafted with hemp, organic cotton, recycled polyester and TENCEL™. Designed for comfort, built for the planet.',
            'image' => $product['images'][0],
            'video' => $this->video('hero'),
            'links' => [
                ['label' => 'Shop women', 'href' => route('catalog', 'women')],
                ['label' => 'Shop men', 'href' => route('catalog', 'men')],
            ],
        ];
    }

    /**
     * Looping footage from public/media, or null when it has not been deployed —
     * the section then falls back to its still image.
     *
     * @return array<string, string>|null
     */
    private function video(string $name): ?array
    {
        if (! file_exists(public_path("media/{$name}.mp4"))) {
            return null;
        }

        return [
            'desktop' => asset("media/{$name}.mp4"),
            'mobile' => asset("media/{$name}-mobile.mp4"),
            'poster' => asset("media/{$name}-poster.jpg"),
        ];
    }

    /**
     * One tile per category, illustrated by a product that actually sits in it.
     *
     * @param  Collection<int, array<string, mixed>>  $all
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function categoryTiles(Collection $all): array
    {
        return collect(ProductCatalog::GENDERS)
            ->mapWithKeys(fn (string $label, string $gender): array => [
                $gender => $all->where('gender', $gender)
                    ->unique('category.slug')
                    ->map(fn (array $product): array => [
                        'label' => $product['category']['label'],
                        'href' => route('catalog', [$gender, $product['category']['slug']]),
                        'image' => $product['images'][0],
                    ])
                    ->values()
                    ->take(4)
                    ->all(),
            ])
            ->all();
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $all
     * @return array<string, mixed>
     */
    private function editorial(Collection $all): array
    {
        $product = $all->firstWhere('handle', 'mens-rain-jacket') ?? $all->first();

        return [
            'eyebrow' => 'Outerwear',
            'title' => 'Made for every forecast',
            'copy' => 'Taped seams, water-repellent finishes and insulation that packs down small. Layers that keep training outdoors uncomplicated.',
            'image' => $product['images'][1] ?? $product['images'][0],
            'video' => $this->video('outerwear'),
            'link' => ['label' => 'Shop outerwear', 'href' => route('catalog', ['men', 'jackets'])],
        ];
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $all
     * @return array<int, array<string, mixed>>
     */
    private function stories(Collection $all): array
    {
        $copy = [
            ['title' => 'How to layer', 'caption' => 'Three pieces, every temperature between 15° and -10°.'],
            ['title' => 'The fabric guide', 'caption' => 'Recycled polyester, organic cotton and where each one earns its place.'],
            ['title' => 'Find your fit', 'caption' => 'Regular, relaxed and cropped, measured on real bodies.'],
            ['title' => 'The winter edit', 'caption' => 'The pieces our team reaches for when the season turns.'],
        ];

        $images = $all->unique('groupId')->values();

        return collect($copy)
            ->map(fn (array $story, int $index): array => [
                ...$story,
                'href' => route('catalog'),
                'image' => $images[$index + 4]['images'][0] ?? $images[$index]['images'][0],
            ])
            ->all();
    }
}
