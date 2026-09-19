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
        Schema::create('ipos', function (Blueprint $table) {
            $table->id();

            // Company relation
            $table->foreignId('company_id')
                ->nullable()
                ->constrained('companies')
                ->nullOnDelete();

            // IPO identity
            $table->string('name');
            $table->string('symbol')->nullable();

            // IPO type/status
            $table->string('issue_type')->nullable();
            $table->enum('status', [
                'upcoming',
                'open',
                'closed',
                'listed'
            ])->default('upcoming');

            // IPO dates
            $table->date('open_date')->nullable();
            $table->date('close_date')->nullable();
            $table->date('listing_date')->nullable();

            // Price information
            $table->decimal('price_band_min', 15, 4)->nullable();
            $table->decimal('price_band_max', 15, 4)->nullable();
            $table->decimal('face_value', 15, 4)->nullable();

            // Issue information
            $table->decimal('issue_size', 20, 4)->nullable();
            $table->string('issue_size_unit')->nullable();

            // Source / provenance
            $table->string('source_exchange')->nullable();
            $table->text('source_url')->nullable();
            $table->text('source_document')->nullable();
            $table->timestamp('fetched_at')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('open_date');
            $table->index('listing_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ipos');
    }
};