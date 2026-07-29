// ============================================
// VERIBUILD FRONTEND - PROFESSIONAL VERSION 2.0
// No AI boilerplate. Clean, corporate design.
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API URL
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
  const [regCouncil, setRegCouncil] = useState('');
  const [regRegNumber, setRegRegNumber] = useState('');

  // Submission state
  const [newProject, setNewProject] = useState({
    project_name: '',
    project_address: '',
    council: '',
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
        city: regCouncil,
        registration_number: regRegNumber
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
        city: newProject.council,
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
        council: '',
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
      setView('dashboard');
      fetchSubmissions();
    }
    fetchLeaderboard();
  }, [token]);

  // ============================================
  // HOME PAGE (REDESIGNED)
  // ============================================

  const renderHome = () => (
    <div style={{ 
      padding: '20px', 
      maxWidth: '900px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '30px'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1A2B5E' }}>
          VeriBuild
        </h1>
        <p style={{ color: '#666', fontSize: '18px', margin: '0 0 25px 0' }}>
          AI-powered building approval platform
        </p>
        
        {/* Buttons moved below the tagline */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={() => setView('login')}
            style={{
              padding: '10px 35px',
              backgroundColor: '#1A2B5E',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setView('register')}
            style={{
              padding: '10px 35px',
              backgroundColor: '#00A896',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#f0f4f8', 
        padding: '40px', 
        borderRadius: '12px', 
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '10px', color: '#1A2B5E' }}>
          Streamline Your Building Approvals
        </h2>
        <p style={{ fontSize: '18px', color: '#333', maxWidth: '600px', margin: '0 auto' }}>
          VeriBuild connects architects, councils, and the public to make the approval process faster, transparent, and more efficient.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px'
      }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#1A2B5E' }}>Digital Submissions</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Architects submit building plans digitally with a single click.</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#1A2B5E' }}>Rapid Approvals</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Councils review, comment, and approve plans in record time.</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#1A2B5E' }}>Transparent Leaderboard</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>See which architects have the best approval track record.</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, color: '#1A2B5E' }}>Real-Time Tracking</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Real-time updates on the progress of your submissions.</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#1A2B5E' }}>
          Top Architects
        </h2>
        {leaderboard.length === 0 ? (
          <p>No approved plans yet. Be the first!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Architect</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Council</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Approved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{index + 1}</td>
                  <td style={{ padding: '12px' }}><strong>{item.architect_name}</strong></td>
                  <td style={{ padding: '12px' }}>{item.city || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{item.approved_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: '1px solid #e0e0e0', 
        paddingTop: '20px', 
        textAlign: 'center',
        color: '#999',
        fontSize: '14px'
      }}>
        <p>© 2026 VeriBuild. Built by Gatekeeper AI.</p>
      </div>
    </div>
  );

  // ============================================
  // LOGIN PAGE
  // ============================================

  const renderLogin = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1A2B5E' }}>
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

  // ============================================
  // REGISTER PAGE
  // ============================================

  const renderRegister = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1A2B5E' }}>
        Register for VeriBuild
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
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
          <select
            value={regRole}
            onChange={(e) => {
              setRegRole(e.target.value);
              if (e.target.value === 'council_officer') {
                setRegRegNumber('');
              }
            }}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          >
            <option value="architect">Architect</option>
            <option value="council_officer">Council Officer</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Council</label>
          <select
            value={regCouncil}
            onChange={(e) => setRegCouncil(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            required
          >
            <option value="">Select your council...</option>
            <option value="Harare City Council">Harare City Council</option>
            <option value="Bulawayo City Council">Bulawayo City Council</option>
            <option value="Mutare City Council">Mutare City Council</option>
            <option value="Gweru City Council">Gweru City Council</option>
            <option value="Kwekwe City Council">Kwekwe City Council</option>
            <option value="Masvingo City Council">Masvingo City Council</option>
            <option value="Marondera Municipality">Marondera Municipality</option>
            <option value="Chinhoyi Municipality">Chinhoyi Municipality</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {regRole === 'architect' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Architect Registration Number</label>
            <input
              type="text"
              placeholder="e.g., ARCH-2024-001"
              value={regRegNumber}
              onChange={(e) => setRegRegNumber(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              required
            />
            <small style={{ color: '#666' }}>Your official registration number from the Architects Council.</small>
          </div>
        )}

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

  // ============================================
  // DASHBOARD (PROFESSIONAL)
  // ============================================

  const renderDashboard = () => {
    if (!user) {
      return <p>Please login first.</p>;
    }

    return (
      <div style={{ 
        padding: '20px', 
        maxWidth: '1000px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Dashboard Header - NO EMOJIS */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#1A2B5E' }}>
              Welcome, {user.full_name}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              {user.role === 'architect' ? 'Architect' : 'Council Officer'} • {user.city || 'Council not set'}
            </p>
          </div>
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

        {/* Stats Cards - Professional */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '30px'
        }}>
          <div style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Submissions</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#1A2B5E' }}>{submissions.length}</h2>
          </div>
          <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Approved</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#00A896' }}>
              {submissions.filter(s => s.status === 'approved').length}
            </h2>
          </div>
          <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pending Review</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#f39c12' }}>
              {submissions.filter(s => s.status === 'submitted' || s.status === 'under_review').length}
            </h2>
          </div>
          <div style={{ backgroundColor: '#fce4ec', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Changes Required</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c' }}>
              {submissions.filter(s => s.status === 'changes_required').length}
            </h2>
          </div>
        </div>

        {/* Service Navigation - No Emojis */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '20px'
        }}>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Services:</span>
          <button 
            onClick={() => alert('Plan Tracking: See the real-time status of all your submissions below.')}
            style={{
              padding: '8px 20px',
              backgroundColor: '#1A2B5E',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Plan Tracking
          </button>
          {user.role === 'architect' && (
            <button 
              onClick={() => alert('BOQ Service: Generate detailed Bills of Quantities for your projects. (Coming soon!)')}
              style={{
                padding: '8px 20px',
                backgroundColor: '#00A896',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              BOQ Services
            </button>
          )}
          <button 
            onClick={() => alert('Report any issues or request support.')}
            style={{
              padding: '8px 20px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Support
          </button>
        </div>

        {/* Architect-Only: New Submission Form - No Emojis */}
        {user.role === 'architect' && (
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '25px', 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            marginBottom: '30px' 
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#1A2B5E' }}>
              New Submission
            </h2>
            <form onSubmit={createSubmission}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={newProject.project_name}
                    onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Project Address"
                    value={newProject.project_address}
                    onChange={(e) => setNewProject({ ...newProject, project_address: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <select
                    value={newProject.council}
                    onChange={(e) => setNewProject({ ...newProject, council: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  >
                    <option value="">Select Council...</option>
                    <option value="Harare City Council">Harare City Council</option>
                    <option value="Bulawayo City Council">Bulawayo City Council</option>
                    <option value="Mutare City Council">Mutare City Council</option>
                    <option value="Gweru City Council">Gweru City Council</option>
                    <option value="Kwekwe City Council">Kwekwe City Council</option>
                    <option value="Masvingo City Council">Masvingo City Council</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Land Size (sqm)"
                    value={newProject.land_size}
                    onChange={(e) => setNewProject({ ...newProject, land_size: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
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
                <div>
                  <input
                    type="text"
                    placeholder="Scale (e.g., 1:100)"
                    value={newProject.declared_scale}
                    onChange={(e) => setNewProject({ ...newProject, declared_scale: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="PDF URL (Google Drive or Dropbox link)"
                  value={newProject.file_url}
                  onChange={(e) => setNewProject({ ...newProject, file_url: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <small style={{ color: '#666' }}>Paste a shareable link to your plan PDF.</small>
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
                  cursor: 'pointer',
                  marginTop: '15px'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Plan'}
              </button>
            </form>
          </div>
        )}

        {/* Submissions List - No Emojis */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B5E' }}>
              {user.role === 'architect' ? 'My Submissions' : 'All Submissions'}
            </h2>
            <button
              onClick={fetchSubmissions}
              style={{
                padding: '8px 15px',
                backgroundColor: '#00A896',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
          {submissions.length === 0 ? (
            <p style={{ color: '#666' }}>No submissions yet. Submit your first plan!</p>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} style={{ 
                backgroundColor: '#fff', 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#1A2B5E' }}>{sub.project_name}</h3>
                  <p style={{ margin: '0', color: '#666' }}>{sub.project_address}, {sub.city}</p>
                  <p style={{ margin: '5px 0 0 0' }}>
                    <strong>Status:</strong> 
                    <span style={{ 
                      color: sub.status === 'approved' ? '#00A896' : 
                             sub.status === 'submitted' ? '#f39c12' : 
                             sub.status === 'changes_required' ? '#e74c3c' : '#666',
                      marginLeft: '5px'
                    }}>
                      {sub.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    {new Date(sub.submitted_at).toLocaleDateString()}
                  </p>
                  <button 
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#1A2B5E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}
                    onClick={() => alert(`Plan #${sub.id}\nStatus: ${sub.status}\nSubmitted: ${new Date(sub.submitted_at).toLocaleString()}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setView('home')}
          style={{ marginTop: '30px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
