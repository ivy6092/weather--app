<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\WeatherController;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to the Weather API',
        'status' => 'active',
        'version' => '1.0'
    ]);
});

// Weather API routes
Route::get('/weather', [WeatherController::class, 'index']);
Route::get('/weather/forecast', [WeatherController::class, 'forecast']);
Route::get('/weather/coordinates', [WeatherController::class, 'show']);
Route::get('/weather/formatted', [WeatherController::class, 'getFormattedWeather']);