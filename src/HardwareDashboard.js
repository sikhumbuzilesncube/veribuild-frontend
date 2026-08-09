// ============================================
// VERIBUILD - HARDWARE SHOP DASHBOARD
// Manage products and shop details
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function HardwareDashboard({ token }) {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    category: '',
    unit: '',
    price: '',
    stock_quantity: ''
  });

  // Shop registration form
  const [shopForm, setShopForm] = useState({
    shop_name: '',
    shop_address: '',
    city: '',
    phone: '',
    email: '',
    business_reg_number: ''
  });

  // ============================================
  // FETCH SHOP AND PRODUCTS
  // ============================================

  const fetchShop = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/hardware/shop`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShop(response.data.shop);
      
      // Fetch products
      const productsResponse = await axios.get(`${API_URL}/hardware/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(productsResponse.data.products || []);
    } catch (error) {
      console.error('Error fetching shop:', error);
      setShop(null);
    }
    setLoading(false);
  };

  // ============================================
  // REGISTER SHOP
  // ============================================

  const registerShop = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/hardware/register`, shopForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Shop registered successfully!');
      fetchShop();
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  // ============================================
  // ADD PRODUCT
  // ============================================

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/hardware/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added successfully!');
      setNewProduct({ product_name: '', category: '', unit: '', price: '', stock_quantity: '' });
      setShowAddProduct(false);
      fetchShop();
    } catch (error) {
      alert('Failed to add product: ' + (error.response?.data?.detail || 'Unknown error'));
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
  // UPGRADE SUBSCRIPTION
  // ============================================

  const upgradeSubscription = async (tier) => {
    if (!window.confirm(`Upgrade to ${tier.toUpperCase()} tier for $${tier === 'basic' ? 10 : tier === 'premium' ? 25 : 50}/month?`)) return;
    try {
      await axios.post(`${API_URL}/hardware/upgrade`, { tier }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Successfully upgraded to ${tier.toUpperCase()} tier!`);
      fetchShop();
    } catch (error) {
      alert('Upgrade failed: ' + (error.response?.data?.detail || 'Unknown error'));
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
  // RENDER - REGISTER SHOP
  // ============================================

  if (!shop) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#1A2B5E' }}>Register Your Hardware Shop</h2>
        <p style={{ color: '#666' }}>List your products and start getting BOQ leads from architects.</p>
        <form onSubmit={registerShop}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Shop Name"
              value={shopForm.shop_name}
              onChange={(e) => setShopForm({ ...shopForm, shop_name: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Shop Address"
              value={shopForm.shop_address}
              onChange={(e) => setShopForm({ ...shopForm, shop_address: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="City"
              value={shopForm.city}
              onChange={(e) => setShopForm({ ...shopForm, city: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Phone"
              value={shopForm.phone}
              onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              value={shopForm.email}
              onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Business Registration Number"
              value={shopForm.business_reg_number}
              onChange={(e) => setShopForm({ ...shopForm, business_reg_number: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00A896',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Registering...' : 'Register Shop'}
          </button>
        </form>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Subscription starts at $10/month. Upgrade to get more visibility.
        </p>
      </div>
    );
  }

  // ============================================
  // RENDER - SHOP DASHBOARD
  // ============================================

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1A2B5E' }}>{shop.shop_name}</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            {shop.city} • {shop.is_verified ? '✅ Verified' : '⏳ Pending Verification'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Plan: <strong style={{ color: shop.subscription_tier === 'enterprise' ? '#e74c3c' : shop.subscription_tier === 'premium' ? '#f39c12' : '#00A896' }}>
              {shop.subscription_tier.toUpperCase()}
            </strong>
          </p>
          {shop.subscription_tier === 'free' && (
            <button
              onClick={() => upgradeSubscription('basic')}
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
          )}
          {shop.subscription_tier === 'basic' && (
            <button
              onClick={() => upgradeSubscription('premium')}
              style={{
                padding: '4px 12px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '5px'
              }}
            >
              Upgrade to Premium ($25/mo)
            </button>
          )}
          {shop.subscription_tier === 'premium' && (
            <button
              onClick={() => upgradeSubscription('enterprise')}
              style={{
                padding: '4px 12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '5px'
              }}
            >
              Upgrade to Enterprise ($50/mo)
            </button>
          )}
        </div>
      </div>

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
              placeholder="Product Name"
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
              <option value="">Select Category</option>
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
              placeholder="Unit (e.g., bag, kg, m²)"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <input
              type="number"
              placeholder="Price (USD)"
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
      <h2 style={{ color: '#1A2B5E' }}>Products</h2>
      {products.length === 0 ? (
        <p style={{ color: '#666' }}>No products yet. Add your first product!</p>
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
