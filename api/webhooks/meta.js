// Meta Webhook Handler for AdsMaster
// Handles webhook verification and events from Meta Business

const VERIFY_TOKEN = 'adsmaster_webhook_2025_secure_token_xyz789';

export default function handler(req, res) {
  console.log('Webhook received:', req.method, req.query);
  
  if (req.method === 'GET') {
    // Webhook verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Verification:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.status(403).send('Forbidden');
    }
  } else if (req.method === 'POST') {
    // Handle webhook events
    const body = req.body;
    
    console.log('Webhook event:', req.body);
    
    // Process different event types
    if (body.object === 'page') {
      body.entry?.forEach((entry) => {
        entry.changes?.forEach((change) => {
          console.log('Processing webhook event:', change.field, change.value);
          
          // Handle different field types
          switch (change.field) {
            case 'ads_manager_permissions':
              handleAdsManagerPermissions(change.value);
              break;
            case 'business_management':
              handleBusinessManagement(change.value);
              break;
            case 'campaigns':
              handleCampaignUpdate(change.value);
              break;
            case 'adsets':
              handleAdSetUpdate(change.value);
              break;
            case 'ads':
              handleAdUpdate(change.value);
              break;
            default:
              console.log('Unhandled webhook field:', change.field);
          }
        });
      });
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

function handleAdsManagerPermissions(value) {
  console.log('Ads Manager Permissions updated:', value);
  // Handle permission changes for ads management
}

function handleBusinessManagement(value) {
  console.log('Business Management event:', value);
  // Handle business management events
}

function handleCampaignUpdate(value) {
  console.log('Campaign updated:', value);
  // Handle campaign status changes, budget updates, etc.
}

function handleAdSetUpdate(value) {
  console.log('Ad Set updated:', value);
  // Handle ad set changes
}

function handleAdUpdate(value) {
  console.log('Ad updated:', value);
  // Handle individual ad changes
} 