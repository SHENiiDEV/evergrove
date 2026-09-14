<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'shopify_id',
        'group_id',
        'title',
        'handle',
        'vendor',
        'product_type',
        'gender',
        'category_id',
        'description_html',
        'price',
        'compare_at_price',
        'available',
        'tags',
        'badges',
        'primary_color_name',
        'primary_color_slug',
        'primary_color_hex',
        'primary_color_family',
        'published_at',
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
            'tags' => 'array',
            'badges' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<ProductVariant, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position');
    }

    /**
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }
}
