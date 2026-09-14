<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_checkout_page_renders_with_eu_countries_and_shipping(): void
    {
        $this->get('/checkout')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Checkout/Index')
                ->has('countries', fn (Assert $countries) => $countries
                    ->where('0.code', 'DE')
                    ->etc()
                )
                ->has('shipping.rate')
                ->has('shipping.freeThreshold')
            );
    }

    public function test_coupon_can_be_applied_via_api(): void
    {
        // Valid coupon
        $response = $this->postJson('/cart/coupon/apply', [
            'code' => 'EVER10',
            'subtotal' => 100.00,
        ]);

        $response->assertOk()
            ->assertJson([
                'valid' => true,
                'coupon' => [
                    'code' => 'EVER10',
                    'discount' => 10.00,
                ],
            ]);

        // Invalid coupon
        $this->postJson('/cart/coupon/apply', [
            'code' => 'NONEXISTENT',
            'subtotal' => 100.00,
        ])->assertStatus(422)
            ->assertJson(['valid' => false]);
    }

    public function test_guest_can_place_order_successfully(): void
    {
        $payload = [
            'email' => 'eco.buyer@example.com',
            'first_name' => 'Emma',
            'last_name' => 'Larsson',
            'phone' => '+46 70 123 4567',
            'shipping_address_line1' => 'Drottninggatan 12',
            'shipping_address_line2' => 'Apt 3',
            'city' => 'Stockholm',
            'postal_code' => '11151',
            'country_code' => 'SE',
            'coupon_code' => 'EVER10',
            'items' => [
                [
                    'handle' => 'rambler-fleck-sweater-harbour-grey-heather-fleck-fired-brick',
                    'title' => 'Rambler Fleck Sweater',
                    'color_name' => 'Fired Brick',
                    'size' => 'M',
                    'sku' => 'TCM6741-M',
                    'price' => 98.00,
                    'quantity' => 2,
                    'image_src' => 'https://cdn.shopify.com/test.jpg',
                ],
            ],
        ];

        $response = $this->post('/checkout', $payload);

        $order = Order::where('email', 'eco.buyer@example.com')->first();

        $this->assertNotNull($order);
        $this->assertSame('Emma Larsson', $order->full_name);
        $this->assertSame('Sweden', $order->country_name);
        $this->assertSame(196.00, (float) $order->subtotal);
        $this->assertSame(19.60, (float) $order->discount_amount);
        $this->assertSame(0.00, (float) $order->shipping_cost); // Over 100 is free
        $this->assertSame(176.40, (float) $order->total);
        $this->assertSame(20, $order->trees_planted); // 2 items * 10 trees = 20 trees

        $response->assertRedirect(route('orders.success', $order->order_number));

        // Test Success Page
        $this->get(route('orders.success', $order->order_number))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Order/Success')
                ->where('order.orderNumber', $order->order_number)
                ->where('order.treesPlanted', 20)
                ->has('order.items', 1)
            );
    }

    public function test_order_email_previews_return_ok(): void
    {
        $this->get('/mail/preview/order-confirmation')->assertOk();
        $this->get('/mail/preview/order-shipped')->assertOk();
    }
}
