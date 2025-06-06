const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting webhook test server...');
console.log('📍 PORT from environment:', process.env.PORT);
console.log('📍 Using PORT:', PORT);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  console.log(`📥 ${req.method} ${path}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Webhook verification endpoint
  if (path === '/webhook' && req.method === 'GET') {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    
    console.log('🔐 Webhook verification:', { mode, token, challenge });
    
    if (mode === 'subscribe' && token === 'adsmaster_webhook_2025_secure_token_xyz789') {
      console.log('✅ Webhook verified successfully');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(challenge);
    } else {
      console.log('❌ Webhook verification failed');
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
    }
    return;
  }
  
  // Webhook event handler
  if (path === '/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('📨 Webhook event received:', body);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('EVENT_RECEIVED');
    });
    return;
  }
  
  // Health check
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: PORT,
      uptime: process.uptime()
    }));
    return;
  }
  
  // Default response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'AdsMaster Webhook Server (Test Mode)',
    status: 'running',
    url: req.url,
    method: req.method,
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/webhook',
      health: '/health'
    }
  }, null, 2));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Webhook server running on 0.0.0.0:${PORT}`);
  console.log(`📡 Webhook URL: /webhook`);
  console.log(`🔑 Verify token: adsmaster_webhook_2025_secure_token_xyz789`);
  console.log(`❤️ Health check: /health`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
}); 