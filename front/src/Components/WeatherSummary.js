// src/Components/WeatherSummary.js

import React from 'react';

const WeatherSummary = ({ data, preferredUnit }) => {
  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{data.city}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">Avg Temp: {data.avgTemp} °{preferredUnit === 'Celsius' ? 'C' : 'F'}</p>
        <p className="card-text">Max Temp: {data.maxTemp} °{preferredUnit === 'Celsius' ? 'C' : 'F'}</p>
        <p className="card-text">Min Temp: {data.minTemp} °{preferredUnit === 'Celsius' ? 'C' : 'F'}</p>
        <p className="card-text">Condition: {data.condition}</p>
      </div>
    </div>
  );
};

export default WeatherSummary;
