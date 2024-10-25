import React, { useState, useEffect } from 'react';
import WeatherSummary from './WeatherSummary';
import Settings from './Setting';
import './Dashboard.css';

const Dashboard = () => {
  const [summaries, setSummaries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [preferredCities, setPreferredCities] = useState(['Delhi', 'Mumbai']); // Default preferred cities
  const [preferredUnit, setPreferredUnit] = useState('Celsius'); // Default temperature unit

  const apiKey = '599e091a2a586b6f7f493218fcba87c8'; // Your OpenWeatherMap API key

  useEffect(() => {
    const fetchWeatherData = async () => {
      const responses = await Promise.all(
        preferredCities.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${preferredUnit === 'Celsius' ? 'metric' : 'imperial'}`)
        )
      );

      const data = await Promise.all(responses.map(res => res.json()));
      const newSummaries = data.map(cityData => ({
        city: cityData.name,
        avgTemp: cityData.main.temp,
        maxTemp: cityData.main.temp_max,
        minTemp: cityData.main.temp_min,
        condition: cityData.weather[0].main,
      }));

      // Check for alerts
      checkAlerts(newSummaries);
      setSummaries(newSummaries);
    };

    const intervalId = setInterval(fetchWeatherData, 300000); // Fetch every 5 minutes
    fetchWeatherData(); // Fetch immediately on mount

    return () => clearInterval(intervalId);
  }, [preferredCities, preferredUnit]); // Depend on user preferences

  const checkAlerts = (newSummaries) => {
    const uniqueAlerts = new Set(alerts); // Use a Set for uniqueness
  
    newSummaries.forEach(summary => {
      if (summary.avgTemp > 10) { // Change threshold to 10
        const alertMessage = `Alert: ${summary.city} has a high temperature of ${summary.avgTemp}°${preferredUnit === 'Celsius' ? 'C' : 'F'}!`;
        uniqueAlerts.add(alertMessage); // Add to the Set
      }
    });
  
    setAlerts(Array.from(uniqueAlerts)); // Convert Set back to Array
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Weather Dashboard</h2>
      <Settings 
        preferredCities={preferredCities} 
        setPreferredCities={setPreferredCities} 
        preferredUnit={preferredUnit} 
        setPreferredUnit={setPreferredUnit} 
      />
      {alerts.length > 0 && (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Alerts:</h4>
          <ul className="mb-0">
            {alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="row">
        {summaries.map(summary => (
          <div className="col-md-4 mb-4" key={summary.city}>
            <WeatherSummary data={summary} preferredUnit={preferredUnit} /> {/* Pass preferredUnit */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
