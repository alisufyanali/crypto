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
       Schema::create('account_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('cash_balance', 15, 2)->default(0);
            $table->decimal('invested_amount', 15, 2)->default(0);
            $table->decimal('total_portfolio_value', 15, 2)->default(0);
            $table->decimal('total_pnl', 15, 2)->default(0);
            $table->softDeletes(); // correct method
            $table->timestamps();
            
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_balances');
    }
};
