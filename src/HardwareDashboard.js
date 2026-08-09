import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function HardwareDashboard({ token }) {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ product_name: '', category: '', unit: '', price: '', stock_quantity: '' });
  const [shopForm, setShopForm] = useState({ shop_name: '', shop_address: '', city: '', phone: '', email: '', business_reg_number: '' });

  const fetchShop = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/hardware/shop`, { headers: { Authorization: `Bearer ${token}` } });
      setShop(response.data.shop);
      const productsResponse = await axios.get(`${API_URL}/hardware/products`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(productsResponse.data.products || []);
    } catch (error) { setShop(null); }
    setLoading(false);
  };

  const registerShop = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/hardware/register`, shopForm, { headers: { Authorization: `Bearer ${token}` } });
      alert('Shop registered!');
      fetchShop();
    } catch (error) { alert('Registration failed'); }
    setLoading(false);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/hardware/products`, newProduct, { headers: { Authorization: `Bearer ${token}` } });
      alert('Product added!');
      setNewProduct({ product_name: '', category: '', unit: '', price: '', stock_quantity: '' });
      setShowAddProduct(false);
      fetchShop();
    } catch (error) { alert('Failed to add product'); }
    setLoading(false);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/hardware/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Deleted');
      fetchShop();
    } catch (error) { alert('Failed to delete'); }
  };

  useEffect(() => { if (token) fetchShop(); }, [token]);

  if (!shop) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Register Your Hardware Shop</h2>
        <form onSubmit={registerShop}>
          <input type="text" placeholder="Shop Name" value={shopForm.shop_name} onChange={(e) => setShopForm({ ...shopForm, shop_name: e.target.value })} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="text" placeholder="Address" value={shopForm.shop_address} onChange={(e) => setShopForm({ ...shopForm, shop_address: e.target.value })} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="text" placeholder="City" value={shopForm.city} onChange={(e) => setShopForm({ ...shopForm, city: e.target.value })} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="text" placeholder="Phone" value={shopForm.phone} onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="email" placeholder="Email" value={shopForm.email} onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <input type="text" placeholder="Business Reg Number" value={shopForm.business_reg_number} onChange={(e) => setShopForm({ ...shopForm, business_reg_number: e.target.value })} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }} required />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00A896', color: 'white', border: 'none' }}>Register Shop</button>
        </form>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>Subscription starts at $10/month.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>{shop.shop_name}</h1>
      <p>{shop.city} • {shop.is_verified ? 'Verified' : 'Pending'}</p>
      <button onClick={() => setShowAddProduct(!showAddProduct)} style={{ padding: '10px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', marginBottom: '20px' }}>{showAddProduct ? 'Cancel' : '+ Add Product'}</button>
      {showAddProduct && (
        <form onSubmit={addProduct} style={{ backgroundColor: '#f8f9fa', padding: '20px', marginBottom: '20px' }}>
          <input type="text" placeholder="Product Name" value={newProduct.product_name} onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })} style={{ width: '48%', padding: '10px', margin: '5px' }} required />
          <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '48%', padding: '10px', margin: '5px' }} required>
            <option value="">Category</option>
            <option value="Building Materials">Building Materials</option>
            <option value="Steel & Rebar">Steel & Rebar</option>
            <option value="Finishing">Finishing</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Tools">Tools</option>
          </select>
          <input type="text" placeholder="Unit" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} style={{ width: '30%', padding: '10px', margin: '5px' }} required />
          <input type="number" placeholder="Price (USD)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ width: '30%', padding: '10px', margin: '5px' }} required />
          <input type="number" placeholder="Stock" value={newProduct.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} style={{ width: '30%', padding: '10px', margin: '5px' }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00A896', color: 'white', border: 'none' }}>Add Product</button>
        </form>
      )}
      <h2>Products ({products.length})</h2>
      {products.map(p => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
          <span><strong>{p.product_name}</strong> - {p.category} - ${p.price}</span>
          <button onClick={() => deleteProduct(p.id)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '4px 10px' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default HardwareDashboard;
