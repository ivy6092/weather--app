Weather App ☀️🌧️
A simple decoupled weather application.

-Frontend: Built with Next.js and Typescript(weather-app folder).
-Backend: Built with Laravel API (weather-api folder).
The app fetches weather data from the [OpenWeatherMap API](https://openweathermap.org/api).

**Features 🚀**
-View current weather information.
-Fast, clean, and user-friendly interface.
-Backend API for fetching real-time weather data from OpenWeatherMap.
-Components styled with RippleUI.
-AJAX requests handled using Fetch API

**Project Structure 🗂️**
weather-app → Next.js app (User interface).
weather-api → Laravel API (Handles data).

**How to Run Locally 🖥️**

Backend (Laravel API)
-Go to the weather-api folder.
-Install packages:
   composer install
-Set up your .env file (database, API keys).
-Run the server:
   php artisan serve

Frontend (Next.js)
-Go to the weather-app folder.
-Install packages:
  npm install
-Run the frontend app:
  npm run dev

About This Project 💬
This project shows a clean decoupled system where a Next.js frontend and a Laravel backend work separately but communicate through APIs.
It follows best practices in API integration, type safety, and elegant software design.

Author ✍️
ivy6092
