# AdsMaster Webhook Server

Meta webhook server for the AdsMaster application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

## Endpoints

- `GET /` - Server status
- `GET /webhook` - Webhook verification endpoint
- `POST /webhook` - Webhook event handler
- `GET /health` - Health check

## Environment Variables

- `PORT` - Server port (default: 3000)

## Meta Configuration

- **Callback URL**: `https://your-domain.com/webhook`
- **Verify Token**: `adsmaster_webhook_2025_secure_token_xyz789`

## Webhook Fields

The server handles these Meta webhook fields:
- `ads_manager_permissions`
- `campaigns`
- `adsets`
- `ads`
- `business_management` 