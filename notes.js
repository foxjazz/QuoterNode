const fs = require('fs');

function saveStringToFileSync(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log('Content saved to file:', filePath);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

// Usage example:
const filePathSync = 'example_sync.txt';
const contentSync = 'This is an example content for sync file saving.\nHello, World!';

saveStringToFileSync(filePathSync, contentSync);