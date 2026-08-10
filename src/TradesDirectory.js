// ============================================
// VERIBUILD - PUBLIC TRADES DIRECTORY
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function TradesDirectory() {
  const [tradespeople, setTradespeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState('');
  const [city, setCity] = useState('');

  const search = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/trades/public/search?trade=${trade}&city=${city}`;
      const response = await axios.get(url);
      setTradespeople(response.data.tradespeople || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', color: '#1A2B5E' }}>🔧 Find Skilled Tradespeople</h1>
      <p style={{ color: '#666' }}>Search for plumbers, electricians, painters, and more.</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select value={trade} onChange={(e) => setTrade(e.target.value)} style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <option value="">All Trades</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Painter">Painter</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Builder">Builder</option>
          <option value="Tiler">Tiler</option>
          <option value="Roofing">Roofing</option>
          <option value="Landscaping">Landscaping</option>
        </select>
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '5px' }} />
        <button onClick={search} style={{ padding: '8px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '5px' }}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {tradespeople.length === 0 && !loading && <p>No tradespeople found in your area.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {tradespeople.map((person) => (
          <div key={person.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, color: '#1A2B5E' }}>{person.full_name}</h3>
            <p style={{ color: '#f39c12', fontWeight: 'bold' }}>{person.trade}</p>
            <p style={{ color: '#666' }}>📍 {person.city}</p>
            {person.avg_rating > 0 && <p style={{ color: '#f39c12' }}>⭐ {person.avg_rating} ({person.review_count} reviews)</p>}
            <p style={{ color: '#666' }}>{person.bio}</p>
            <p><strong>Experience:</strong> {person.years_experience} years</p>
            <p><strong>Rate:</strong> ${person.hourly_rate}/hour</p>
            <button style={{ marginTop: '10px', padding: '8px 20px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '6px', width: '100%' }}>Contact</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TradesDirectory;
