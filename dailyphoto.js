const express = require('express');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

const storage = new Storage({
  keyFilename: path.join(__dirname, 'platinum-trees-421119-d01d26771031.json')
});

const bucketName = 'allyyuval';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the Daily Photo Server! Visit /dailyPhoto to see the daily photo.');
});

async function getRandomDailyPhoto() {
  const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'Images/' });
  if (files.length === 0) {
    console.log("No images found in the bucket.");
    throw new Error("No images found in the specified bucket.");
  }
// Get day of the year
const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);

// Select a photo based on the day of the year
const photoIndex = dayOfYear % files.length;
const photoFile = files[photoIndex];

console.log(`Day of the year: ${dayOfYear}`);
console.log(`Photo index: ${photoIndex}`);
console.log(`Selected photo: ${photoFile.name}`);

// Generate a signed URL for the photo
const options = {
  version: 'v4',
  action: 'read',
  expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
};

const [url] = await storage.bucket(bucketName).file(photoFile.name).getSignedUrl(options);
return url;
}

app.get('/dailyPhoto', async (req, res) => {
  try {
    const photoUrl = await getRandomDailyPhoto();
    res.send(`<img src="${photoUrl}" alt="Daily Photo">`);
  } catch (error) {
    console.error('Failed to fetch photo:', error);
    res.status(500).send('Failed to load the daily photo: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
