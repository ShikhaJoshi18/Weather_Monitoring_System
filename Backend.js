// Load environment variables using ES module import
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';
import mongoose from 'mongoose';

// Configure dotenv to load the environment variables
dotenv.config({ path: './weatherdata.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create schemas and models for MongoDB collections
const alertSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  timestamp: { type: Date, default: Date.now },
});

const dailySummarySchema = new mongoose.Schema({
  city: String,
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
  date: { type: Date, default: Date.now },
});

const Alert = mongoose.model('Alert', alertSchema);
const DailySummary = mongoose.model('DailySummary', dailySummarySchema);

const app = express();
const PORT = process.env.PORT || 5000;  // Set port

const cities = [
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', lat: 22.7197, lon: 75.8577 },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  { name: 'Vadodara', lat: 22.3072, lon: 73.1812 }
];

const dailyData = {};  // In-memory storage for daily data per city
const alertThreshold = {
  temperature: 10,  // Set alert threshold for temperature in Celsius
};

// Set to keep track of sent alerts to avoid duplicates
const sentAlerts = new Set(); 

// Function to fetch weather data for a given latitude and longitude
const fetchWeatherData = async (lat, lon) => {
  try {
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather data: ' + error.message);
  }
};

// Function to process and store weather data for daily summaries
const processWeatherData = (city, weatherData) => {
  const { temp, feels_like } = weatherData.main;
  const mainCondition = weatherData.weather[0].main;
  const timestamp = weatherData.dt;

  if (!dailyData[city]) {
    dailyData[city] = [];
  }
  dailyData[city].push({ temp, feels_like, mainCondition, timestamp });

  // Check for alerts based on temperature
  checkAlertConditions(city, temp);
};

// Function to calculate daily summary
const calculateDailySummary = async (city) => {
  const data = dailyData[city];
  if (data.length === 0) return;

  const avgTemp = data.reduce((acc, val) => acc + val.temp, 0) / data.length;
  const maxTemp = Math.max(...data.map(d => d.temp));
  const minTemp = Math.min(...data.map(d => d.temp));

  const conditionCounts = data.reduce((acc, val) => {
    acc[val.mainCondition] = (acc[val.mainCondition] || 0) + 1;
    return acc;
  }, {});
  const dominantCondition = Object.keys(conditionCounts).reduce((a, b) => conditionCounts[a] > conditionCounts[b] ? a : b);

  console.log(`Daily Summary for ${city}:`);
  console.log(`Average Temp: ${avgTemp.toFixed(2)} °C, Max Temp: ${maxTemp} °C, Min Temp: ${minTemp} °C`);
  console.log(`Dominant Condition: ${dominantCondition}`);

  // Save daily summary to the database
  const dailySummary = new DailySummary({
    city,
    avgTemp,
    maxTemp,
    minTemp,
    dominantCondition,
  });
  
  await dailySummary.save();
  console.log(`Daily summary for ${city} saved to database.`);
  
  dailyData[city] = [];  // Reset data for the next day
};

// Check alert conditions based on threshold
const checkAlertConditions = async (city, temp) => {
  // Create a unique alert key based on city and temperature
  const alertKey = `${city}-${temp}`;

  if (temp > alertThreshold.temperature && !sentAlerts.has(alertKey)) {
    console.log(`Alert! Temperature in ${city} exceeded ${alertThreshold.temperature}°C. Current Temp: ${temp}°C`);

    // Save alert to the database
    const alert = new Alert({
      city,
      temperature: temp,
    });
    
    await alert.save();
    console.log(`Alert for ${city} saved to database.`);

    // Add to the sent alerts to avoid future duplicates
    sentAlerts.add(alertKey);
  }
};

// Schedule weather data retrieval every minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Fetching weather data...');
  for (const city of cities) {
    try {
      const weatherData = await fetchWeatherData(city.lat, city.lon);
      processWeatherData(city.name, weatherData);
    } catch (error) {
      console.error(`Error fetching data for ${city.name}:`, error.message);
    }
  }
});

// Schedule daily summaries to calculate at midnight (00:00)
cron.schedule('0 0 * * *', () => {
  cities.forEach(city => calculateDailySummary(city.name));
});

// Define an API route for on-demand weather data retrieval
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const weatherData = await fetchWeatherData(lat, lon);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
