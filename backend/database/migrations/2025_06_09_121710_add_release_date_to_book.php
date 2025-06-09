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
        Schema::table('books', function (Blueprint $table) {
            $table->date('release_date')->nullable()->after('img');
            // total_page
            $table->integer('total_page')->nullable()->after('release_date');
            // status
            $table->enum('status', ['active', 'inactive'])->default('active')->after('total_page');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn('release_date');
            $table->dropColumn('total_page');
            $table->dropColumn('status');
        });
    }
};
