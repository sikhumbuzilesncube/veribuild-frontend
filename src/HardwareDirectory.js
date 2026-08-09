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
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchShops(); }, []);

  const getTierInfo = (tier) => {
    const tiers = { enterprise: { label: 'Preferred Supplier', color: '#e74c3c', bg: '#fce4ec' }, premium: { label: 'Featured', color: '#f39c12', bg: '#fff3e0' }, basic: { label: 'Listed', color: '#00A896', bg: '#e8f5e9' }, free: { label: 'Free', color: '#999', bg: '#f5f5f5' } };
    return tiers[tier] || tiers.free;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', color: '#1A2B5E' }}>Hardware Shops Directory</h1>
      <div style={{ marginBottom: '20px' }}>
        <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); fetchShops(e.target.value); }} style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <option value="">All Cities</option>
          {cities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        <button onClick={() => { setSelectedCity(''); fetchShops(''); }} style={{ padding: '8px 15px', backgroundColor: '#f0f0f0', border: 'none', marginLeft: '10px' }}>Clear</button>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && shops.length === 0 && <p>No shops found.</p>}
      {!loading && shops.filter(s => s.subscription_tier === 'enterprise').length > 0 && (
        <div>
          <h2>Preferred Suppliers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {shops.filter(s => s.subscription_tier === 'enterprise').map(shop => <ShopCard key={shop.id} shop={shop} getTierInfo={getTierInfo} />)}
          </div>
        </div>
      )}
      {!loading && shops.filter(s => s.subscription_tier === 'premium').length > 0 && (
        <div>
          <h2>Featured Shops</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {shops.filter(s => s.subscription_tier === 'premium').map(shop => <ShopCard key={shop.id} shop={shop} getTierInfo={getTierInfo} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ShopCard({ shop, getTierInfo }) {
  const tier = getTierInfo(shop.subscription_tier);
  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: shop.subscription_tier === 'enterprise' ? '2px solid #e74c3c' : '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>{shop.shop_name}</h3>
        <span style={{ backgroundColor: tier.bg, color: tier.color, padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>{tier.label}</span>
      </div>
      <p>{shop.city}</p>
      <p>{shop.phone}</p>
      <button style={{ marginTop: '15px', padding: '8px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '6px', width: '100%' }}>View Products</button>
    </div>
  );
}

export default HardwareDirectory;
