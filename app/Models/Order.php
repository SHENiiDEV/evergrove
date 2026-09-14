<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'email',
        'first_name',
        'last_name',
        'phone',
        'shipping_address_line1',
        'shipping_address_line2',
        'city',
        'postal_code',
        'country_code',
        'country_name',
        'shipping_method_name',
        'shipping_cost',
        'subtotal',
        'discount_amount',
        'coupon_code',
        'total',
        'trees_planted',
        'payment_method',
        'payment_status',
        'status',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'shipping_cost' => 'float',
            'subtotal' => 'float',
            'discount_amount' => 'float',
            'total' => 'float',
            'trees_planted' => 'integer',
        ];
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public static function generateOrderNumber(): string
    {
        do {
            $number = 'EVG-'.date('Y').'-'.strtoupper(Str::random(6));
        } while (self::where('order_number', $number)->exists());

        return $number;
    }
}
