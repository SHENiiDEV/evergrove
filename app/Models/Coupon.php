<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'is_active',
        'expires_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'float',
            'min_order_amount' => 'float',
            'is_active' => 'boolean',
            'expires_at' => 'datetime',
        ];
    }

    public function isValid(float $subtotal = 0): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->min_order_amount && $subtotal < $this->min_order_amount) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $subtotal): float
    {
        if (! $this->isValid($subtotal)) {
            return 0.0;
        }

        if ($this->type === 'percent') {
            return round(($subtotal * $this->value) / 100, 2);
        }

        if ($this->type === 'fixed') {
            return min($subtotal, $this->value);
        }

        return 0.0;
    }
}
