<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GiftCard extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'amount',
        'balance',
        'currency',
        'recipient_name',
        'recipient_email',
        'sender_name',
        'sender_email',
        'message',
        'theme',
        'is_active',
        'expires_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'balance' => 'float',
            'is_active' => 'boolean',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Generate a unique, elegant gift card code like EVG-8942-7193.
     */
    public static function generateCode(): string
    {
        do {
            $part1 = strtoupper(Str::random(4));
            $part2 = strtoupper(Str::random(4));
            $code = "EVG-GIFT-{$part1}-{$part2}";
        } while (static::where('code', $code)->exists() || Coupon::where('code', $code)->exists());

        return $code;
    }

    /**
     * Create gift card and corresponding coupon for instant checkout redemption.
     *
     * @param  array<string, mixed>  $attributes
     */
    public static function issue(array $attributes): self
    {
        $code = $attributes['code'] ?? self::generateCode();
        $amount = (float) $attributes['amount'];

        $giftCard = self::create([
            'code' => $code,
            'amount' => $amount,
            'balance' => $amount,
            'currency' => $attributes['currency'] ?? 'EUR',
            'recipient_name' => $attributes['recipient_name'] ?? null,
            'recipient_email' => $attributes['recipient_email'] ?? null,
            'sender_name' => $attributes['sender_name'] ?? null,
            'sender_email' => $attributes['sender_email'] ?? null,
            'message' => $attributes['message'] ?? null,
            'theme' => $attributes['theme'] ?? 'forest',
            'is_active' => true,
            'expires_at' => $attributes['expires_at'] ?? null,
        ]);

        // Create or update corresponding Coupon
        Coupon::updateOrCreate(
            ['code' => $code],
            [
                'type' => 'fixed',
                'value' => $amount,
                'min_order_amount' => 0.0,
                'is_active' => true,
                'expires_at' => $giftCard->expires_at,
            ]
        );

        return $giftCard;
    }
}
