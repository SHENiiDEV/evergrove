<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Support\ProductCatalog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __invoke(Request $request, ProductCatalog $catalog, ?string $gender = null, ?string $category = null): Response
    {
        $validated = $request->validate([
            'size' => ['sometimes', 'array'],
            'size.*' => ['string', 'in:'.implode(',', ProductCatalog::SIZE_ORDER)],
            'color' => ['sometimes', 'array'],
            'color.*' => ['string', 'alpha_dash'],
            'category' => ['sometimes', 'array'],
            'category.*' => ['string', 'in:'.implode(',', array_keys(ProductCatalog::CATEGORIES))],
            'price' => ['sometimes', 'array'],
            'price.*' => ['string', 'in:'.implode(',', array_keys(ProductCatalog::PRICE_BANDS))],
            'q' => ['sometimes', 'string', 'max:80'],
            'sort' => ['sometimes', 'string', 'in:'.implode(',', array_keys(ProductCatalog::SORTS))],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $filters = [
            'gender' => $gender,
            'category' => $category ? [$category] : ($validated['category'] ?? []),
            'size' => $validated['size'] ?? [],
            'color' => $validated['color'] ?? [],
            'price' => $validated['price'] ?? [],
            'q' => $validated['q'] ?? null,
            'sort' => $validated['sort'] ?? 'featured',
            'page' => $validated['page'] ?? 1,
        ];

        $result = $catalog->query($filters);

        return Inertia::render('Catalog/Index', [
            'heading' => $filters['q'] ? 'Results for “'.$filters['q'].'”' : $this->heading($gender, $category),
            'query' => $filters['q'],
            'breadcrumbs' => $this->breadcrumbs($gender, $category),
            'gender' => $gender,
            'lockedCategory' => $category,
            'filters' => [
                'category' => $filters['category'],
                'size' => $filters['size'],
                'color' => $filters['color'],
                'price' => $filters['price'],
            ],
            'sort' => $result['sort'],
            'sortOptions' => collect(ProductCatalog::SORTS)
                ->map(fn (string $label, string $value): array => ['value' => $value, 'label' => $label])
                ->values(),
            'facets' => $result['facets'],
            'products' => $result['products'],
            'total' => $result['total'],
            'page' => $result['page'],
            'pages' => $result['pages'],
        ]);
    }

    private function heading(?string $gender, ?string $category): string
    {
        $owner = $gender ? ProductCatalog::GENDERS[$gender].'’s' : null;

        if ($category) {
            return trim($owner.' '.ProductCatalog::CATEGORIES[$category]);
        }

        return $owner ? $owner.' Collection' : 'All Products';
    }

    /**
     * @return array<int, array{label: string, href?: string}>
     */
    private function breadcrumbs(?string $gender, ?string $category): array
    {
        $crumbs = [['label' => 'Home', 'href' => route('home')]];

        if (! $gender) {
            $crumbs[] = ['label' => 'Shop'];

            return $crumbs;
        }

        $crumbs[] = $category
            ? ['label' => ProductCatalog::GENDERS[$gender], 'href' => route('catalog', $gender)]
            : ['label' => ProductCatalog::GENDERS[$gender]];

        if ($category) {
            $crumbs[] = ['label' => ProductCatalog::CATEGORIES[$category]];
        }

        return $crumbs;
    }
}
