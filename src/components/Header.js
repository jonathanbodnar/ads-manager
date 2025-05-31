import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, User, Settings } from 'lucide-react';

const Header = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo">
            AdsMaster
          </a>
          
          <nav className="nav-menu">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/campaigns" className="nav-link">Campaigns</a>
            <a href="/analytics" className="nav-link">Analytics</a>
            
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: 'none',
                  border: '1px solid #e6e6e6',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1a1a1a'
                }}
              >
                <User size={16} />
                {user?.email?.split('@')[0] || 'User'}
              </button>
              
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #e6e6e6',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  minWidth: '180px',
                  zIndex: 1000,
                  marginTop: '4px'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      {user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666666' }}>
                      {user?.email}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Navigate to settings
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#1a1a1a'
                    }}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleSignOut();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#dc3545',
                      borderTop: '1px solid #f0f0f0'
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 