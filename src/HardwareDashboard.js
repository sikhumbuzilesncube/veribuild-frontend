// ============================================
// VERIBUILD - HARDWARE SHOP DASHBOARD
// Complete working version with logout
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function HardwareDashboard({ token, setToken, setUser, setView }) {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    category: '',
    unit: '',
    price: '',
    stock_quantity: ''
  });

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
  // FETCH SHOP AND PRODUCTS
  // ============================================

  const fetchShop = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/hardware/shop`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.shop) {
        setShop(response.data.shop);
        // Fetch products
        const productsResponse = await axios.get(`${API_URL}/hardware/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(productsResponse.data.products || []);
      } else {
        setError('Shop not found. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      setError('Failed to load shop data. Please try again.');
    }
    setLoading(false);
  };

  // ============================================
  // ADD PRODUCT
  // ============================================

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate fields
    if (!newProduct.product_name || !newProduct.category || !newProduct.unit || !newProduct.price) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // First, get the shop to ensure we have the correct shop_id
      const shopResponse = await axios.get(`${API_URL}/hardware/shop`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!shopResponse.data.shop) {
        setError('Shop not found. Please contact support.');
        setLoading(false);
        return;
      }

      const shopId = shopResponse.data.shop.id;

      const payload = {
        shop_id: shopId,
        product_name: newProduct.product_name,
        category: newProduct.category,
        unit: newProduct.unit,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity) || 0
      };

      console.log('Sending payload:', payload);

      const response = await axios.post(`${API_URL}/hardware/products`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      alert('Product added successfully!');
      setNewProduct({ product_name: '', category: '', unit: '', price: '', stock_quantity: '' });
      setShowAddProduct(false);
      fetchShop();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      setError('Failed to add product: ' + errorMsg);
    }
    setLoading(false);
  };

  // ============================================
  // DELETE PRODUCT
  // ============================================

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/hardware/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product deleted successfully');
      fetchShop();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  // ============================================
  // AUTO-LOAD
  // ============================================

  useEffect(() => {
    if (token) {
      fetchShop();
    }
  }, [token]);

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading your shop...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header with Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1A2B5E' }}>{shop?.shop_name || 'Ncube Hardware'}</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            {shop?.city || 'Bulawayo'} • {shop?.is_verified ? '✅ Verified' : '⏳ Pending Verification'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Plan: <strong style={{ color: '#999' }}>FREE</strong>
          </p>
          <button
            onClick={() => alert('Upgrade to Basic ($10/mo) to start getting BOQ leads!')}
            style={{
              padding: '4px 12px',
              backgroundColor: '#00A896',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: '5px'
            }}
          >
            Upgrade to Basic ($10/mo)
          </button>
          <br />
          <button
            onClick={handleLogout}
            style={{
              marginTop: '8px',
              padding: '6px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fce4ec',
          padding: '12px',
          borderRadius: '8px',
          color: '#e74c3c',
          marginBottom: '15px',
          border: '1px solid #e74c3c'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Products</p>
          <h2 style={{ margin: '5px 0 0 0', color: '#1A2B5E' }}>{products.length}</h2>
        </div>
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Active Products</p>
          <h2 style={{ margin: '5px 0 0 0', color: '#00A896' }}>
            {products.filter(p => p.is_active).length}
          </h2>
        </div>
        <div style={{ backgroundColor: '#fce4ec', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Out of Stock</p>
          <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c' }}>
            {products.filter(p => p.stock_quantity === 0).length}
          </h2>
        </div>
      </div>

      {/* Add Product Button */}
      <button
        onClick={() => setShowAddProduct(!showAddProduct)}
        style={{
          padding: '10px 25px',
          backgroundColor: '#1A2B5E',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showAddProduct ? 'Cancel' : '+ Add Product'}
      </button>

      {/* Add Product Form */}
      {showAddProduct && (
        <form onSubmit={addProduct} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Add New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder="Product Name *"
              value={newProduct.product_name}
              onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            >
              <option value="">Select Category *</option>
              <option value="Building Materials">Building Materials</option>
              <option value="Steel & Rebar">Steel & Rebar</option>
              <option value="Finishing">Finishing</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Tools">Tools</option>
              <option value="Paint">Paint</option>
              <option value="Roofing">Roofing</option>
              <option value="Timber">Timber</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Unit (e.g., bag, kg, m²) *"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <input
              type="number"
              placeholder="Price (USD) *"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock_quantity}
              onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '10px 25px',
              backgroundColor: '#00A896',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      )}

      {/* Product List */}
      <h2 style={{ color: '#1A2B5E' }}>Your Products</h2>
      {products.length === 0 ? (
        <p style={{ color: '#666' }}>No products yet. Add your first product to start getting BOQ leads!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Unit</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}><strong>{p.product_name}</strong></td>
                <td style={{ padding: '10px' }}>{p.category}</td>
                <td style={{ padding: '10px' }}>{p.unit}</td>
                <td style={{ padding: '10px' }}>${p.price}</td>
                <td style={{ padding: '10px' }}>{p.stock_quantity}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ color: p.is_active ? '#00A896' : '#e74c3c' }}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HardwareDashboard;
