const express = require('express');
const fs = require('fs');
const chart = require('chart.js');

const app = express();
const port = 3200;
const cwd = process.cwd();
app.get('/', (req, res) => {
  // Read the log file and parse JSON
  const logContent = fs.readFileSync(cwd + '/portugal_weather.log', 'utf8');
  const logs = JSON.parse("[" + logContent + "]");

  // Extract relevant data for the chart
  const labels = logs.map((entry) => entry.location.localtime);
  const temperatureData = logs.map((entry) => entry.current.temp_c);
  const humidityData = logs.map((entry) => entry.current.humidity);
  const cloudData = logs.map((entry) => entry.current.cloud);
  const uvData = logs.map((entry) => entry.current.uv);

  // Create the chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'temperature'
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'humidity'
      },
      {
        label: 'Cloud (%)',
        data: cloudData,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'cloud'
      },
      {
        label: 'UV Index',
        data: uvData,
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        yAxisID: 'uv'
      },
    ],
  };

  // Send the HTML page with the chart
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weather Data Chart</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <canvas id="myChart" width="800" height="400"></canvas>
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          var ctx = document.getElementById('myChart').getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'line',
            data: ${JSON.stringify(chartData)},
            options: {
              scales: {
                temperature: {
                  type: 'linear',
                  position: 'left',
                },
                humidity: {
                  type: 'linear',
                  position: 'left',
                },
                cloud: {
                  type: 'linear',
                  position: 'left',
                },
                uv: {
                  type: 'linear',
                  position: 'right',
                  max: 10,
                },
              },
            },
          });
        });
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
