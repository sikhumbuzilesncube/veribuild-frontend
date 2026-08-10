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
  
  // Registration form
  const [formData, setFormData] = useState({
    full_name: '',
    trade: '',
    city: '',
    phone: '',
    email: '',
    bio: '',
    years_experience: '',
    hourly_rate: ''
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/trades/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.tradesperson);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        setError('Failed to load profile');
      }
    }
    setLoading(false);
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/trades/register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile created successfully!');
      fetchProfile();
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const subscribe = async () => {
    try {
      await axios.post(`${API_URL}/trades/subscribe`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Subscription activated! You are now visible to the public.');
      fetchProfile();
    } catch (error) {
      alert('Subscription failed');
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  if (!profile) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#1A2B5E' }}>Register as a Tradesperson</h2>
        <p style={{ color: '#666' }}>Get discovered by homeowners and architects.</p>
        <form onSubmit={register}>
          <input type="text" placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <select value={formData.trade} onChange={(e) => setFormData({...formData, trade: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required>
            <option value="">Select Trade</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Builder">Builder</option>
            <option value="Tiler">Tiler</option>
            <option value="Roofing">Roofing</option>
            <option value="Landscaping">Landscaping</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <textarea placeholder="Bio (experience, skills, etc.)" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', minHeight: '80px' }} />
          <input type="number" placeholder="Years of Experience" value={formData.years_experience} onChange={(e) => setFormData({...formData, years_experience: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} />
          <input type="number" placeholder="Hourly Rate (USD)" value={formData.hourly_rate} onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '8px' }}>Register</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1A2B5E' }}>👷 {profile.full_name}</h1>
      <p><strong>Trade:</strong> {profile.trade}</p>
      <p><strong>City:</strong> {profile.city}</p>
      <p><strong>Experience:</strong> {profile.years_experience} years</p>
      <p><strong>Rate:</strong> ${profile.hourly_rate}/hour</p>
      <p><strong>Status:</strong> {profile.subscription_active ? '✅ Listed Publicly' : '❌ Not Listed'}</p>
      {!profile.subscription_active && (
        <button onClick={subscribe} style={{ padding: '10px 20px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px' }}>
          Subscribe ($8/month) – Get Listed
        </button>
      )}
      <button onClick={() => { localStorage.removeItem('token'); setToken(''); setUser(null); setView('home'); }} style={{ marginTop: '20px', padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
    </div>
  );
}

export default TradesDashboard;
