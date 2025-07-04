<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule the overdue lending update to run daily at midnight
Schedule::command('lending:update-overdue')
    ->daily()
    ->at('00:00')
    ->description('Update lending status to overdue for expired loans');
