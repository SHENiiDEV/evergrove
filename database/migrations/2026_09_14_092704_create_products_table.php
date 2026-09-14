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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shopify_id')->nullable()->index();
            $table->unsignedBigInteger('group_id')->nullable()->index();
            $table->string('title');
            $table->string('handle')->unique()->index();
            $table->string('vendor')->nullable();
            $table->string('product_type')->nullable();
            $table->string('gender')->default('men')->index();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->longText('description_html')->nullable();
            $table->decimal('price', 10, 2)->default(0.00)->index();
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->boolean('available')->default(true)->index();
            $table->json('tags')->nullable();
            $table->json('badges')->nullable();
            $table->string('primary_color_name')->nullable();
            $table->string('primary_color_slug')->nullable()->index();
            $table->string('primary_color_hex')->nullable();
            $table->string('primary_color_family')->nullable()->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
