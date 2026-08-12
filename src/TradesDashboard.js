// ============================================
// VERIBUILD - TRADES DASHBOARD
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function TradesDashboard({ token, setToken, setUser, setView }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================================
  // FETCH PROFILE
  // ============================================

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/trades/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.tradesperson) {
        setProfile(response.data.tradesperson);
      } else {
        // Fallback: Use hardcoded profile data
        setProfile({
          full_name: 'Sikhumbuzile Ncube',
          trade: 'Painter',
          city: 'Bulawayo',
          phone: '0733045325',
          email: 'masombukasikhosana38@gmail.com',
          bio: 'Experienced painter with 5 years experience',
          years_experience: 5,
          subscription_active: false
        });
        setError('Using fallback data. Your profile may not be saved to the database.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback: Use hardcoded profile data
      setProfile({
        full_name: 'Sikhumbuzile Ncube',
        trade: 'Painter',
        city: 'Bulawayo',
        phone: '0733045325',
        email: 'masombukasikhosana38@gmail.com',
        bio: 'Experienced painter with 5 years experience',
        years_experience: 5,
        subscription_active: false
      });
      setError('Could not connect to the server. Using fallback data.');
    }
    setLoading(false);
  };

  // ============================================
  // SUBSCRIBE
  // ============================================

  const subscribe = async () => {
    try {
      await axios.post(`${API_URL}/trades/subscribe`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Subscription activated! You are now visible to the public.');
      fetchProfile();
    } catch (error) {
      alert('Subscription failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setView('home');
  };

  // ============================================
  // AUTO-LOAD
  // ============================================

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#e74c3c' }}>Profile not found. Please register again.</p>
        <button 
          onClick={() => setView('register-trade')}
          style={{ padding: '10px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Register as Tradesperson
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1A2B5E' }}>👷 {profile.full_name}</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            {profile.trade} • {profile.city}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#fce4ec', padding: '12px', borderRadius: '8px', color: '#e74c3c', marginBottom: '15px' }}>
          <strong>⚠️</strong> {error}
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchProfile}
        style={{
          padding: '6px 16px',
          backgroundColor: '#1A2B5E',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          marginBottom: '20px'
        }}
      >
        🔄 Refresh Profile
      </button>

      {/* Profile Details */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Trade:</strong> {profile.trade}</p>
        <p><strong>City:</strong> {profile.city}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Experience:</strong> {profile.years_experience} years</p>
        <p><strong>Bio:</strong> {profile.bio || 'No bio provided'}</p>
        <p>
          <strong>Status:</strong>{' '}
          {profile.subscription_active ? (
            <span style={{ color: '#00A896', fontWeight: 'bold' }}>✅ Listed Publicly</span>
          ) : (
            <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>❌ Not Listed</span>
          )}
        </p>
      </div>

      {/* Subscribe Button */}
      {!profile.subscription_active && (
        <button
          onClick={subscribe}
          style={{
            padding: '12px 25px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          Subscribe ($8/month) – Get Listed in the Public Directory
        </button>
      )}

      {profile.subscription_active && (
        <p style={{ color: '#00A896', textAlign: 'center' }}>
          ✅ Your profile is active and visible to the public.
        </p>
      )}
    </div>
  );
}

export default TradesDashboard;
