"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Wind, Droplets, MapPin, Calendar, ArrowUpRight, Thermometer, RefreshCcw } from 'lucide-react'

interface ForecastDay {
  date: string
  temperature: number
  condition: string
}

interface WeatherData {
  city: string
  country: string
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  date: string
  forecast: ForecastDay[]
}

// Custom weather icon component with Tailwind classes
function WeatherIcon({ condition, size = 100 }: { condition: string; size?: number }) {
  // Handle different weather conditions with appropriate icons
  const normalizedCondition = condition.toLowerCase();

  if (normalizedCondition.includes("sunny") || normalizedCondition.includes("clear")) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="25" stroke="#F59E0B" strokeWidth="3" fill="#FCD34D" fillOpacity="0.3" />
          <line x1="50" y1="15" x2="50" y2="25" stroke="#F59E0B" strokeWidth="3" />
          <line x1="50" y1="75" x2="50" y2="85" stroke="#F59E0B" strokeWidth="3" />
          <line x1="15" y1="50" x2="25" y2="50" stroke="#F59E0B" strokeWidth="3" />
          <line x1="75" y1="50" x2="85" y2="50" stroke="#F59E0B" strokeWidth="3" />
          <line x1="25" y1="25" x2="32" y2="32" stroke="#F59E0B" strokeWidth="3" />
          <line x1="68" y1="68" x2="75" y2="75" stroke="#F59E0B" strokeWidth="3" />
          <line x1="25" y1="75" x2="32" y2="68" stroke="#F59E0B" strokeWidth="3" />
          <line x1="68" y1="32" x2="75" y2="25" stroke="#F59E0B" strokeWidth="3" />
        </svg>
      </div>
    )
  } else if (normalizedCondition.includes("cloud") || normalizedCondition.includes("overcast")) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25 40C16.7157 40 10 46.7157 10 55C10 63.2843 16.7157 70 25 70H75C83.2843 70 90 63.2843 90 55C90 46.7157 83.2843 40 75 40C75 31.7157 68.2843 25 60 25C51.7157 25 45 31.7157 45 40H25Z"
            fill="white"
            stroke="#6B7280"
            strokeWidth="3"
          />
        </svg>
      </div>
    )
  } else if (normalizedCondition.includes("rain")) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25 40C16.7157 40 10 46.7157 10 55C10 63.2843 16.7157 70 25 70H75C83.2843 70 90 63.2843 90 55C90 46.7157 83.2843 40 75 40C75 31.7157 68.2843 25 60 25C51.7157 25 45 31.7157 45 40H25Z"
            fill="white"
            stroke="#6B7280"
            strokeWidth="3"
          />
          <line x1="30" y1="75" x2="25" y2="85" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <line x1="45" y1="75" x2="40" y2="85" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="75" x2="55" y2="85" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="75" x2="70" y2="85" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    )
  } else {
    // Default partly cloudy icon for other conditions
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 35C30 26.7157 36.7157 20 45 20C53.2843 20 60 26.7157 60 35" stroke="#FFB800" strokeWidth="3" />
          <path d="M25 40C25 31.7157 31.7157 25 40 25" stroke="#FFB800" strokeWidth="3" />
          <path d="M65 40C65 31.7157 58.2843 25 50 25" stroke="#FFB800" strokeWidth="3" />
          <path
            d="M25 45C16.7157 45 10 51.7157 10 60C10 68.2843 16.7157 75 25 75H75C83.2843 75 90 68.2843 90 60C90 51.7157 83.2843 45 75 45C75 36.7157 68.2843 30 60 30C51.7157 30 45 36.7157 45 45H25Z"
            fill="white"
            stroke="#FFB800"
            strokeWidth="3"
          />
        </svg>
      </div>
    )
  }
}

export default function WeatherApp() {
  const [city, setCity] = useState("London")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [units, setUnits] = useState<"metric" | "imperial">("metric")
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:8000/weather/formatted?city=${encodeURIComponent(cityName)}&units=${units}`, {
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText || 'Failed to fetch weather data'}`);
      }

      // Get the response as text first to check for any prefixed content
      const responseText = await response.text();

      // Remove any potential text before the opening curly brace
      const cleanedJson = responseText.substring(responseText.indexOf('{'));

      // Parse the cleaned JSON
      const data = JSON.parse(cleanedJson);
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');

      // Fallback to mock data for demo/development purposes
      const mockData: WeatherData = {
        city: cityName,
        country: "Unknown",
        temperature: 0,
        condition: "Unknown",
        windSpeed: 0,
        humidity: 0,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        forecast: [],
      }
      setWeather(mockData);
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city)
    }
  }

  const toggleUnits = () => {
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);
    if (weather) {
      fetchWeather(weather.city); // Refresh with new units
    }
  }

  useEffect(() => {
    fetchWeather("London")
  }, [])

  const tempUnit = units === "metric" ? "°C" : "°F";
  const speedUnit = units === "metric" ? "km/h" : "mph";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-blue-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-6xl grid md:grid-cols-4 gap-6 relative backdrop-blur-sm p-6 bg-white/30 rounded-[32px] shadow-2xl border border-white/40">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-[32px]">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-20 shadow-lg">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Left Column - Current Weather (1/4 of the screen) */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[28px] p-6 shadow-xl flex flex-col text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/10 blur-sm"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/10 blur-sm"></div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-md"></div>

          {/* Weather Icon */}
          <div className="mb-6 flex justify-center z-10">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
              <WeatherIcon condition={weather?.condition || "Sunny"} size={90} />
            </div>
          </div>

          {/* City and Country */}
          <div className="flex items-center justify-center mb-3 z-10">
            <MapPin className="w-4 h-4 mr-2 text-indigo-200" />
            <h2 className="text-xl font-bold">{weather?.city || "Loading..."}</h2>
          </div>
          <div className="text-center mb-4 z-10">
            <p className="text-indigo-200 text-sm">{weather?.country || ""}</p>
          </div>

          {/* Temperature */}
          <div className="text-center z-10 mb-4">
            <div className="text-6xl font-bold mb-1">{weather?.temperature || 0}{tempUnit}</div>
            <div className="text-xl text-indigo-100">{weather?.condition || "Loading..."}</div>
          </div>

          {/* Date */}
          <div className="mt-auto flex items-center justify-center text-indigo-200 text-sm pt-4 border-t border-indigo-400/20 z-10">
            <Calendar className="w-3 h-3 mr-2" />
            {weather?.date || "Loading..."}
          </div>
        </div>

        {/* Right Column - Search and Forecast (3/4 of the screen) */}
        <div className="md:col-span-3 bg-white rounded-[28px] p-8 shadow-xl flex flex-col">
          {/* Search Bar and Units Toggle */}
          <div className="flex mb-8 gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Search any city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-4 pl-5 pr-14 border-none bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all text-gray-800"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Units Toggle Button */}
            <button
              onClick={toggleUnits}
              className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors border border-gray-200"
            >
              <Thermometer className="w-5 h-5" />
              <span>{units === "metric" ? "°C" : "°F"}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => weather && fetchWeather(weather.city)}
              className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 w-12 h-12 rounded-xl transition-colors border border-gray-200"
              title="Refresh weather data"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Day Forecast */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">3-Day Forecast</h3>
              <button className="text-xs text-indigo-600 font-medium flex items-center hover:underline">
                View Extended Forecast <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            {weather?.forecast && weather.forecast.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {weather.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group border border-gray-100"
                  >
                    <div className="text-sm font-semibold text-gray-500 mb-4">{day.date}</div>
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                      <WeatherIcon condition={day.condition} size={60} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-lg font-semibold text-gray-800">{day.temperature}{tempUnit}</div>
                      <div className="text-sm text-gray-500">{day.condition}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No forecast data available</div>
            )}
          </div>

          {/* Today's Highlights */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Highlights</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Wind Status */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-medium text-blue-900">Wind Status</h4>
                  <Wind className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-gray-800">
                    {weather?.windSpeed || 0}
                    <span className="text-xl font-normal text-gray-600 ml-1">{speedUnit}</span>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    WSW
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-medium text-purple-900">Humidity</h4>
                  <Droplets className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-4">
                  {weather?.humidity || 0}
                  <span className="text-xl font-normal text-gray-600 ml-1">%</span>
                </div>
                <div className="h-2.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${weather?.humidity || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-purple-700">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}