const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const VERIFY_TOKEN = 'adsmaster_webhook_2025_secure_token_xyz789';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request:', { mode, token, challenge });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// Webhook event handler
app.post('/webhook', (req, res) => {
  console.log('Webhook event received:', JSON.stringify(req.body, null, 2));
  
  // Process webhook events here
  if (req.body.object === 'page') {
    req.body.entry?.forEach((entry) => {
      entry.changes?.forEach((change) => {
        console.log('Processing event:', change.field, change.value);
      });
    });
  }
  
  res.status(200).send('EVENT_RECEIVED');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`Verify token: ${VERIFY_TOKEN}`);
});

module.exports = app; 