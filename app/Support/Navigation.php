<?php

namespace App\Support;

use Illuminate\Support\Collection;

/**
 * Builds the header navigation from the catalogue so a new category never has
 * to be added to the menu by hand.
 */
class Navigation
{
    public function __construct(private readonly ProductCatalog $catalog) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function main(): array
    {
        $items = collect(ProductCatalog::GENDERS)
            ->map(fn (string $label, string $gender): array => $this->genderItem($gender, $label))
            ->values()
            ->all();

        return [
            ...$items,
            ['label' => 'New in', 'href' => route('catalog', ['sort' => 'newest'])],
            ['label' => 'Sale', 'href' => route('catalog', ['price' => ['under-100']])],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function genderItem(string $gender, string $label): array
    {
        $products = $this->catalog->all()->where('gender', $gender);

        $categories = $products
            ->unique('category.slug')
            ->map(fn (array $product): array => [
                'label' => $product['category']['label'],
                'href' => route('catalog', [$gender, $product['category']['slug']]),
            ])
            ->sortBy('label')
            ->values();

        $feature = $products->first(fn (array $product): bool => in_array('new', $product['badges'], true))
            ?? $products->first();

        return [
            'label' => $label,
            'href' => route('catalog', $gender),
            'columns' => [
                [
                    'heading' => 'Shop by category',
                    'items' => $categories->all(),
                ],
                [
                    'heading' => 'Featured',
                    'items' => [
                        ['label' => 'New in', 'href' => route('catalog', [$gender, 'sort' => 'newest'])],
                        ['label' => 'Best sellers', 'href' => route('catalog', $gender)],
                        ['label' => 'Outerwear', 'href' => route('catalog', [$gender, 'jackets'])],
                        ['label' => 'Shop all '.strtolower($label), 'href' => route('catalog', $gender)],
                    ],
                ],
            ],
            'feature' => $feature ? [
                'label' => $feature['title'],
                'caption' => 'Just landed in '.strtolower($feature['category']['label']),
                'href' => $feature['url'],
                'image' => $feature['images'][0]['src'],
            ] : null,
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function footerColumns(): Collection
    {
        return collect([
            [
                'heading' => 'Shop',
                'items' => [
                    ['label' => 'Women', 'href' => route('catalog', 'women')],
                    ['label' => 'Men', 'href' => route('catalog', 'men')],
                    ['label' => 'New in', 'href' => route('catalog', ['sort' => 'newest'])],
                    ['label' => 'All products', 'href' => route('catalog')],
                ],
            ],
            [
                'heading' => 'Help',
                'items' => [
                    ['label' => 'Delivery', 'href' => route('legal.shipping')],
                    ['label' => 'Returns', 'href' => route('legal.returns')],
                    ['label' => 'Size guide', 'href' => route('legal.sizeGuide')],
                    ['label' => 'Contact us', 'href' => route('legal.contact')],
                ],
            ],
            [
                'heading' => 'About',
                'items' => [
                    ['label' => 'Our story', 'href' => route('legal.about')],
                    ['label' => 'Materials', 'href' => route('legal.materials')],
                    ['label' => 'Sustainability', 'href' => route('legal.materials')],
                    ['label' => 'Legal Notice', 'href' => route('legal.notice')],
                ],
            ],
        ]);
    }
}
