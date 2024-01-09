const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './keys.env' });

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
setQuote().then(() => {
        readFileSync();
    
        if (newQuote > xQuote - .005){
            sendMessageToBot(botToken, chatId, "Euro is higher, current: " + newQuote);
            fs.writeFileSync(filepath,  quoteData, fs.writeFile);
        }
    
        if (newQuote < xQuote + .005){
            sendMessageToBot(botToken, chatId, "Euro is higher, current: " + newQuote);
            fs.writeFileSync(filepath,  quoteData, fs.writeFile);
        }
        
    
    
})
