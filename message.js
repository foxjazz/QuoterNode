const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './keys.env' });
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
module.exports = sendMessageToBot;
// Usage example:




/*
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
*/