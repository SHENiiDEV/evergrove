<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\GiftCard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GiftCardController extends Controller
{
    /**
     * Preset amounts in EUR.
     *
     * @var list<int>
     */
    public const PRESETS = [25, 50, 100, 150, 250, 500];

    /**
     * Display the Gift Card Studio page.
     */
    public function index(): Response
    {
        return Inertia::render('GiftCards/Index', [
            'presets' => self::PRESETS,
            'defaultAmount' => 100,
            'currency' => config('shop.currency', 'EUR'),
            'company' => config('shop.company'),
        ]);
    }

    /**
     * Generate / Issue a new Digital Gift Card on the fly.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:5', 'max:5000'],
            'recipient_name' => ['nullable', 'string', 'max:100'],
            'recipient_email' => ['nullable', 'email', 'max:255'],
            'sender_name' => ['nullable', 'string', 'max:100'],
            'sender_email' => ['nullable', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'max:500'],
            'theme' => ['nullable', 'string', 'in:forest,midnight,alpine,earth'],
        ]);

        $amount = round((float) $validated['amount'], 2);

        $giftCard = GiftCard::issue([
            'amount' => $amount,
            'recipient_name' => $validated['recipient_name'] ?? null,
            'recipient_email' => $validated['recipient_email'] ?? null,
            'sender_name' => $validated['sender_name'] ?? null,
            'sender_email' => $validated['sender_email'] ?? null,
            'message' => $validated['message'] ?? null,
            'theme' => $validated['theme'] ?? 'forest',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Gift Card {$giftCard->code} generated successfully!",
            'gift_card' => [
                'id' => $giftCard->id,
                'code' => $giftCard->code,
                'amount' => $giftCard->amount,
                'balance' => $giftCard->balance,
                'currency' => $giftCard->currency,
                'recipient_name' => $giftCard->recipient_name,
                'recipient_email' => $giftCard->recipient_email,
                'sender_name' => $giftCard->sender_name,
                'sender_email' => $giftCard->sender_email,
                'message' => $giftCard->message,
                'theme' => $giftCard->theme,
                'created_at' => $giftCard->created_at->format('M d, Y'),
                'expires_at' => $giftCard->expires_at ? $giftCard->expires_at->format('M d, Y') : 'Never (Lifetime)',
            ],
        ], 201);
    }

    /**
     * Check gift card balance by code.
     */
    public function checkBalance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $code = strtoupper(trim($validated['code']));

        /** @var GiftCard|null $card */
        $card = GiftCard::where('code', $code)->first();

        if ($card) {
            return response()->json([
                'found' => true,
                'valid' => $card->is_active,
                'code' => $card->code,
                'balance' => $card->balance,
                'initial_amount' => $card->amount,
                'currency' => $card->currency,
                'theme' => $card->theme,
                'recipient_name' => $card->recipient_name,
                'expires_at' => $card->expires_at ? $card->expires_at->format('M d, Y') : 'Never (Lifetime)',
            ]);
        }

        // Fallback check against standard Coupon
        /** @var Coupon|null $coupon */
        $coupon = Coupon::where('code', $code)->first();

        if ($coupon && $coupon->isValid()) {
            return response()->json([
                'found' => true,
                'valid' => true,
                'code' => $coupon->code,
                'balance' => $coupon->value,
                'initial_amount' => $coupon->value,
                'currency' => 'EUR',
                'theme' => 'forest',
                'recipient_name' => null,
                'expires_at' => $coupon->expires_at ? $coupon->expires_at->format('M d, Y') : 'Never (Lifetime)',
            ]);
        }

        return response()->json([
            'found' => false,
            'valid' => false,
            'message' => 'No active gift card found with this code.',
        ], 404);
    }
}
