// ============================================
// VERIBUILD - REGISTER SKILLED TRADER
// ============================================

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function RegisterTrade({ setView, setToken, setUser }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    trade: '',
    city: '',
    phone: '',
    bio: '',
    years_experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Register the user with role 'tradesperson'
      const userResponse = await axios.post(`${API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: 'tradesperson',
        city: formData.city,
        phone: formData.phone
      });

      const { token, user } = userResponse.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      // Step 2: Register the tradesperson profile
      await axios.post(`${API_URL}/trades/register`, {
        full_name: formData.full_name,
        trade: formData.trade,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        bio: formData.bio,
        years_experience: parseInt(formData.years_experience) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Registration successful! You can now manage your trade profile.');
      setView('trades');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: '#1A2B5E' }}>Register as Skilled Trader</h2>
      <p style={{ color: '#666' }}>Get discovered by homeowners and architects.</p>
      
      {error && (
        <div style={{ backgroundColor: '#fce4ec', padding: '10px', borderRadius: '5px', color: '#e74c3c', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        />
        
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        />
        
        <select
          name="trade"
          value={formData.trade}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        >
          <option value="">Select Your Trade</option>
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
        
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        />
        
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          required
        />
        
        <input
          type="number"
          name="years_experience"
          placeholder="Years of Experience"
          value={formData.years_experience}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        
        <textarea
          name="bio"
          placeholder="Bio (experience, skills, etc.)"
          value={formData.bio}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px', minHeight: '80px' }}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginTop: '10px'
          }}
        >
          {loading ? 'Registering...' : 'Register as Skilled Trader'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account?{' '}
        <span onClick={() => setView('login')} style={{ color: '#1A2B5E', cursor: 'pointer', textDecoration: 'underline' }}>
          Login here
        </span>
      </p>
      
      <button
        onClick={() => setView('home')}
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#eee',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default RegisterTrade;
