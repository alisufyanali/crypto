<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('role')->nullable();
            $table->string('type'); // login, create, approve, download etc
            $table->text('message'); // notification text
            $table->boolean('is_read')->default(false); // read/unread
            $table->text('read_at]')->nullable(); // read/unread
            $table->unsignedBigInteger('transaction_no')->default(0);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['role']);

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
