<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique()->index();
            $table->string('email')->index();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('shipping_address_line1');
            $table->string('shipping_address_line2')->nullable();
            $table->string('city');
            $table->string('postal_code');
            $table->string('country_code', 10)->default('DE');
            $table->string('country_name')->default('Germany');
            $table->string('shipping_method_name')->default('Standard Shipping (3–7 business days)');
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->string('coupon_code')->nullable();
            $table->decimal('total', 10, 2)->default(0.00);
            $table->integer('trees_planted')->default(0);
            $table->string('payment_method')->default('card');
            $table->string('payment_status')->default('paid');
            $table->string('status')->default('processing');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
