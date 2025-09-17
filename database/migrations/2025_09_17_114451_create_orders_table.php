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
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['buy', 'sell']);
            $table->integer('quantity');
            $table->decimal('price_per_share', 10, 2);
            $table->decimal('total_amount', 15, 2);
            $table->enum('status', ['pending', 'approved', 'rejected', 'executed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('executed_by')->nullable()->constrained('users');
            $table->timestamp('executed_at')->nullable();
            $table->softDeletes(); // correct method
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['company_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
