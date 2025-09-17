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
       Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('symbol')->unique(); // e.g., BK, BRD
            $table->text('description')->nullable();
            $table->string('sector')->nullable();
            $table->decimal('market_cap', 15, 2)->nullable();
            $table->integer('shares_outstanding')->nullable();
            $table->string('logo_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes(); // correct method
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
