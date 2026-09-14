<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function applyCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:30'],
            'subtotal' => ['required', 'numeric', 'min:0'],
        ]);

        $code = strtoupper(trim($validated['code']));
        $subtotal = (float) $validated['subtotal'];

        /** @var Coupon|null $coupon */
        $coupon = Coupon::where('code', $code)->first();

        if (! $coupon || ! $coupon->isValid($subtotal)) {
            $message = 'Coupon code is invalid or expired.';
            if ($coupon && $coupon->min_order_amount && $subtotal < $coupon->min_order_amount) {
                $message = "Minimum order amount for this coupon is €{$coupon->min_order_amount}.";
            }

            return response()->json([
                'valid' => false,
                'message' => $message,
            ], 422);
        }

        $discount = $coupon->calculateDiscount($subtotal);

        return response()->json([
            'valid' => true,
            'message' => "Coupon {$coupon->code} applied successfully!",
            'coupon' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'discount' => $discount,
            ],
        ]);
    }
}
