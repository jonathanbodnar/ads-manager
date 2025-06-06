// Meta Webhook Handler for AdsMaster
const VERIFY_TOKEN = 'adsmaster_webhook_2025_secure_token_xyz789';

export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  console.log('Webhook received:', req.method, req.query);
  
  if (req.method === 'GET') {
    // Webhook verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Verification request:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.status(403).send('Forbidden');
    }
  } else if (req.method === 'POST') {
    // Handle webhook events
    console.log('Webhook event received:', req.body);
    res.status(200).json({ status: 'received' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 