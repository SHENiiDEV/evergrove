<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StorefrontTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Pin the demo colourway expansion so counts in these tests stay stable.
        config()->set('shop.colorways', 3);
        $this->seed();
    }

    public function test_home_page_renders_the_storefront(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('hero.image.src')
                ->has('hero.video.desktop')
                ->has('hero.video.mobile')
                ->has('hero.video.poster')
                ->has('editorial.video.desktop')
                ->has('editorial.video.poster')
                ->has('newIn', 8)
                ->has('categoryTiles.men')
                ->has('categoryTiles.women')
                ->has('stories', 4)
                ->has('bestSellers')
            );
    }

    public function test_catalogue_lists_every_colourway(): void
    {
        $this->get('/shop')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Catalog/Index')
                ->where('total', fn ($total) => $total >= 10)
                ->has('products')
                ->has('facets.category')
                ->has('facets.size')
                ->has('facets.color')
                ->has('facets.price')
            );
    }

    public function test_gender_and_category_segments_scope_the_grid(): void
    {
        $this->get('/shop/women/jackets')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('heading', 'Women’s Jackets & Coats')
                ->where('lockedCategory', 'jackets')
                ->has('products', fn (Assert $products) => $products
                    ->each(fn (Assert $product) => $product
                        ->where('gender', 'women')
                        ->where('category.slug', 'jackets')
                        ->etc()
                    )
                )
            );
    }

    public function test_size_filter_narrows_the_results(): void
    {
        $all = $this->get('/shop')->viewData('page')['props']['total'];
        $filtered = $this->get('/shop?size[]=XXL')->viewData('page')['props']['total'];

        $this->assertGreaterThan(0, $filtered);
        $this->assertLessThan($all, $filtered);
    }

    public function test_sorting_by_price_orders_the_grid(): void
    {
        $prices = collect($this->get('/shop?sort=price-asc')->viewData('page')['props']['products'])
            ->pluck('price')
            ->all();

        $this->assertSame(collect($prices)->sort()->values()->all(), $prices);
    }

    public function test_search_matches_on_title_and_colour(): void
    {
        $this->get('/shop?q=rain+jacket')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('query', 'rain jacket')
                ->where('heading', 'Results for “rain jacket”')
                ->has('products', fn (Assert $products) => $products
                    ->each(fn (Assert $product) => $product->where('title', 'Nimbus Rain Jacket')->etc())
                )
            );
    }

    public function test_unknown_filter_values_are_rejected(): void
    {
        $this->get('/shop?sort=cheapest')->assertSessionHasErrors('sort');
        $this->get('/shop?category[]=trousers')->assertSessionHasErrors('category.0');
    }

    public function test_product_page_renders_with_its_colourways(): void
    {
        $this->get('/products/mens-rain-jacket')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Product/Show')
                ->where('product.title', 'Nimbus Rain Jacket')
                ->where('product.gender', 'men')
                ->has('product.images')
                ->has('product.sizes', 5)
                ->has('colorways', 3)
                ->has('related', 4)
                ->has('breadcrumbs', 4)
            );
    }

    public function test_unknown_product_handle_returns_404(): void
    {
        $this->get('/products/not-a-real-product')->assertNotFound();
    }

    public function test_unknown_catalogue_segments_return_404(): void
    {
        $this->get('/shop/aliens')->assertNotFound();
        $this->get('/shop/men/trousers')->assertNotFound();
    }
}
