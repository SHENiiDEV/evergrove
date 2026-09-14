<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * EU countries supported for shipping.
     *
     * @var array<string, string>
     */
    public const EU_COUNTRIES = [
        'DE' => 'Germany',
        'FR' => 'France',
        'IE' => 'Ireland',
        'NL' => 'Netherlands',
        'ES' => 'Spain',
        'IT' => 'Italy',
        'AT' => 'Austria',
        'BE' => 'Belgium',
        'PL' => 'Poland',
        'SE' => 'Sweden',
        'DK' => 'Denmark',
        'FI' => 'Finland',
        'PT' => 'Portugal',
        'LV' => 'Latvia',
        'LT' => 'Lithuania',
        'EE' => 'Estonia',
        'CZ' => 'Czech Republic',
        'SK' => 'Slovakia',
        'HU' => 'Hungary',
        'GR' => 'Greece',
        'LU' => 'Luxembourg',
        'HR' => 'Croatia',
        'SI' => 'Slovenia',
        'BG' => 'Bulgaria',
        'RO' => 'Romania',
        'CY' => 'Cyprus',
        'MT' => 'Malta',
    ];

    public const STANDARD_SHIPPING_COST = 4.95;

    public const FREE_SHIPPING_THRESHOLD = 100.00;

    /**
     * Display guest checkout page.
     */
    public function index(): Response
    {
        return Inertia::render('Checkout/Index', [
            'countries' => collect(self::EU_COUNTRIES)
                ->map(fn (string $name, string $code): array => ['code' => $code, 'name' => $name])
                ->values(),
            'shipping' => [
                'name' => 'Standard EU Tracked Delivery (3–7 business days)',
                'rate' => self::STANDARD_SHIPPING_COST,
                'freeThreshold' => self::FREE_SHIPPING_THRESHOLD,
            ],
        ]);
    }

    /**
     * Process and place guest order.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'shipping_address_line1' => ['required', 'string', 'max:255'],
            'shipping_address_line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country_code' => ['required', 'string', 'in:'.implode(',', array_keys(self::EU_COUNTRIES))],
            'coupon_code' => ['nullable', 'string', 'max:30'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.handle' => ['required', 'string'],
            'items.*.title' => ['required', 'string'],
            'items.*.color_name' => ['nullable', 'string'],
            'items.*.size' => ['required', 'string'],
            'items.*.sku' => ['nullable', 'string'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
            'items.*.image_src' => ['nullable', 'string'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $countryName = self::EU_COUNTRIES[$validated['country_code']] ?? 'Europe';

        // Calculate subtotal and trees
        $subtotal = 0.0;
        $totalItemsCount = 0;
        $orderItemsData = [];

        foreach ($validated['items'] as $item) {
            $itemPrice = (float) $item['price'];
            $itemQty = (int) $item['quantity'];
            $itemTotal = round($itemPrice * $itemQty, 2);

            $subtotal += $itemTotal;
            $totalItemsCount += $itemQty;

            $product = Product::where('handle', $item['handle'])->first();

            $orderItemsData[] = [
                'product_id' => $product?->id,
                'product_handle' => $item['handle'],
                'title' => $item['title'],
                'color_name' => $item['color_name'] ?? null,
                'size' => $item['size'],
                'sku' => $item['sku'] ?? 'EVG-SKU',
                'price' => $itemPrice,
                'quantity' => $itemQty,
                'total' => $itemTotal,
                'image_src' => $item['image_src'] ?? null,
            ];
        }

        // Apply coupon if valid
        $discountAmount = 0.0;
        $couponCode = null;
        $isFreeShippingCoupon = false;

        if (! empty($validated['coupon_code'])) {
            $code = strtoupper(trim($validated['coupon_code']));
            /** @var Coupon|null $coupon */
            $coupon = Coupon::where('code', $code)->first();

            if ($coupon && $coupon->isValid($subtotal)) {
                $couponCode = $coupon->code;
                $discountAmount = $coupon->calculateDiscount($subtotal);
                if ($coupon->type === 'free_shipping') {
                    $isFreeShippingCoupon = true;
                }
            }
        }

        // Calculate shipping
        $shippingCost = ($subtotal >= self::FREE_SHIPPING_THRESHOLD || $isFreeShippingCoupon)
            ? 0.00
            : self::STANDARD_SHIPPING_COST;

        $total = max(0, round($subtotal - $discountAmount + $shippingCost, 2));
        $treesPlanted = $totalItemsCount * 10;

        DB::beginTransaction();

        try {
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'email' => $validated['email'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'] ?? null,
                'shipping_address_line1' => $validated['shipping_address_line1'],
                'shipping_address_line2' => $validated['shipping_address_line2'] ?? null,
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'country_code' => $validated['country_code'],
                'country_name' => $countryName,
                'shipping_method_name' => 'Standard Shipping (3–7 business days, EU only)',
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'coupon_code' => $couponCode,
                'total' => $total,
                'trees_planted' => $treesPlanted,
                'payment_method' => 'card',
                'payment_status' => 'paid',
                'status' => 'processing',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Order creation failed: '.$e->getMessage());

            return back()->withErrors(['checkout' => 'Failed to create order. Please try again.']);
        }

        // Send confirmation email (with fallback logging)
        try {
            Mail::to($order->email)->send(new OrderConfirmationMail($order));
        } catch (\Throwable $e) {
            Log::error("Could not send order confirmation email: {$e->getMessage()}", [
                'order_number' => $order->order_number,
                'email' => $order->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return redirect()->route('orders.success', $order->order_number);
    }

    /**
     * Display order success page.
     */
    public function success(string $orderNumber): Response
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

        return Inertia::render('Order/Success', [
            'order' => [
                'orderNumber' => $order->order_number,
                'email' => $order->email,
                'fullName' => $order->full_name,
                'shippingAddress' => [
                    'line1' => $order->shipping_address_line1,
                    'line2' => $order->shipping_address_line2,
                    'city' => $order->city,
                    'postalCode' => $order->postal_code,
                    'countryName' => $order->country_name,
                ],
                'shippingMethod' => $order->shipping_method_name,
                'shippingCost' => $order->shipping_cost,
                'subtotal' => $order->subtotal,
                'discountAmount' => $order->discount_amount,
                'couponCode' => $order->coupon_code,
                'total' => $order->total,
                'treesPlanted' => $order->trees_planted,
                'createdAt' => $order->created_at->format('M d, Y'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'colorName' => $item->color_name,
                    'size' => $item->size,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'total' => $item->total,
                    'imageSrc' => $item->image_src,
                ])->all(),
            ],
        ]);
    }

    /**
     * Download or view PDF tax invoice for order.
     */
    public function invoice(string $orderNumber): \Illuminate\Http\Response
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

        $pdf = Pdf::loadView('invoices.order-invoice', ['order' => $order])
            ->setPaper('a4', 'portrait');

        return $pdf->download("EverGrove-Invoice-{$order->order_number}.pdf");
    }
}
