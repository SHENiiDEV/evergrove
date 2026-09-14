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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_handle')->index();
            $table->string('title');
            $table->string('color_name')->nullable();
            $table->string('size');
            $table->string('sku')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->integer('quantity')->default(1);
            $table->decimal('total', 10, 2)->default(0.00);
            $table->text('image_src')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
