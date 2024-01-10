const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './keys2.env' });


const rapidApiKey = process.env.RapidAPIKey;
const botToken = process.env.botToken;
const chatId = process.env.chatId;



function sendMessageToBot(botToken, chatId, messageText) {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;
    
    return axios.get(apiUrl)
      .then(response => {
        if (response.status === 200) {
          console.log('Message sent successfully');
        } else {
          console.log('Failed to send message:', response.status);
        }
      })
      .catch(error => {
        console.error('Error sending message:', error.message);
      });
  }

const cwd = process.cwd();
var xQuote
filepath = cwd + "/last_quote.json";
var newQuote
var quoteData
async function setQuote() {
    
    const options = {
      method: 'GET',
      url: 'https://alpha-vantage.p.rapidapi.com/query',
      params: {
        to_currency: 'EUR',
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: 'USD'
      },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
      }
    };
    filepath = ""
    try {
      const response =  await axios.request(options);
      quoteData  = response.data;
      
      try {
        const cwd = process.cwd();
        filepath = cwd + "/last_quote.json";
        newQuote = quoteData['Realtime Currency Exchange Rate']['5. Exchange Rate']
      } catch (err) {
        console.error('Error writing to file:', err);
      }
    } catch (error) {
      console.error(error);
    }
}
function readFileSync() {
    try {
      const fileContent = fs.readFileSync(filepath, 'utf8');
      xQuote = JSON.parse(fileContent)['Realtime Currency Exchange Rate']['5. Exchange Rate']
      return
      
    } catch (err) {
      console.error('Error reading file:', err);
      return null;
    }
  }
function start(){
    setQuote().then(() => {
        readFileSync();
    
        if (newQuote > xQuote + .005){
            sendMessageToBot(botToken, chatId, "Euro is higher, current: " + newQuote);
            fs.writeFileSync(filepath,  JSON.stringify(quoteData), fs.writeFile);
        }
        if (newQuote < xQuote - .005){
            sendMessageToBot(botToken, chatId, "Euro is lower, current: " + newQuote);
            fs.writeFileSync(filepath,  JSON.stringify(quoteData), fs.writeFile);
        }
    })
}
var cntr = 0;
function appendLogWithTimestamp(message) {
    const timestamp = new Date().toISOString(); // Get current timestamp
    const logMessage = `${timestamp} - ${message}\n`; // Append timestamp to the log message
    
    // Append log message to a file
    fs.appendFile('EuroQuoter.log', logMessage, (err) => {
      if (err) {
        console.error('Error appending to log file:', err);
      } else {
        console.log('Log message appended to file:', logMessage);
      }
    });
  }
function scheduledProcess() {
    const currentDate = new Date();
    const currentDay = currentDate.getUTCDay();
    const currentHour = currentDate.getUTCHours();
  
    // Check if it's Monday to Friday (Monday = 1, ..., Friday = 5)
    const isWeekday = currentDay >= 1 && currentDay <= 5;
  
    // Check if it's between 13:00 and 23:00 UTC
    const isWithinTimeRange = currentHour >= 13 && currentHour <= 23;
  
    if (isWeekday && isWithinTimeRange) {
      // Perform your process here
      cntr++;
      appendLogWithTimestamp("iteration: " + cntr);
      start();
      console.log('Running scheduled process...');
      // Place your process logic here
    }
  }
  
  // Run the scheduled process every minute (adjust the interval as needed)
  setInterval(scheduledProcess, 60 * 1000 * 5); 