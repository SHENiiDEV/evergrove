<?php

namespace App\Providers;

use App\Support\ProductCatalog;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // The catalogue parses the JSON feed once per request rather than once
        // per injection point.
        $this->app->singleton(ProductCatalog::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
