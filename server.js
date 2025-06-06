const express = require('express');
const app = express();

// Railway automatically sets PORT, fallback to 3000 for local
const PORT = process.env.PORT || 3000;

console.log(`Starting server on port: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AdsMaster Webhook Server', 
    status: 'running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT
  });
});

// Webhook verification endpoint (GET)
app.get('/webhook', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Webhook verification request:', { mode, token, challenge });

    if (mode === 'subscribe' && token === 'adsmaster_webhook_2025_secure_token_xyz789') {
      console.log('✅ Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed');
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error in webhook verification:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Webhook event handler (POST)
app.post('/webhook', (req, res) => {
  try {
    console.log('📨 Webhook event received:', JSON.stringify(req.body, null, 2));
    
    // Process webhook events here
    if (req.body.object === 'page') {
      req.body.entry?.forEach((entry) => {
        entry.changes?.forEach((change) => {
          console.log('🔄 Processing event:', change.field);
        });
      });
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Webhook URL: /webhook`);
  console.log(`🔑 Verify token: adsmaster_webhook_2025_secure_token_xyz789`);
  console.log(`✅ Health check: /health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app; 