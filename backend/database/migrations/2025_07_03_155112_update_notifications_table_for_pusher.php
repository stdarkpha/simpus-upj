<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table
        Schema::dropIfExists('notifications_temp');
        
        // Create new table with correct structure
        Schema::create('notifications_temp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['info', 'success', 'warning', 'error']);
            $table->string('title');
            $table->text('message')->nullable();
            $table->json('data')->nullable();
            $table->timestamp('timestamp')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // Copy data from old table to new table, mapping old types and desc to message
        DB::statement("
            INSERT INTO notifications_temp (id, user_id, type, title, message, timestamp, is_read, created_at, updated_at)
            SELECT 
                id, 
                user_id, 
                CASE 
                    WHEN type = 'lending' THEN 'info'
                    WHEN type = 'returning' THEN 'info' 
                    WHEN type = 'reminder' THEN 'warning'
                    ELSE 'info'
                END as type,
                title,
                COALESCE(message, '') as message,
                timestamp,
                COALESCE(is_read, 0) as is_read,
                created_at,
                updated_at
            FROM notifications
        ");

        // Drop old table and rename temp table
        Schema::dropIfExists('notifications');
        Schema::rename('notifications_temp', 'notifications');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate original table structure
        Schema::dropIfExists('notifications_temp');
        
        Schema::create('notifications_temp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['lending', 'returning', 'reminder']);
            $table->string('title');
            $table->text('desc')->nullable();
            $table->timestamp('timestamp')->nullable();
            $table->enum('variant', ['success', 'warning', 'error'])->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // Copy data back, mapping new types to old
        DB::statement("
            INSERT INTO notifications_temp (id, user_id, type, title, desc, timestamp, variant, is_read, created_at, updated_at)
            SELECT 
                id, 
                user_id, 
                CASE 
                    WHEN type = 'info' THEN 'lending'
                    WHEN type = 'success' THEN 'lending' 
                    WHEN type = 'warning' THEN 'reminder'
                    WHEN type = 'error' THEN 'reminder'
                    ELSE 'lending'
                END as type,
                title,
                COALESCE(message, '') as desc,
                timestamp,
                'success' as variant,
                is_read,
                created_at,
                updated_at
            FROM notifications
        ");

        Schema::dropIfExists('notifications');
        Schema::rename('notifications_temp', 'notifications');
    }
};
