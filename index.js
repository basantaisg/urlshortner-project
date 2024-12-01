const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');

// In-memory store for URLs
const urlDatabase = {};

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to create a short URL
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'Please provide a valid URL' });
  }

  // Generate a short ID
  const shortId = shortid.generate();

  // Store the mapping in memory
  urlDatabase[shortId] = longUrl;

  res.json({
    shortUrl: `http://localhost:${PORT}/${shortId}`,
  });
});

// Route to redirect using a short URL
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;

  const longUrl = urlDatabase[shortId];

  if (!longUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(longUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`URL shortener service is running on http://localhost:${PORT}`);
});
