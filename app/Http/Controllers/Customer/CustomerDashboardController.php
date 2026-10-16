<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDashboardController extends Controller
{
    /**
     * Display customer account dashboard with orders and impact statistics.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Automatically link any past guest orders with matching email
        Order::where('email', $user->email)
            ->whereNull('user_id')
            ->update(['user_id' => $user->id]);

        $orders = Order::with('items')
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->latest()
            ->get();

        $totalSpent = round($orders->sum('total'), 2);
        $treesPlanted = (int) $orders->sum('trees_planted');
        $ordersCount = $orders->count();

        $formattedOrders = $orders->map(function (Order $order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'date' => $order->created_at->format('M d, Y'),
                'iso_date' => $order->created_at->toIso8601String(),
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'subtotal' => (float) $order->subtotal,
                'discount_amount' => (float) $order->discount_amount,
                'shipping_cost' => (float) $order->shipping_cost,
                'shipping_method_name' => $order->shipping_method_name,
                'coupon_code' => $order->coupon_code,
                'total' => (float) $order->total,
                'trees_planted' => (int) $order->trees_planted,
                'notes' => $order->notes,
                'invoice_url' => route('orders.invoice', $order->order_number),
                'shipping_address' => [
                    'recipient' => $order->full_name,
                    'line1' => $order->shipping_address_line1,
                    'line2' => $order->shipping_address_line2,
                    'city' => $order->city,
                    'postal_code' => $order->postal_code,
                    'country_name' => $order->country_name,
                    'phone' => $order->phone,
                ],
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_handle' => $item->product_handle,
                        'title' => $item->title,
                        'color_name' => $item->color_name,
                        'size' => $item->size,
                        'price' => (float) $item->price,
                        'quantity' => (int) $item->quantity,
                        'total' => (float) $item->total,
                        'image_src' => $item->image_src,
                    ];
                })->all(),
            ];
        })->values()->all();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_orders' => $ordersCount,
                'total_spent' => $totalSpent,
                'trees_planted' => $treesPlanted,
                'member_since' => $user->created_at->format('M Y'),
            ],
            'orders' => $formattedOrders,
            'status' => session('status'),
        ]);
    }
}
