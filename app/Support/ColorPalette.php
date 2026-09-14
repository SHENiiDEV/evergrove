<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Turns the feed's shouty colour names ("METEORITE BLACK HEATHER") into a
 * display label, a swatch colour and a filterable colour family.
 */
class ColorPalette
{
    /**
     * Exact matches for the colours present in the feed.
     *
     * @var array<string, string>
     */
    private const SWATCHES = [
        'meteorite black' => '#191919',
        'meteorite black heather' => '#2A2A2A',
        'harbour grey heather fleck' => '#8E8F89',
        'ashwood heather' => '#7A6A5C',
        'midnight blue cabin plaid' => '#2B3A5B',
    ];

    /**
     * Keyword fallbacks, checked in order, so unknown colours still render.
     *
     * @var array<string, array{hex: string, family: string}>
     */
    private const KEYWORDS = [
        'black' => ['hex' => '#191919', 'family' => 'black'],
        'charcoal' => ['hex' => '#3A3A3A', 'family' => 'grey'],
        'slate' => ['hex' => '#555B60', 'family' => 'grey'],
        'grey' => ['hex' => '#8E8F89', 'family' => 'grey'],
        'gray' => ['hex' => '#8E8F89', 'family' => 'grey'],
        'bone' => ['hex' => '#EDE9E1', 'family' => 'white'],
        'white' => ['hex' => '#F4F4F1', 'family' => 'white'],
        'sandstone' => ['hex' => '#C9BBA5', 'family' => 'beige'],
        'sand' => ['hex' => '#D3C4AC', 'family' => 'beige'],
        'ashwood' => ['hex' => '#7A6A5C', 'family' => 'brown'],
        'brick' => ['hex' => '#7E3B2B', 'family' => 'red'],
        'clay' => ['hex' => '#A9583F', 'family' => 'brown'],
        'brown' => ['hex' => '#6B4F3A', 'family' => 'brown'],
        'olive' => ['hex' => '#4A4F3C', 'family' => 'green'],
        'forest' => ['hex' => '#2F4636', 'family' => 'green'],
        'green' => ['hex' => '#3E5A45', 'family' => 'green'],
        'glacier' => ['hex' => '#9FB6C4', 'family' => 'blue'],
        'midnight' => ['hex' => '#2B3A5B', 'family' => 'blue'],
        'navy' => ['hex' => '#1F2A44', 'family' => 'blue'],
        'blue' => ['hex' => '#33517A', 'family' => 'blue'],
        'red' => ['hex' => '#8E2B22', 'family' => 'red'],
    ];

    /**
     * @return array{name: string, slug: string, hex: string, family: string}
     */
    public static function resolve(string $name, ?string $hex = null): array
    {
        $key = Str::lower(trim($name));

        return [
            'name' => Str::title($key),
            'slug' => Str::slug($key),
            'hex' => $hex ?? self::SWATCHES[$key] ?? self::match($key)['hex'],
            'family' => self::match($key)['family'],
        ];
    }

    /**
     * @return array{hex: string, family: string}
     */
    private static function match(string $key): array
    {
        foreach (self::KEYWORDS as $keyword => $swatch) {
            if (str_contains($key, $keyword)) {
                return $swatch;
            }
        }

        return ['hex' => '#8E8F89', 'family' => 'other'];
    }
}
