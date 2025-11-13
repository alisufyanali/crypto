<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // SQLite ke liye alag approach - pehle check karein kya table exist karti hai
        if (Schema::hasTable('transactions')) {
            // Agar table pehle se hai, toh direct columns add karein
            Schema::table('transactions', function (Blueprint $table) {
                if (!Schema::hasColumn('transactions', 'adjusted_amount')) {
                    $table->decimal('adjusted_amount', 15, 2)->nullable()->after('amount');
                }
                
                if (!Schema::hasColumn('transactions', 'fees')) {
                    $table->decimal('fees', 15, 2)->default(0)->after('adjusted_amount');
                }
                
                if (!Schema::hasColumn('transactions', 'status')) {
                    $table->string('status')->default('pending')->after('fees');
                }
                
                if (!Schema::hasColumn('transactions', 'comments')) {
                    $table->text('comments')->nullable()->after('description');
                }
                
                if (!Schema::hasColumn('transactions', 'admin_notes')) {
                    $table->text('admin_notes')->nullable()->after('comments');
                }
                
                if (!Schema::hasColumn('transactions', 'processed_by')) {
                    $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null')->after('admin_notes');
                }
                
                if (!Schema::hasColumn('transactions', 'processed_at')) {
                    $table->timestamp('processed_at')->nullable()->after('processed_by');
                }
            });

            // SQLite mein enum nahi hota, isliye type column ko as it is chhod denge
            // Agar 'fee' type add karna hai toh application level pe handle karenge

        } else {
            // Agar table nahi hai toh nayi table banayein
            Schema::create('transactions', function (Blueprint $table) {
                $table->id();
                $table->string('transaction_id')->unique();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null');
                $table->string('type'); // SQLite mein enum nahi, string use karenge
                $table->decimal('amount', 15, 2);
                $table->decimal('adjusted_amount', 15, 2)->nullable();
                $table->decimal('fees', 15, 2)->default(0);
                $table->string('status')->default('pending');
                $table->string('description');
                $table->text('comments')->nullable();
                $table->text('admin_notes')->nullable();
                $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamp('processed_at')->nullable();
                $table->json('metadata')->nullable();
                $table->softDeletes();
                $table->timestamps();
                
                $table->index(['user_id', 'type']);
                $table->index('transaction_id');
                $table->index('status');
                $table->index('created_at');
            });
        }

        // Common indexes add karein
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasIndex('transactions', 'transactions_status_index')) {
                $table->index('status');
            }
            if (!Schema::hasIndex('transactions', 'transactions_processed_at_index')) {
                $table->index('processed_at');
            }
        });
    }

    public function down()
    {
        // Rollback ke liye naye columns drop karein
        Schema::table('transactions', function (Blueprint $table) {
            $columnsToDrop = [
                'adjusted_amount',
                'fees', 
                'status',
                'comments',
                'admin_notes',
                'processed_by',
                'processed_at'
            ];
            
            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('transactions', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        // Indexes drop karein
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndexIfExists('transactions_status_index');
            $table->dropIndexIfExists('transactions_processed_at_index');
        });
    }
};