<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Support\ProductCatalog;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(ProductCatalog $catalog, string $handle): Response
    {
        $product = $catalog->find($handle);

        abort_if($product === null, 404);

        return Inertia::render('Product/Show', [
            'product' => $product,
            'colorways' => $catalog->colorwaysOf($product)->map(ProductCatalog::card(...))->values(),
            'related' => $catalog->related($product)->map(ProductCatalog::card(...))->values(),
            'breadcrumbs' => [
                ['label' => 'Home', 'href' => route('home')],
                ['label' => ProductCatalog::GENDERS[$product['gender']], 'href' => route('catalog', $product['gender'])],
                ['label' => $product['category']['label'], 'href' => route('catalog', [$product['gender'], $product['category']['slug']])],
                ['label' => $product['title']],
            ],
        ]);
    }
}
