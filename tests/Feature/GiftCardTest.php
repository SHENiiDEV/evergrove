<?php

namespace Tests\Feature;

use App\Models\GiftCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GiftCardTest extends TestCase
{
    use RefreshDatabase;

    public function test_gift_cards_page_renders(): void
    {
        $response = $this->get('/gift-cards');

        $response->assertStatus(200);
    }

    public function test_can_generate_gift_card_and_sync_coupon(): void
    {
        $payload = [
            'amount' => 150,
            'recipient_name' => 'John Doe',
            'recipient_email' => 'john@example.com',
            'sender_name' => 'Jane Smith',
            'sender_email' => 'jane@example.com',
            'message' => 'Happy Birthday!',
            'theme' => 'midnight',
        ];

        $response = $this->postJson('/gift-cards/generate', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'gift_card' => [
                    'amount' => 150,
                    'recipient_name' => 'John Doe',
                    'theme' => 'midnight',
                ],
            ]);

        $code = $response->json('gift_card.code');
        $this->assertNotEmpty($code);

        $this->assertDatabaseHas('gift_cards', [
            'code' => $code,
            'amount' => 150,
            'recipient_name' => 'John Doe',
        ]);

        $this->assertDatabaseHas('coupons', [
            'code' => $code,
            'type' => 'fixed',
            'value' => 150,
            'is_active' => true,
        ]);
    }

    public function test_can_check_gift_card_balance(): void
    {
        $giftCard = GiftCard::issue([
            'amount' => 75,
            'recipient_name' => 'Alice',
            'sender_name' => 'Bob',
            'theme' => 'forest',
        ]);

        $response = $this->postJson('/gift-cards/balance', [
            'code' => $giftCard->code,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'found' => true,
                'valid' => true,
                'code' => $giftCard->code,
                'balance' => 75,
                'initial_amount' => 75,
            ]);
    }

    public function test_check_balance_returns_404_for_invalid_code(): void
    {
        $response = $this->postJson('/gift-cards/balance', [
            'code' => 'INVALID-CODE-999',
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'found' => false,
                'valid' => false,
            ]);
    }
}
