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
        Schema::create('source_documents', function (Blueprint $table) {
            $table->id();

            // Optional relation to a company
            $table->foreignId('company_id')
                ->nullable()
                ->constrained('companies')
                ->nullOnDelete();

            // What this document belongs to
            $table->string('document_type')->nullable();

            // Document information
            $table->string('title');
            $table->text('document_url');
            $table->string('file_type')->nullable();

            // Source information
            $table->string('source_exchange')->nullable();
            $table->string('source_name')->nullable();

            // When we retrieved it
            $table->timestamp('published_at')->nullable();
            $table->timestamp('fetched_at')->nullable();

            // Optional verification metadata
            $table->string('document_hash')->nullable();

            $table->timestamps();

            $table->index('document_type');
            $table->index('source_exchange');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('source_documents');
    }
};