<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('account_balances', function (Blueprint $table) {
            if (!Schema::hasColumn('account_balances', 'pending_withdrawals')) {
                $table->decimal('pending_withdrawals', 15, 2)->default(0)->after('cash_balance');
            }
        });
    }

    public function down()
    {
        Schema::table('account_balances', function (Blueprint $table) {
            if (Schema::hasColumn('account_balances', 'pending_withdrawals')) {
                $table->dropColumn('pending_withdrawals');
            }
        });
    }
};