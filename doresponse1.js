const express = require('express');
const Chart = require('chart.js');
const app = express();
const port = 3200;

// Function to generate sample data in JSON format
function generateSampleData() {
  const labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
  const temperatureData = labels.map(() => Math.floor(Math.random() * 20) + 15);
  const humidityData = labels.map(() => Math.floor(Math.random() * 30) + 50);
  const windData = labels.map(() => Math.floor(Math.random() * 10) + 5);

  return {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'temperature',
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'humidity',
      },
      {
        label: 'Wind Speed (m/s)',
        data: windData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'wind',
      },
    ],
  };
}

app.get('/', (req, res) => {
  // Generate sample data
  const chartData = generateSampleData();

  // Render the chart page
  res.send(`
    <html>
      <head>
        <title>Weather Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body {
            background-color: #333;
            color: #fff;
            font-family: 'Arial', sans-serif;
          }
        </style>
      </head>
      <body>
        <h1>Weather Data Chart</h1>
        <div style="max-width: 800px;">
          <canvas id="weatherChart"></canvas>
        </div>
        <script>
          document.addEventListener('DOMContentLoaded', function () {
            var ctx = document.getElementById('weatherChart').getContext('2d');
            var myChart = new Chart(ctx, {
              type: 'line',
              data: ${JSON.stringify(chartData)},
              options: {
                scales: {
                  temperature: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)', // Lighter color for temperature axis labels
                    },
                  },
                  humidity: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)', // Lighter color for humidity axis labels
                    },
                  },
                  wind: {
                    type: 'linear',
                    position: 'right',
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)', // Lighter color for wind axis labels
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)', // Lighter color for legend labels
                    },
                  },
                },
              },
            });
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
