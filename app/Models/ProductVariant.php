<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'shopify_variant_id',
        'title',
        'option1_color',
        'option2_size',
        'option3',
        'sku',
        'price',
        'compare_at_price',
        'available',
        'grams',
        'position',
        'featured_image_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'float',
            'compare_at_price' => 'float',
            'available' => 'boolean',
            'grams' => 'integer',
            'position' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
