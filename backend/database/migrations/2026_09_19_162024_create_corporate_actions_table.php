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
        Schema::create('corporate_actions', function (Blueprint $table) {
            $table->id();

            // Company relation
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            // Corporate action type
            $table->enum('action_type', [
                'dividend',
                'bonus',
                'split',
                'rights',
                'buyback',
                'other'
            ]);

            // Action details
            $table->string('title');
            $table->text('description')->nullable();

            // Important dates
            $table->date('announcement_date')->nullable();
            $table->date('ex_date')->nullable();
            $table->date('record_date')->nullable();
            $table->date('payment_date')->nullable();

            // Dividend-specific information
            $table->decimal('amount', 15, 4)->nullable();
            $table->string('currency', 10)->default('INR');

            // Source / provenance
            $table->string('source_exchange')->nullable();
            $table->text('source_url')->nullable();
            $table->text('source_document')->nullable();
            $table->timestamp('fetched_at')->nullable();

            $table->timestamps();

            // Useful index for company + action type
            $table->index(['company_id', 'action_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('corporate_actions');
    }
};