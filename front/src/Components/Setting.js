// src/Components/Settings.js

import React, { useState } from 'react';

const Settings = ({ preferredCities, setPreferredCities, preferredUnit, setPreferredUnit }) => {
  const allCities = ['Delhi', 'Mumbai', 'Chennai', 'Bengaluru', 'Kolkata', 'Hyderabad'];

  const handleCityChange = (city) => {
    setPreferredCities((prev) => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const handleUnitChange = (event) => {
    setPreferredUnit(event.target.value);
  };

  return (
    <div className="settings">
      <h3>User Preferences</h3>
      <div>
        <h4>Select Preferred Cities:</h4>
        {allCities.map(city => (
          <div key={city}>
            <label>
              <input
                type="checkbox"
                checked={preferredCities.includes(city)}
                onChange={() => handleCityChange(city)}
              />
              {city}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h4>Select Temperature Unit:</h4>
        <label>
          <input
            type="radio"
            value="Celsius"
            checked={preferredUnit === 'Celsius'}
            onChange={handleUnitChange}
          />
          Celsius
        </label>
        <label>
          <input
            type="radio"
            value="Fahrenheit"
            checked={preferredUnit === 'Fahrenheit'}
            onChange={handleUnitChange}
          />
          Fahrenheit
        </label>
      </div>
    </div>
  );
};

export default Settings;
