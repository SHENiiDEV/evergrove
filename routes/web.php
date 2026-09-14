<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CatalogController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\LegalController;
use App\Http\Controllers\Shop\ProductController;
use App\Mail\OrderConfirmationMail;
use App\Mail\OrderShippedMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Support\ProductCatalog;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/shop/{gender?}/{category?}', CatalogController::class)
    ->whereIn('gender', array_keys(ProductCatalog::GENDERS))
    ->whereIn('category', array_keys(ProductCatalog::CATEGORIES))
    ->name('catalog');

Route::get('/products/{handle}', [ProductController::class, 'show'])->name('products.show');

// Cart & Coupons
Route::post('/cart/coupon/apply', [CartController::class, 'applyCoupon'])->name('cart.coupon.apply');

// Guest Checkout & Orders
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/orders/{orderNumber}/success', [CheckoutController::class, 'success'])->name('orders.success');

// Legal & Information Pages
Route::get('/terms', [LegalController::class, 'terms'])->name('legal.terms');
Route::get('/privacy-policy', [LegalController::class, 'privacy'])->name('legal.privacy');
Route::get('/shipping', [LegalController::class, 'shipping'])->name('legal.shipping');
Route::get('/returns', [LegalController::class, 'returns'])->name('legal.returns');
Route::get('/refund-policy', [LegalController::class, 'refund'])->name('legal.refund');
Route::get('/legal', [LegalController::class, 'legalNotice'])->name('legal.notice');
Route::get('/contact', [LegalController::class, 'contact'])->name('legal.contact');
Route::get('/about', [LegalController::class, 'about'])->name('legal.about');
Route::get('/materials', [LegalController::class, 'materials'])->name('legal.materials');
Route::get('/size-guide', [LegalController::class, 'sizeGuide'])->name('legal.sizeGuide');

// Email Templates Preview
Route::get('/mail/preview/order-confirmation', function () {
    $order = Order::with('items')->latest()->first() ?? new Order([
        'order_number' => 'EVG-2026-DEMO01',
        'email' => 'alex@example.com',
        'first_name' => 'Alex',
        'last_name' => 'Vance',
        'phone' => '+49 170 1234567',
        'shipping_address_line1' => 'Friedrichstraße 43',
        'city' => 'Berlin',
        'postal_code' => '10117',
        'country_name' => 'Germany',
        'shipping_method_name' => 'Standard Shipping (3–7 business days, EU only)',
        'shipping_cost' => 0.00,
        'subtotal' => 196.00,
        'discount_amount' => 19.60,
        'coupon_code' => 'EVER10',
        'total' => 176.40,
        'trees_planted' => 20,
        'payment_status' => 'paid',
        'status' => 'processing',
        'created_at' => now(),
    ]);

    if ($order->items->isEmpty()) {
        $order->setRelation('items', collect([
            new OrderItem([
                'title' => 'Rambler Fleck Sweater',
                'color_name' => 'Fired Brick',
                'size' => 'M',
                'price' => 98.00,
                'quantity' => 1,
                'total' => 98.00,
                'image_src' => 'https://cdn.shopify.com/s/files/1/2341/3995/files/Grey-Highline-Nep-Crew-Sweater-TCM6741-6401_4_resized.jpg?v=1784936356',
            ]),
            new OrderItem([
                'title' => 'Juniper Zip Hoodie',
                'color_name' => 'Olive Night',
                'size' => 'S',
                'price' => 98.00,
                'quantity' => 1,
                'total' => 98.00,
                'image_src' => 'https://cdn.shopify.com/s/files/1/2341/3995/files/W-Juniper-Zip-Hoodie-TCW3683-6401_4_resized.jpg?v=1784936356',
            ]),
        ]));
    }

    return new OrderConfirmationMail($order);
})->name('mail.preview.confirmation');

Route::get('/mail/preview/order-shipped', function () {
    $order = Order::with('items')->latest()->first() ?? new Order([
        'order_number' => 'EVG-2026-DEMO01',
        'email' => 'alex@example.com',
        'first_name' => 'Alex',
        'last_name' => 'Vance',
        'shipping_address_line1' => 'Friedrichstraße 43',
        'city' => 'Berlin',
        'postal_code' => '10117',
        'country_name' => 'Germany',
    ]);

    return new OrderShippedMail($order, 'EVG-DHL-992384102');
})->name('mail.preview.shipped');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
