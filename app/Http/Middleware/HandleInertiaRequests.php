<?php

namespace App\Http\Middleware;

use App\Support\Navigation;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $navigation = app(Navigation::class);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'navigation' => $navigation->main(),
            'footerColumns' => $navigation->footerColumns(),
            'shop' => [
                'name' => config('app.name'),
                'currency' => config('shop.currency'),
                'locale' => config('shop.locale'),
            ],
        ];
    }
}
