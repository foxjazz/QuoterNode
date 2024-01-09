const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const rapidApiKey = process.env.RapidAPIKey;
function saveQuote(botToken, chatId, messageText) {
  
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
      const response = axios.request(options);
      quoteData  = JSON.stringify(response.data);
      
      try {
        const cwd = process.cwd();
        filepath = cwd + "/last_quote.json";
        fs.writeFileSync(filepath,  quoteData, fs.writeFile);
        
      } catch (err) {
        console.error('Error writing to file:', err);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  saveQuote();