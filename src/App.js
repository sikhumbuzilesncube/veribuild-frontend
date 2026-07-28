// ============================================
// VERIBUILD FRONTEND - MAIN APP
// Deploy to Vercel
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API URL (your live backend)
const API_URL = 'https://veribuild-backend.onrender.com/api';

function App() {
  const [view, setView] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('architect');
  const [regCity, setRegCity] = useState('');  // NEW
const [regRegNumber, setRegRegNumber] = useState('');  // NEW

  // Submission state
  const [newProject, setNewProject] = useState({
    project_name: '',
    project_address: '',
    city: '',
    land_size: '',
    usage_type: 'residential',
    declared_scale: '',
    file_url: ''
  });

  // ============================================
  // AUTH FUNCTIONS
  // ============================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: loginEmail,
        password: loginPassword
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setView('dashboard');
      alert('Login successful!');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: regEmail,
      password: regPassword,
      full_name: regFullName,
      role: regRole,
      city: regCity,  // NEW
      registration_number: regRegNumber  // NEW
    });
    // ... rest of the function remains the same
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setView('dashboard');
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setView('home');
  };

  // ============================================
  // SUBMISSION FUNCTIONS
  // ============================================

  const fetchSubmissions = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const createSubmission = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login first');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/submissions`, {
        project_name: newProject.project_name,
        project_address: newProject.project_address,
        city: newProject.city,
        land_size: parseFloat(newProject.land_size),
        usage_type: newProject.usage_type,
        declared_scale: newProject.declared_scale,
        file_url: newProject.file_url || 'https://example.com/placeholder.pdf'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Submission created successfully!');
      setNewProject({
        project_name: '',
        project_address: '',
        city: '',
        land_size: '',
        usage_type: 'residential',
        declared_scale: '',
        file_url: ''
      });
      fetchSubmissions();
    } catch (error) {
      alert('Submission failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  // ============================================
  // LEADERBOARD FUNCTIONS
  // ============================================

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // ============================================
  // AUTO-LOGIN CHECK
  // ============================================

  useEffect(() => {
    if (token) {
      // Try to fetch user data (optional)
      setView('dashboard');
      fetchSubmissions();
    }
    fetchLeaderboard();
  }, [token]);

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderHome = () => (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
        🏗️ VeriBuild
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        AI-powered building approvals. Built for trust.
      </p>

      {/* Leaderboard */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
          🏆 Top Architects
        </h2>
        {leaderboard.length === 0 ? (
          <p>No approved plans yet. Be the first!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Architect</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Approved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{index + 1}</td>
                  <td style={{ padding: '10px' }}>{item.architect_name}</td>
                  <td style={{ padding: '10px' }}>{item.approved_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Login/Register Buttons */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setView('login')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#1A2B5E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <button
          onClick={() => setView('register')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#00A896',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Register as Architect
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
        Login to VeriBuild
      </h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
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
            backgroundColor: '#1A2B5E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account?{' '}
        <span
          onClick={() => setView('register')}
          style={{ color: '#00A896', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Register here
        </span>
      </p>
      <button
        onClick={() => setView('home')}
        style={{ marginTop: '15px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        ← Back to Home
      </button>
    </div>
  );

  const renderRegister = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
        Register as Architect
      </h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
          <input
            type="text"
            value={regFullName}
            onChange={(e) => setRegFullName(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
          <select
            value={regRole}
            onChange={(e) => setRegRole(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          >
            <option value="architect">Architect</option>
            <option value="council_officer">Council Officer</option>
          </select>
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
            cursor: 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Already have an account?{' '}
        <span
          onClick={() => setView('login')}
          style={{ color: '#1A2B5E', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Login here
        </span>
      </p>
      <button
        onClick={() => setView('home')}
        style={{ marginTop: '15px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        ← Back to Home
      </button>
    </div>
  );

  const renderDashboard = () => {
    if (!user) {
      return <p>Please login first.</p>;
    }

    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
            👋 Welcome, {user.full_name}
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Company:</strong> {user.company_name || 'Not specified'}</p>
        </div>

        {/* New Submission Form */}
        {user.role === 'architect' && (
          <div style={{ backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>📤 New Submission</h2>
            <form onSubmit={createSubmission}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.project_name}
                  onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Project Address"
                  value={newProject.project_address}
                  onChange={(e) => setNewProject({ ...newProject, project_address: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="City"
                  value={newProject.city}
                  onChange={(e) => setNewProject({ ...newProject, city: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="number"
                  placeholder="Land Size (sqm)"
                  value={newProject.land_size}
                  onChange={(e) => setNewProject({ ...newProject, land_size: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <select
                  value={newProject.usage_type}
                  onChange={(e) => setNewProject({ ...newProject, usage_type: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Declared Scale (e.g., 1:100)"
                  value={newProject.declared_scale}
                  onChange={(e) => setNewProject({ ...newProject, declared_scale: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="PDF URL (placeholder for now)"
                  value={newProject.file_url}
                  onChange={(e) => setNewProject({ ...newProject, file_url: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1A2B5E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Plan'}
              </button>
            </form>
          </div>
        )}

        {/* Submissions List */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>📋 My Submissions</h2>
          <button
            onClick={fetchSubmissions}
            style={{
              padding: '8px 15px',
              backgroundColor: '#00A896',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Refresh
          </button>
          {submissions.length === 0 ? (
            <p>No submissions yet. Submit your first plan!</p>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' }}>
                <h3 style={{ fontWeight: 'bold' }}>{sub.project_name}</h3>
                <p style={{ color: '#666' }}>{sub.project_address}, {sub.city}</p>
                <p><strong>Status:</strong> <span style={{ color: sub.status === 'approved' ? '#00A896' : sub.status === 'submitted' ? '#f39c12' : '#e74c3c' }}>{sub.status}</span></p>
                <p><strong>Submitted:</strong> {new Date(sub.submitted_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setView('home')}
          style={{ marginTop: '20px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ← Back to Home
        </button>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  if (view === 'home') return renderHome();
  if (view === 'login') return renderLogin();
  if (view === 'register') return renderRegister();
  if (view === 'dashboard') return renderDashboard();

  return <div>Page not found</div>;
}

export default App;
