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
       Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->integer('shares_owned')->default(0);
            $table->decimal('average_cost', 10, 2)->default(0);
            $table->decimal('total_invested', 15, 2)->default(0);
            $table->decimal('current_value', 15, 2)->default(0);
            $table->decimal('unrealized_pnl', 15, 2)->default(0);
            $table->decimal('realized_pnl', 15, 2)->default(0);
            $table->softDeletes(); // correct method
            $table->timestamps();
            
            $table->unique(['user_id', 'company_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
