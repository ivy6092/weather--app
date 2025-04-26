<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class WeatherController extends Controller
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openweathermap.org/data/2.5/';

    public function __construct()
    {
        $this->apiKey = '5d6093d02914ad7540cc85d1683fccb9';
    }

    /**
     * Display current weather for a city
     */
    public function index(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
            'units' => 'sometimes|in:standard,metric,imperial',
        ]);

        $city = $request->query('city');
        $units = $request->query('units', 'metric'); // Default to metric

        try {
            $response = Http::get($this->baseUrl . 'weather', [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => $units,
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Weather data not found',
                'message' => $response->json()['message'] ?? 'Unknown error'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get formatted weather with forecast data
     */
    public function getFormattedWeather(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
            'units' => 'sometimes|in:standard,metric,imperial',
        ]);

        $city = $request->query('city');
        $units = $request->query('units', 'metric'); // Default to metric

        try {
            // Get current weather
            $currentResponse = Http::get($this->baseUrl . 'weather', [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => $units,
            ]);

            if (!$currentResponse->successful()) {
                return response()->json([
                    'error' => 'Weather data not found',
                    'message' => $currentResponse->json()['message'] ?? 'Unknown error'
                ], $currentResponse->status());
            }

            $current = $currentResponse->json();

            // Get forecast data
            $forecastResponse = Http::get($this->baseUrl . 'forecast', [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => $units,
                'cnt' => 24, // Get 3 days worth of data (8 points per day)
            ]);

            if (!$forecastResponse->successful()) {
                return response()->json([
                    'error' => 'Forecast data not found',
                    'message' => $forecastResponse->json()['message'] ?? 'Unknown error'
                ], $forecastResponse->status());
            }

            $forecastData = $forecastResponse->json();

            // Format the current date
            $currentDate = Carbon::now();
            
            // Process forecast data to get daily forecasts
            $dailyForecasts = [];
            $processedDates = [];
            
            // Start from the next day
            $startDate = Carbon::now()->addDay()->startOfDay();
            
            foreach ($forecastData['list'] as $forecast) {
                $forecastDate = Carbon::createFromTimestamp($forecast['dt']);
                
                // Skip forecasts for today
                if ($forecastDate->format('Y-m-d') === Carbon::now()->format('Y-m-d')) {
                    continue;
                }
                
                $dateKey = $forecastDate->format('Y-m-d');
                
                // Only take one forecast per day (noon forecast preferred)
                if (!in_array($dateKey, $processedDates) && count($processedDates) < 3) {
                    $processedDates[] = $dateKey;
                    
                    $dailyForecasts[] = [
                        'date' => $forecastDate->format('d M'),
                        'temperature' => round($forecast['main']['temp']),
                        'condition' => $forecast['weather'][0]['main']
                    ];
                }
            }

            // Format the response in the desired structure
            $formattedResponse = [
                'city' => $current['name'],
                'country' => $current['sys']['country'],
                'temperature' => round($current['main']['temp']),
                'condition' => $current['weather'][0]['main'],
                'windSpeed' => round($current['wind']['speed']),
                'humidity' => $current['main']['humidity'],
                'date' => $currentDate->format('jS M Y'),
                'forecast' => $dailyForecasts
            ];

            return response()->json($formattedResponse);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get forecast for a city
     */
    public function forecast(Request $request)
    {
        // Existing forecast method...
    }

    /**
     * Display weather for a specific location by coordinates
     */
    public function show(Request $request, string $id = null)
    {
        // Existing show method...
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return response()->json(['message' => 'Method not available'], 405);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return response()->json(['message' => 'Method not available'], 405);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return response()->json(['message' => 'Method not available'], 405);
    }
}