<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
            ->has('countries')
        );
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'first_name' => 'Alex',
            'last_name' => 'Vance',
            'email' => 'alex@example.com',
            'phone' => '+44 7911 123456',
            'date_of_birth' => '1995-04-12',
            'address_line1' => '10 Downing Street',
            'city' => 'London',
            'country' => 'United Kingdom',
            'postal_code' => 'SW1A 2AA',
            'password' => 'password123!',
            'password_confirmation' => 'password123!',
            'terms' => true,
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'alex@example.com',
            'first_name' => 'Alex',
            'last_name' => 'Vance',
            'country' => 'United Kingdom',
            'city' => 'London',
        ]);
    }

    public function test_registration_requires_terms_acceptance(): void
    {
        $response = $this->post('/register', [
            'first_name' => 'Alex',
            'last_name' => 'Vance',
            'email' => 'alex.noterms@example.com',
            'phone' => '+44 7911 123456',
            'date_of_birth' => '1995-04-12',
            'address_line1' => '10 Downing Street',
            'city' => 'London',
            'country' => 'United Kingdom',
            'postal_code' => 'SW1A 2AA',
            'password' => 'password123!',
            'password_confirmation' => 'password123!',
            'terms' => false,
        ]);

        $response->assertSessionHasErrors(['terms']);
        $this->assertGuest();
    }

    public function test_excluded_countries_cannot_be_used_for_registration(): void
    {
        $excludedCountries = [
            'Russia',
            'Sudan',
            'Iran',
            'North Korea',
            'Syria',
            'Belarus',
        ];

        foreach ($excludedCountries as $country) {
            $response = $this->post('/register', [
                'first_name' => 'User',
                'last_name' => 'Test',
                'email' => "user.{$country}@example.com",
                'phone' => '+123456789',
                'date_of_birth' => '1990-01-01',
                'address_line1' => 'Main street 1',
                'city' => 'Capital',
                'country' => $country,
                'postal_code' => '12345',
                'password' => 'password123!',
                'password_confirmation' => 'password123!',
                'terms' => true,
            ]);

            $response->assertSessionHasErrors(['country']);
            $this->assertGuest();
        }
    }
}
