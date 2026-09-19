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

            // Company identity
            $table->string('name');
            $table->string('symbol')->unique();
            $table->string('isin')->nullable()->unique();

            // Exchange identifiers
            $table->string('nse_symbol')->nullable();
            $table->string('bse_code')->nullable();

            // Classification
            $table->string('sector')->nullable();
            $table->string('industry')->nullable();

            // Source / provenance
            $table->string('source_exchange')->nullable();
            $table->text('source_url')->nullable();
            $table->timestamp('fetched_at')->nullable();

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