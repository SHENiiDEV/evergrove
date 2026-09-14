<?php

namespace App\Console\Commands;

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendTestMail extends Command
{
    protected $signature = 'app:test-mail {email : Recipient email address}';

    protected $description = 'Send a test email with PDF invoice attachment to verify SMTP settings';

    public function handle(): int
    {
        $recipient = $this->argument('email');
        $this->info("Attempting to send test email with PDF invoice to: {$recipient}...");

        $this->info('Current Mail Settings:');
        $this->line('  MAIL_MAILER: '.config('mail.default'));
        $this->line('  MAIL_HOST: '.config('mail.mailers.smtp.host'));
        $this->line('  MAIL_PORT: '.config('mail.mailers.smtp.port'));
        $this->line('  MAIL_ENCRYPTION: '.config('mail.mailers.smtp.encryption'));
        $this->line('  MAIL_USERNAME: '.config('mail.mailers.smtp.username'));
        $this->line('  MAIL_FROM_ADDRESS: '.config('mail.from.address'));

        try {
            $order = Order::with('items')->latest()->first() ?? new Order([
                'order_number' => 'EVG-TEST-001',
                'email' => $recipient,
                'first_name' => 'Alex',
                'last_name' => 'Vance',
                'phone' => '+44 7700 900077',
                'shipping_address_line1' => '71-75 Shelton Street',
                'city' => 'London',
                'postal_code' => 'WC2H 9JQ',
                'country_name' => 'United Kingdom',
                'shipping_method_name' => 'Standard Shipping (3–7 business days)',
                'shipping_cost' => 0.00,
                'subtotal' => 128.00,
                'discount_amount' => 12.80,
                'coupon_code' => 'EVER10',
                'total' => 115.20,
                'trees_planted' => 20,
                'payment_status' => 'paid',
                'status' => 'processing',
                'created_at' => now(),
            ]);

            if ($order->items->isEmpty()) {
                $order->setRelation('items', collect([
                    new OrderItem([
                        'title' => 'Rambler Fleck Sweater',
                        'color_name' => 'Fired Brick',
                        'size' => 'M',
                        'price' => 128.00,
                        'quantity' => 1,
                        'total' => 128.00,
                    ]),
                ]));
            }

            Mail::to($recipient)->send(new OrderConfirmationMail($order));

            $this->info("✅ Email successfully sent to {$recipient} with PDF invoice attached!");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('❌ Failed to send email!');
            $this->error('Error: '.$e->getMessage());
            $this->line($e->getTraceAsString());

            return self::FAILURE;
        }
    }
}
