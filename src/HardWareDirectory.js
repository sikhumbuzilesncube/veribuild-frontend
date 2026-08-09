// ============================================
// VERIBUILD - PUBLIC HARDWARE DIRECTORY
// Homeowners and Architects can find shops
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function HardwareDirectory() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);

  const fetchShops = async (city = '') => {
    setLoading(true);
    try {
      const url = city ? `${API_URL}/hardware/public/shops?city=${city}` : `${API_URL}/hardware/public/shops`;
      const response = await axios.get(url);
      setShops(response.data.shops || []);
      
      const uniqueCities = [...new Set(response.data.shops.map(s => s.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const getTierInfo = (tier) => {
    const tiers = {
      enterprise: { label: '🏆 Preferred Supplier', color: '#e74c3c', bg: '#fce4ec' },
      premium: { label: '⭐ Featured', color: '#f39c12', bg: '#fff3e0' },
      basic: { label: 'Listed', color: '#00A896', bg: '#e8f5e9' },
      free: { label: 'Free', color: '#999', bg: '#f5f5f5' }
    };
    return tiers[tier] || tiers.free;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', color: '#1A2B5E', margin: 0 }}>
          Hardware Shops Directory
        </h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>
          Find building materials from trusted suppliers in your city.
        </p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>Filter by City:</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            fetchShops(e.target.value);
          }}
          style={{
            padding: '8px 15px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSelectedCity('');
            fetchShops('');
          }}
          style={{
            padding: '8px 15px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p>Loading shops...</p>}

      {!loading && shops.length === 0 && (
        <p style={{ color: '#666' }}>No hardware shops found in your area. Check back soon!</p>
      )}

      {!loading && shops.filter(s => s.subscription_tier === 'enterprise').length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', color: '#1A2B5E', borderBottom: '2px solid #e74c3c', paddingBottom: '10px' }}>
            🏆 Preferred Suppliers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {shops.filter(s => s.subscription_tier === 'enterprise').map((shop) => (
              <ShopCard key={shop.id} shop={shop} getTierInfo={getTierInfo} />
            ))}
          </div>
        </div>
      )}

      {!loading && shops.filter(s => s.subscription_tier === 'premium').length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', color: '#1A2B5E', borderBottom: '2px solid #f39c12', paddingBottom: '10px' }}>
            ⭐ Featured Shops
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {shops.filter(s => s.subscription_tier === 'premium').map((shop) => (
              <ShopCard key={shop.id} shop={shop} getTierInfo={getTierInfo} />
            ))}
          </div>
        </div>
      )}

      {!loading && shops.filter(s => !['enterprise', 'premium'].includes(s.subscription_tier)).length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', color: '#1A2B5E', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            All Shops
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {shops.filter(s => !['enterprise', 'premium'].includes(s.subscription_tier)).map((shop) => (
              <ShopCard key={shop.id} shop={shop} getTierInfo={getTierInfo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShopCard({ shop, getTierInfo }) {
  const tier = getTierInfo(shop.subscription_tier);

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: shop.subscription_tier === 'enterprise' ? '2px solid #e74c3c' : '1px solid #e0e0e0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#1A2B5E' }}>{shop.shop_name}</h3>
        <span style={{
          backgroundColor: tier.bg,
          color: tier.color,
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}>
          {tier.label}
        </span>
      </div>
      <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
        📍 {shop.city || 'N/A'}
      </p>
      <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
        📞 {shop.phone || 'N/A'}
      </p>
      {shop.is_verified && (
        <p style={{ margin: '5px 0', color: '#00A896', fontSize: '13px' }}>
          ✅ Verified Shop
        </p>
      )}
      {shop.rating > 0 && (
        <p style={{ margin: '5px 0', color: '#f39c12', fontSize: '13px' }}>
          ⭐ {shop.rating.toFixed(1)} ({shop.total_reviews} reviews)
        </p>
      )}
      <button
        onClick={() => window.open(`/shop/${shop.id}`, '_blank')}
        style={{
          marginTop: '15px',
          padding: '8px 20px',
          backgroundColor: '#1A2B5E',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        View Products
      </button>
    </div>
  );
}

export default HardwareDirectory;
