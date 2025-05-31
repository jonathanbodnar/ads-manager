// Meta API Service for AdsMaster
// Handles all interactions with Facebook Marketing API

const META_BASE_URL = 'https://graph.facebook.com/v18.0';

export class MetaAPIService {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  // Get user's ad accounts
  async getAdAccounts() {
    try {
      const response = await fetch(
        `${META_BASE_URL}/me/adaccounts?fields=id,name,account_status,currency,timezone_name&access_token=${this.accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      throw error;
    }
  }

  // Get campaigns for an ad account
  async getCampaigns(adAccountId) {
    try {
      const response = await fetch(
        `${META_BASE_URL}/${adAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time&access_token=${this.accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  // Create a new campaign
  async createCampaign(adAccountId, campaignData) {
    try {
      const formData = new FormData();
      formData.append('name', campaignData.name);
      formData.append('objective', campaignData.objective);
      formData.append('status', campaignData.status || 'PAUSED');
      formData.append('access_token', this.accessToken);

      if (campaignData.daily_budget) {
        formData.append('daily_budget', Math.round(campaignData.daily_budget * 100)); // Convert to cents
      }

      if (campaignData.lifetime_budget) {
        formData.append('lifetime_budget', Math.round(campaignData.lifetime_budget * 100)); // Convert to cents
      }

      const response = await fetch(
        `${META_BASE_URL}/${adAccountId}/campaigns`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Update campaign status
  async updateCampaignStatus(campaignId, status) {
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('access_token', this.accessToken);

      const response = await fetch(
        `${META_BASE_URL}/${campaignId}`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  }

  // Get campaign insights (performance data)
  async getCampaignInsights(campaignId, dateRange = '7d') {
    try {
      const response = await fetch(
        `${META_BASE_URL}/${campaignId}/insights?fields=impressions,clicks,spend,ctr,cpc,cpp,reach,frequency&date_preset=${dateRange}&access_token=${this.accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data[0] || {};
    } catch (error) {
      console.error('Error fetching campaign insights:', error);
      throw error;
    }
  }

  // Get ad sets for a campaign
  async getAdSets(campaignId) {
    try {
      const response = await fetch(
        `${META_BASE_URL}/${campaignId}/adsets?fields=id,name,status,daily_budget,lifetime_budget,targeting,bid_amount,created_time,updated_time&access_token=${this.accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      throw error;
    }
  }

  // Get ads for an ad set
  async getAds(adSetId) {
    try {
      const response = await fetch(
        `${META_BASE_URL}/${adSetId}/ads?fields=id,name,status,creative,created_time,updated_time&access_token=${this.accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }

  // Validate access token
  async validateToken() {
    try {
      const response = await fetch(
        `${META_BASE_URL}/me?access_token=${this.accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    }
  }
}

// Helper function to create MetaAPIService instance
export const createMetaAPIService = (accessToken) => {
  return new MetaAPIService(accessToken);
}; 