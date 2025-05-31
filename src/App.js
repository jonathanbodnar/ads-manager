import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Setup from './components/Setup';
import Header from './components/Header';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createUserProfile(userId);
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email: session?.user?.email,
            setup_completed: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="App">
      <Header user={user} />
      <Routes>
        <Route 
          path="/" 
          element={
            user?.setup_completed ? 
              <Dashboard user={user} /> : 
              <Navigate to="/setup" replace />
          } 
        />
        <Route 
          path="/setup" 
          element={
            user?.setup_completed ? 
              <Navigate to="/" replace /> : 
              <Setup user={user} onSetupComplete={fetchUserProfile} />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 