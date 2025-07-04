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
        Schema::table('lendings', function (Blueprint $table) {
            // Change lend_date from date to datetime
            $table->datetime('lend_date')->change();

            // Change return_date from date to datetime
            $table->datetime('return_date')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lendings', function (Blueprint $table) {
            // Rollback: Change lend_date from datetime back to date
            $table->date('lend_date')->change();

            // Rollback: Change return_date from datetime back to date
            $table->date('return_date')->change();
        });
    }
};
