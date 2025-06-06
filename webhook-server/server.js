const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'adsmaster_webhook_2025_secure_token_xyz789';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AdsMaster Webhook Server', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

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
    console.log('Webhook verification failed - mode:', mode, 'token:', token);
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
        
        // Handle different types of events
        switch (change.field) {
          case 'ads_manager_permissions':
            console.log('Ads Manager permissions updated');
            break;
          case 'campaigns':
            console.log('Campaign updated');
            break;
          case 'adsets':
            console.log('Ad set updated');
            break;
          case 'ads':
            console.log('Ad updated');
            break;
          default:
            console.log('Unknown event type:', change.field);
        }
      });
    });
  }
  
  res.status(200).send('EVENT_RECEIVED');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🔑 Verify token: ${VERIFY_TOKEN}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 