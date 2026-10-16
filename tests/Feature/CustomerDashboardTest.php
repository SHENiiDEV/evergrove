<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_renders(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_register_page_renders(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_registration_links_existing_guest_orders(): void
    {
        $guestOrder = Order::create([
            'order_number' => 'EVG-2026-TEST01',
            'email' => 'client@evergrove.co.uk',
            'first_name' => 'Elena',
            'last_name' => 'Rostova',
            'shipping_address_line1' => 'Kurfürstendamm 12',
            'city' => 'Berlin',
            'postal_code' => '10719',
            'country_code' => 'DE',
            'country_name' => 'Germany',
            'subtotal' => 120.00,
            'total' => 120.00,
            'trees_planted' => 20,
        ]);

        $this->assertNull($guestOrder->user_id);

        $response = $this->post('/register', [
            'name' => 'Elena Rostova',
            'email' => 'client@evergrove.co.uk',
            'password' => 'secretPassword123!',
            'password_confirmation' => 'secretPassword123!',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();

        $user = User::where('email', 'client@evergrove.co.uk')->first();
        $this->assertNotNull($user);

        $guestOrder->refresh();
        $this->assertEquals($user->id, $guestOrder->user_id);
    }

    public function test_dashboard_requires_authentication(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_customer_can_view_dashboard_with_orders(): void
    {
        $user = User::factory()->create([
            'email' => 'member@evergrove.co.uk',
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'EVG-2026-TEST02',
            'email' => $user->email,
            'first_name' => 'Member',
            'last_name' => 'User',
            'shipping_address_line1' => 'Musterstraße 1',
            'city' => 'Munich',
            'postal_code' => '80331',
            'country_code' => 'DE',
            'country_name' => 'Germany',
            'subtotal' => 98.00,
            'total' => 98.00,
            'trees_planted' => 10,
        ]);

        $order->items()->create([
            'product_handle' => 'rambler-fleck-sweater',
            'title' => 'Rambler Fleck Sweater',
            'size' => 'M',
            'price' => 98.00,
            'quantity' => 1,
            'total' => 98.00,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('stats')
            ->has('orders', 1)
            ->where('orders.0.order_number', 'EVG-2026-TEST02')
        );
    }

    public function test_customer_can_download_invoice(): void
    {
        $order = Order::create([
            'order_number' => 'EVG-2026-INVOICE',
            'email' => 'alex@example.com',
            'first_name' => 'Alex',
            'last_name' => 'Vance',
            'shipping_address_line1' => 'Friedrichstraße 43',
            'city' => 'Berlin',
            'postal_code' => '10117',
            'country_code' => 'DE',
            'country_name' => 'Germany',
            'subtotal' => 196.00,
            'total' => 196.00,
            'trees_planted' => 20,
        ]);

        $order->items()->create([
            'product_handle' => 'rambler-fleck-sweater',
            'title' => 'Rambler Fleck Sweater',
            'size' => 'L',
            'price' => 196.00,
            'quantity' => 1,
            'total' => 196.00,
        ]);

        $response = $this->get("/orders/{$order->order_number}/invoice");

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('content-type'));
    }
}
