<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | Prices in the product feed are plain decimal strings. The storefront
    | formats them client side with Intl.NumberFormat using these values.
    |
    */

    'currency' => env('SHOP_CURRENCY', 'EUR'),

    'locale' => env('SHOP_LOCALE', 'en-IE'),

    /*
    |--------------------------------------------------------------------------
    | Product feed
    |--------------------------------------------------------------------------
    |
    | Shopify-shaped JSON used while the catalogue lives outside the database.
    | ProductCatalog normalises it, so replacing this with Eloquent models later
    | does not change anything the React pages receive.
    |
    */

    'feed' => database_path('data/products.json'),

    /*
    |--------------------------------------------------------------------------
    | Demo colourways
    |--------------------------------------------------------------------------
    |
    | The sample feed ships a single colour per product, which leaves the colour
    | filter and the swatch row with nothing to show. Each feed product is
    | expanded into this many colourways, reusing the same photography. Set to 1
    | to show only the colours that genuinely exist in the feed.
    |
    */

    'colorways' => (int) env('SHOP_COLORWAYS', 3),

    'per_page' => 24,

    /*
    |--------------------------------------------------------------------------
    | Company Legal & Contact Information
    |--------------------------------------------------------------------------
    */
    'company' => [
        'name' => env('COMPANY_NAME', 'EverGrove Retail Ltd'),
        'number' => env('COMPANY_NUMBER', '14892341'),
        'address' => env('COMPANY_ADDRESS', '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'),
        'email' => env('COMPANY_EMAIL', 'info@ever-grove.co.uk'),
    ],

];
