import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Facebook, CheckCircle, AlertCircle } from 'lucide-react';

const Setup = ({ user, onSetupComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [metaAppId] = useState('790906299809678'); // Your provided app ID
  const [accessToken, setAccessToken] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');

  const handleMetaConnection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate the access token by making a test call to Facebook API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}`);
      const data = await response.json();

      if (data.error) {
        setError('Invalid access token. Please check your token and try again.');
        setLoading(false);
        return;
      }

      // Store Meta account connection
      const { error: insertError } = await supabase
        .from('meta_accounts')
        .insert([
          {
            user_id: user.id,
            meta_app_id: metaAppId,
            access_token: accessToken,
            account_name: accountName || data.name,
            account_id: data.id
          }
        ]);

      if (insertError) {
        setError('Failed to save Meta account connection.');
        setLoading(false);
        return;
      }

      setStep(2);
    } catch (err) {
      setError('Failed to connect to Meta. Please check your access token.');
    } finally {
      setLoading(false);
    }
  };

  const completeSetup = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ setup_completed: true })
        .eq('id', user.id);

      if (error) {
        setError('Failed to complete setup.');
      } else {
        onSetupComplete(user.id);
      }
    } catch (err) {
      setError('An error occurred during setup completion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="setup-container">
        {step === 1 && (
          <div className="setup-step">
            <div className="setup-step-number">1</div>
            <h2 className="setup-step-title">Connect Your Meta Ads Account</h2>
            <p className="setup-step-description">
              To get started, you'll need to connect your Meta (Facebook) Ads account. 
              We'll use this to pull in your current campaigns and help you manage them.
            </p>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Facebook size={24} />
                  <h3>Meta Business Account</h3>
                </div>

                <form onSubmit={handleMetaConnection}>
                  <div className="form-group">
                    <label className="form-label">App ID</label>
                    <input
                      className="form-input"
                      type="text"
                      value={metaAppId}
                      disabled
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small style={{ color: '#666666', fontSize: '12px' }}>
                      This is your Meta App ID (pre-configured)
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Access Token *</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Enter your Meta access token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      required
                    />
                    <small style={{ color: '#666666', fontSize: '12px' }}>
                      Get your access token from{' '}
                      <a 
                        href="https://developers.facebook.com/tools/explorer/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#000' }}
                      >
                        Facebook Graph API Explorer
                      </a>
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Name (Optional)</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g., My Business Ads"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
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

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !accessToken}
                    style={{ width: '100%' }}
                  >
                    {loading ? (
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    ) : (
                      'Connect Meta Account'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="setup-step">
            <div className="setup-step-number">
              <CheckCircle size={24} />
            </div>
            <h2 className="setup-step-title">Setup Complete!</h2>
            <p className="setup-step-description">
              Your Meta Ads account has been successfully connected. You're ready to start 
              managing your campaigns with AdsMaster.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{
                padding: '24px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '8px',
                textAlign: 'center',
                maxWidth: '400px'
              }}>
                <CheckCircle size={32} style={{ marginBottom: '12px' }} />
                <p style={{ fontWeight: '500', marginBottom: '8px' }}>
                  Meta Account Connected
                </p>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  We can now access your campaigns and help you optimize them.
                </p>
              </div>

              <button
                onClick={completeSetup}
                className="btn-primary"
                disabled={loading}
                style={{ minWidth: '200px' }}
              >
                {loading ? (
                  <div className="spinner" style={{ margin: '0 auto' }}></div>
                ) : (
                  'Go to Dashboard'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup; 