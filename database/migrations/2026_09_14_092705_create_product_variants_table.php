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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->unsignedBigInteger('shopify_variant_id')->nullable()->index();
            $table->string('title');
            $table->string('option1_color')->nullable();
            $table->string('option2_size')->nullable()->index();
            $table->string('option3')->nullable();
            $table->string('sku')->nullable()->index();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->boolean('available')->default(true)->index();
            $table->integer('grams')->nullable();
            $table->integer('position')->default(1);
            $table->unsignedBigInteger('featured_image_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
