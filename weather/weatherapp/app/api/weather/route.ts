import { NextResponse } from "next/server"

// Define the API response structure to match the wireframe exactly
interface WeatherApiResponse {
  city: string
  country: string
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  date: string
  forecast: Array<{
    date: string
    temperature: number
    condition: string
  }>
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    // In a real app, you would fetch from your actual API
    // For demo purposes, we'll return mock data that matches the wireframe exactly

    const mockData: WeatherApiResponse = {
      city: city === "London" ? "London" : "Nairobi",
      country: city === "London" ? "UK" : "Kenya",
      temperature: 13,
      condition: "Sunny",
      windSpeed: 3,
      humidity: 80,
      date: "20th May 2027",
      forecast: [
        {
          date: "21 May",
          temperature: 15,
          condition: "Sunny",
        },
        {
          date: "22 May",
          temperature: 20,
          condition: "Cloudy",
        },
        {
          date: "23 May",
          temperature: 18,
          condition: "Sunny",
        },
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
