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
         Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->decimal('current_price', 10, 2);
            $table->decimal('previous_close', 10, 2)->nullable();
            $table->decimal('day_high', 10, 2)->nullable();
            $table->decimal('day_low', 10, 2)->nullable();
            $table->bigInteger('volume')->default(0);
            $table->decimal('change_amount', 10, 2)->nullable();
            $table->decimal('change_percentage', 5, 2)->nullable();
            $table->timestamp('last_updated')->useCurrent();
            $table->softDeletes(); // correct method
            $table->timestamps();
            
            $table->index(['company_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
