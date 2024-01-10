//http://api.weatherapi.com/v1/current.json?key=d1cd91f9c5b24379bf0212109240901&q=40.74648819816704, -8.061093484911366&aqi=no

const fs = require('fs');
const axios = require('axios');
require('dotenv').config({ path: './keys2.env' });

function appendLogWithTimestamp(message) {
    const timestamp = new Date().toISOString(); // Get current timestamp
    const logMessage = `${timestamp} - ${message}\n`; // Append timestamp to the log message
    
    // Append log message to a file
    fs.appendFile('weatherstatus.log', logMessage, (err) => {
      if (err) {
        console.error('Error appending to log file:', err);
      } else {
        console.log('Log message appended to file:', logMessage);
      }
    });
  }

async function appendWeatherDataToFile() {
  const apiKey = process.env.WeatherApiKey;
  const coordinates = '40.74648819816704,-8.061093484911366';
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${coordinates}&aqi=no`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (response.status === 200) {
      const weatherData = JSON.stringify(data, null, 2);
      fs.appendFileSync('portugal_weather.log', `${weatherData}\n`);
      console.log('Weather data appended to portugal_weather.log');
    } else {
      console.error('Failed to fetch weather data:', data.error.message);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
  }
}
var cnter = 0;
appendLogWithTimestamp("iteration: " + cnter);
appendWeatherDataToFile();
// Call the function to retrieve weather data and append it to the file
setInterval(() => {
    // Perform some minimal operation or stay idle
    // For example, logging a message
    appendLogWithTimestamp("iteration: " + cnter);
    appendWeatherDataToFile();
    console.log('Application is idle...');
  }, 1000 * 60); //
    
    

