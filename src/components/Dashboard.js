import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, BarChart3, TrendingUp, DollarSign, Users, Eye } from 'lucide-react';
import CampaignModal from './CampaignModal';

const Dashboard = ({ user }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [metaAccounts, setMetaAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSpend: 0,
    totalImpressions: 0
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch meta accounts
      const { data: accounts } = await supabase
        .from('meta_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      setMetaAccounts(accounts || []);

      // Fetch campaigns
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCampaigns(campaignsData || []);

      // Calculate stats
      const totalCampaigns = campaignsData?.length || 0;
      const activeCampaigns = campaignsData?.filter(c => c.status === 'ACTIVE').length || 0;
      const totalSpend = campaignsData?.reduce((sum, c) => sum + (parseFloat(c.daily_budget) || 0), 0) || 0;

      setStats({
        totalCampaigns,
        activeCampaigns,
        totalSpend,
        totalImpressions: totalCampaigns * 1250 // Mock data for now
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignCreated = () => {
    setShowCampaignModal(false);
    fetchData(); // Refresh the data
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'ACTIVE' ? 'status-active' : 
                       status === 'PAUSED' ? 'status-paused' : 'status-error';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div style={{ 
        height: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">
                Manage your Meta ad campaigns and track performance
              </p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} />
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px', 
            marginBottom: '32px' 
          }}>
            <div className="card">
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666666', fontSize: '14px', marginBottom: '4px' }}>
                      Total Campaigns
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                      {stats.totalCampaigns}
                    </p>
                  </div>
                  <BarChart3 size={24} color="#666666" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666666', fontSize: '14px', marginBottom: '4px' }}>
                      Active Campaigns
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                      {stats.activeCampaigns}
                    </p>
                  </div>
                  <TrendingUp size={24} color="#155724" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666666', fontSize: '14px', marginBottom: '4px' }}>
                      Daily Budget
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                      {formatCurrency(stats.totalSpend)}
                    </p>
                  </div>
                  <DollarSign size={24} color="#666666" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666666', fontSize: '14px', marginBottom: '4px' }}>
                      Total Impressions
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                      {formatNumber(stats.totalImpressions)}
                    </p>
                  </div>
                  <Eye size={24} color="#666666" />
                </div>
              </div>
            </div>
          </div>

          {/* Meta Accounts Status */}
          {metaAccounts.length > 0 && (
            <div className="card" style={{ marginBottom: '32px' }}>
              <div className="card-header">
                <h3 className="card-title">Connected Accounts</h3>
              </div>
              <div className="card-content">
                {metaAccounts.map((account) => (
                  <div key={account.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <p style={{ fontWeight: '500' }}>{account.account_name}</p>
                      <p style={{ fontSize: '12px', color: '#666666' }}>
                        Connected {new Date(account.connected_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="status-badge status-active">Connected</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Campaigns</h3>
            </div>
            <div className="table-container">
              {campaigns.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '48px 24px',
                  color: '#666666'
                }}>
                  <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <h3 style={{ marginBottom: '8px' }}>No campaigns yet</h3>
                  <p style={{ marginBottom: '24px' }}>
                    Create your first campaign to start managing your Meta ads.
                  </p>
                  <button
                    onClick={() => setShowCampaignModal(true)}
                    className="btn-primary"
                  >
                    Create Your First Campaign
                  </button>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Status</th>
                      <th>Objective</th>
                      <th>Daily Budget</th>
                      <th>Start Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td style={{ fontWeight: '500' }}>{campaign.name}</td>
                        <td>{getStatusBadge(campaign.status)}</td>
                        <td style={{ textTransform: 'capitalize' }}>
                          {campaign.objective?.toLowerCase() || 'Not set'}
                        </td>
                        <td>{formatCurrency(campaign.daily_budget || 0)}</td>
                        <td>
                          {campaign.start_date ? 
                            new Date(campaign.start_date).toLocaleDateString() : 
                            'Not scheduled'
                          }
                        </td>
                        <td>
                          <button
                            className="btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCampaignModal && (
        <CampaignModal
          user={user}
          metaAccounts={metaAccounts}
          onClose={() => setShowCampaignModal(false)}
          onCampaignCreated={handleCampaignCreated}
        />
      )}
    </div>
  );
};

export default Dashboard; 