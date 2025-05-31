import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, AlertCircle } from 'lucide-react';

const CampaignModal = ({ user, metaAccounts, onClose, onCampaignCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    objective: 'CONVERSIONS',
    budget_type: 'DAILY',
    daily_budget: '',
    lifetime_budget: '',
    start_date: '',
    end_date: '',
    meta_account_id: metaAccounts[0]?.id || ''
  });

  const objectives = [
    { value: 'CONVERSIONS', label: 'Conversions' },
    { value: 'LINK_CLICKS', label: 'Link Clicks' },
    { value: 'IMPRESSIONS', label: 'Impressions' },
    { value: 'REACH', label: 'Reach' },
    { value: 'VIDEO_VIEWS', label: 'Video Views' },
    { value: 'BRAND_AWARENESS', label: 'Brand Awareness' },
    { value: 'LEAD_GENERATION', label: 'Lead Generation' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.meta_account_id) {
        setError('Campaign name and Meta account are required.');
        setLoading(false);
        return;
      }

      if (formData.budget_type === 'DAILY' && !formData.daily_budget) {
        setError('Daily budget is required for daily budget campaigns.');
        setLoading(false);
        return;
      }

      if (formData.budget_type === 'LIFETIME' && !formData.lifetime_budget) {
        setError('Lifetime budget is required for lifetime budget campaigns.');
        setLoading(false);
        return;
      }

      // Create campaign in database
      const campaignData = {
        user_id: user.id,
        meta_account_id: formData.meta_account_id,
        name: formData.name,
        objective: formData.objective,
        budget_type: formData.budget_type,
        daily_budget: formData.budget_type === 'DAILY' ? parseFloat(formData.daily_budget) : null,
        lifetime_budget: formData.budget_type === 'LIFETIME' ? parseFloat(formData.lifetime_budget) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: 'PAUSED' // Start as paused until user activates
      };

      const { data, error: insertError } = await supabase
        .from('campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (insertError) {
        setError('Failed to create campaign. Please try again.');
        console.error('Insert error:', insertError);
        setLoading(false);
        return;
      }

      // Here you would normally also create the campaign in Meta API
      // For now, we'll just store it locally and mark it as ready to sync

      onCampaignCreated();
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Campaign creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 0 24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            Create New Campaign
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px 24px' }}>
          <div className="form-group">
            <label className="form-label">Campaign Name *</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Enter campaign name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Account *</label>
            <select
              className="form-input"
              name="meta_account_id"
              value={formData.meta_account_id}
              onChange={handleInputChange}
              required
            >
              {metaAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Objective</label>
            <select
              className="form-input"
              name="objective"
              value={formData.objective}
              onChange={handleInputChange}
            >
              {objectives.map((objective) => (
                <option key={objective.value} value={objective.value}>
                  {objective.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Budget Type</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="budget_type"
                  value="DAILY"
                  checked={formData.budget_type === 'DAILY'}
                  onChange={handleInputChange}
                />
                Daily Budget
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="budget_type"
                  value="LIFETIME"
                  checked={formData.budget_type === 'LIFETIME'}
                  onChange={handleInputChange}
                />
                Lifetime Budget
              </label>
            </div>
          </div>

          {formData.budget_type === 'DAILY' && (
            <div className="form-group">
              <label className="form-label">Daily Budget ($) *</label>
              <input
                className="form-input"
                type="number"
                name="daily_budget"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={formData.daily_budget}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {formData.budget_type === 'LIFETIME' && (
            <div className="form-group">
              <label className="form-label">Lifetime Budget ($) *</label>
              <input
                className="form-input"
                type="number"
                name="lifetime_budget"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={formData.lifetime_budget}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                className="form-input"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '6px',
              marginBottom: '24px'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '32px'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" style={{ margin: '0 auto' }}></div>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignModal; 