// ============================================
// VERIBUILD - REGISTER HARDWARE SHOP
// ============================================

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function RegisterShop({ setView, setToken, setUser }) {
  const [formData, setFormData] = useState({
    shop_name: '',
    shop_address: '',
    city: '',
    phone: '',
    email: '',
    business_reg_number: '',
    password: '',
    full_name: '',
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

    try {
      // Step 1: Register the user
      const userResponse = await axios.post(`${API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: 'hardware_shop',
        city: formData.city,
        registration_number: formData.business_reg_number,
      });

      const { token, user } = userResponse.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      // Step 2: Register the shop
      await axios.post(`${API_URL}/hardware/register`, {
        shop_name: formData.shop_name,
        shop_address: formData.shop_address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        business_reg_number: formData.business_reg_number,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Shop registered successfully!');
      setView('hardware');
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: '#1A2B5E' }}>Register as Hardware Shop</h2>
      <p style={{ color: '#666' }}>List your products and get BOQ leads from architects.</p>
      
      {error && (
        <div style={{ backgroundColor: '#fce4ec', padding: '10px', borderRadius: '5px', color: '#e74c3c', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="shop_name"
            placeholder="Shop Name"
            value={formData.shop_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="shop_address"
            placeholder="Shop Address"
            value={formData.shop_address}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="business_reg_number"
            placeholder="Business Registration Number"
            value={formData.business_reg_number}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="full_name"
            placeholder="Your Full Name (Contact Person)"
            value={formData.full_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
          <small style={{ color: '#666' }}>At least 6 characters.</small>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Registering...' : 'Register Shop'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account?{' '}
        <span onClick={() => setView('login')} style={{ color: '#1A2B5E', cursor: 'pointer', textDecoration: 'underline' }}>
          Login here
        </span>
      </p>
      <button onClick={() => setView('home')} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
        Back to Home
      </button>
    </div>
  );
}

export default RegisterShop;
