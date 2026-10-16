<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Support\WorldCountries;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'countries' => WorldCountries::allowed(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $allowedCountries = WorldCountries::allowed();

        $validated = $request->validate([
            'first_name' => ['required_without:name', 'nullable', 'string', 'max:100'],
            'last_name' => ['required_without:name', 'nullable', 'string', 'max:100'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address_line1' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'in:'.implode(',', $allowedCountries)],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'terms' => ['accepted'],
        ], [
            'terms.accepted' => 'You must agree to the Terms & Conditions and Privacy Policy.',
            'country.in' => 'The selected country is not available for registration.',
        ]);

        $firstName = $validated['first_name'] ?? (explode(' ', trim($validated['name'] ?? ''))[0] ?? '');
        $lastName = $validated['last_name'] ?? (implode(' ', array_slice(explode(' ', trim($validated['name'] ?? '')), 1)) ?: '');
        $fullName = trim("{$firstName} {$lastName}") ?: ($validated['name'] ?? 'Customer');

        $user = User::create([
            'name' => $fullName,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'address_line1' => $validated['address_line1'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'terms_accepted_at' => now(),
            'password' => Hash::make($validated['password']),
        ]);

        Order::where('email', $user->email)
            ->whereNull('user_id')
            ->update(['user_id' => $user->id]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
