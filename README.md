# Weather Monitoring Dashboard
This Weather Monitoring Dashboard is a full-stack application that provides weather updates for selected cities with real-time alerts for high temperatures. The dashboard allows users to select preferred cities and temperature units (Celsius/Fahrenheit) and fetches weather data from the OpenWeatherMap API.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up MongoDB with Docker](#setting-up-mongodb-with-docker)
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

WeatherMonitoringSystem/
├── frontend/
│   ├── dashboard.js       # Main dashboard component
│   ├── setting.js         # Component for selecting preferences
│   ├── weathersummary.js  # Component to display each city's weather summary
│   ├── dashboard.css      # Styling for the dashboard
├── backend.js             # Backend server for API handling
├── app.js                 # Main application file
└── README.md              # Project documentation


## Prerequisites
Ensure you have the following installed:

1. Node.js and npm
2. Docker (for setting up MongoDB as a Docker container)
3. An API key from OpenWeatherMap

## Installation

1. Clone the repository
2. Install dependencies: Navigate to the project’s root directory and install the required packages.
3. Install Frontend Dependencies: Navigate to the frontend folder and install frontend dependencies (if using a separate setup).
4. Set up environment variables:
Create a .env file in the root directory.
Add your OpenWeatherMap API key

## Setting Up MongoDB with Docker

This application uses MongoDB with a database named weatherDB and two collections: alerts and dailysummaries. Follow these steps to set up MongoDB in a Docker container with the required database and collections.
[Step 1: Create the Initialization Script]
1. In the project root directory, create a folder named mongo-init.
2. Inside the mongo-init folder, create a file named init.js with the following contents:
   // init.js - Initializes weatherDB database with collections
  db = db.getSiblingDB("weatherDB");

  db.createCollection("alerts");
  db.createCollection("dailysummaries");

  // Optional: Insert initial sample data
  db.alerts.insert({ message: "Sample Alert", createdAt: new Date() });
  db.dailysummaries.insert({ summary: "Sample Summary", createdAt: new Date() });

[Step 2:Run MongoDB with Docker]
Run the following command to start MongoDB with the initialization script:
docker run --name weather-mongo -d -p 27017:27017 -v weatherdata:/data/db -v $(pwd)/mongo-init:/docker-entrypoint-initdb.d mongo
This command will:
1. Create a MongoDB container named weather-mongo.
2. Map the data to a Docker volume (weatherdata:/data/db) to persist data.
3. Execute the init.js script on startup to create weatherDB with alerts and dailysummaries collections.

[Step 3:Verify the Setup (Optional)]
1. To verify the database and collections, connect to MongoDB: (docker exec -it weather-mongo mongosh)
2. Then switch to weatherDB and check the collections:(use weatherDB;
                                                      show collections;)
   You should see alerts and dailysummaries listed.



## Usage

1. Start the Backend Server:  node backend.js
2. Start the Frontend: From the frontend folder, start the React development server: npm start
3. Access the Application: Open http://localhost:3000 in your browser to view the Weather Monitoring Dashboard.

## Technologies Used

Frontend: React.js, CSS (Bootstrap)
Backend: Node.js, Express.js
Database: MongoDB (Dockerized for easy setup)
API: OpenWeatherMap API

## API Key Setup

This project requires an API key from OpenWeatherMap. Once you have signed up and received your API key:
Add the API key to the .env file as shown in the Installation section.
Make sure the .env file is correctly configured, or the application may fail to fetch weather data.

NOTES:-
1. The node_modules folder is not included in the repository due to its size. Run npm install to install dependencies after cloning.
2. Weather data is updated every 5 minutes by default, but you can adjust this in the code if needed.
