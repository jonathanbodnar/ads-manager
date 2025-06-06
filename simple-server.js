const express = require('express');
const app = express();

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

console.log(`Attempting to start server on port: ${PORT}`);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Webhook server is running', port: PORT });
});

app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  
  if (mode === 'subscribe' && token === 'adsmaster_webhook_2025_secure_token_xyz789') {
    res.send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
}); 