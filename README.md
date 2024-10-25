# Weather Monitoring Dashboard
This Weather Monitoring Dashboard is a full-stack application that provides weather updates for selected cities with real-time alerts for high temperatures. The dashboard allows users to select preferred cities and temperature units (Celsius/Fahrenheit) and fetches weather data from the OpenWeatherMap API.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [API Key Setup](#api-key-setup)

## Features
- **Weather Summary**: View current temperature, maximum and minimum temperatures, and weather conditions.
- **User Preferences**: Select preferred cities and temperature units.
- **Real-Time Alerts**: Receive alerts when temperatures exceed a certain threshold.
- **Automatic Updates**: Weather data updates every 5 minutes.

## Project Structure
The project is organized as follows:

WeatherMonitoringSystem/ ├── frontend/ │ ├── dashboard.js # Main dashboard component │ ├── setting.js # Component for selecting preferences │ ├── weathersummary.js # Component to display each city's weather summary │ ├── dashboard.css # Styling for the dashboard ├── backend.js # Backend server for API handling ├── app.js # Main application file └── README.md # Project documentation

## Installation

1. **Clone the repository**
2. Install dependencies: Navigate to the project’s root directory and install the required packages.
3. Install Frontend Dependencies: Navigate to the frontend folder and install frontend dependencies (if using a separate setup).
4. Set up environment variables:
Create a .env file in the root directory.
Add your OpenWeatherMap API key

## Usage

1. Start the Backend Server:  node backend.js
2. Start the Frontend: From the frontend folder, start the React development server: npm start
3. Access the Application: Open http://localhost:3000 in your browser to view the Weather Monitoring Dashboard.

## Technologies Used

Frontend: React.js, CSS (Bootstrap)
Backend: Node.js, Express.js
API: OpenWeatherMap API

## API Key Setup

This project requires an API key from OpenWeatherMap. Once you have signed up and received your API key:
Add the API key to the .env file as shown in the Installation section.
Make sure the .env file is correctly configured, or the application may fail to fetch weather data.

NOTES:-
1. The node_modules folder is not included in the repository due to its size. Run npm install to install dependencies after cloning.
2. Weather data is updated every 5 minutes by default, but you can adjust this in the code if needed.
