// ============================================
// VERIBUILD FRONTEND - COMPLETE
// With Hardware Shop Registration & Role-Based Routing
// ============================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanChecker from './PlanChecker';
import HardwareDashboard from './HardwareDashboard';
import HardwareDirectory from './HardwareDirectory';
import RegisterShop from './RegisterShop';

const API_URL = 'https://veribuild-backend.onrender.com/api';
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

function App() {
  const [view, setView] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

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
  const [showCouncilOther, setShowCouncilOther] = useState(false);
  const [regCouncilOther, setRegCouncilOther] = useState('');
  const [regCouncilNotifyEmail, setRegCouncilNotifyEmail] = useState('');

  // Submission state
  const [newProject, setNewProject] = useState({
    project_name: '',
    project_address: '',
    council: '',
    land_size: '',
    usage_type: 'residential',
    declared_scale: '',
  });
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  // Submission Council Request
  const [subCouncilOther, setSubCouncilOther] = useState('');
  const [subCouncilNotifyEmail, setSubCouncilNotifyEmail] = useState('');

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

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
      // Redirect based on role
      if (user.role === 'hardware_shop') {
        setView('hardware');
      } else {
        setView('dashboard');
      }
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
      const finalCouncil = regCouncil === 'other' ? regCouncilOther : regCouncil;
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: regEmail,
        password: regPassword,
        full_name: regFullName,
        role: regRole,
        city: finalCouncil,
        registration_number: regRegNumber
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      // Redirect based on role
      if (user.role === 'hardware_shop') {
        setView('hardware');
      } else {
        setView('dashboard');
      }
      
      if (regCouncil === 'other' && regCouncilNotifyEmail) {
        console.log('Council request saved:', regCouncilOther, regCouncilNotifyEmail);
        alert('Registration successful! We will notify you when your council joins VeriBuild.');
      } else {
        alert('Registration successful!');
      }
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
  // FILE UPLOAD FUNCTIONS
  // ============================================

  const uploadFileToSupabase = async (file, fileName) => {
    try {
      const userId = user?.id || 'anonymous';
      const filePath = `submissions/${userId}/${Date.now()}_${fileName}`;
      
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/submissions/${filePath}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': file.type,
        },
        body: file,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/submissions/${filePath}`;
      setUploadStatus('Upload complete!');
      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed: ' + error.message);
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('File selected: ' + file.name);
      setUploadProgress(0);
    }
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
    if (!selectedFile) {
      alert('Please select a plan file to upload.');
      return;
    }
    setLoading(true);
    setUploadStatus('Uploading file...');
    try {
      const publicUrl = await uploadFileToSupabase(selectedFile, selectedFile.name);
      
      let finalCouncil = newProject.council;
      if (newProject.council === 'other') {
        finalCouncil = subCouncilOther || 'Unnamed Council';
      }
      
      await axios.post(`${API_URL}/submissions`, {
        project_name: newProject.project_name,
        project_address: newProject.project_address,
        city: finalCouncil,
        land_size: parseFloat(newProject.land_size),
        usage_type: newProject.usage_type,
        declared_scale: newProject.declared_scale,
        file_url: publicUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (newProject.council === 'other' && subCouncilNotifyEmail) {
        console.log('Council request saved for submission:', subCouncilOther, subCouncilNotifyEmail);
        alert('Plan submitted! We will notify you when your council joins VeriBuild.');
      } else {
        alert('Submission created successfully!');
      }
      
      setNewProject({
        project_name: '',
        project_address: '',
        council: '',
        land_size: '',
        usage_type: 'residential',
        declared_scale: '',
      });
      setSelectedFile(null);
      setUploadStatus('');
      setUploadProgress(0);
      setSubCouncilOther('');
      setSubCouncilNotifyEmail('');
      
      fetchSubmissions();
    } catch (error) {
      alert('Submission failed: ' + (error.response?.data?.detail || error.message || 'Unknown error'));
    }
    setLoading(false);
  };

  // ============================================
  // COUNCIL REVIEW FUNCTIONS
  // ============================================

  const openReviewModal = (submission) => {
    setSelectedSubmission(submission);
    setReviewComment('');
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedSubmission(null);
    setReviewComment('');
  };

  const updateSubmissionStatus = async (status) => {
    if (!selectedSubmission) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/submissions/${selectedSubmission.id}`, {
        status: status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (reviewComment) {
        console.log('Comment:', reviewComment);
      }
      
      alert(`Plan ${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Changes Requested'} successfully!`);
      closeReviewModal();
      fetchSubmissions();
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.detail || 'Unknown error'));
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
      // If we have a token but no user, fetch the user data
      if (!user) {
        // The user data should have been set during login/register
        // If not, we can try to fetch it
        setView('dashboard');
        fetchSubmissions();
      }
    }
    fetchLeaderboard();
  }, [token]);

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  // ---------- HOME PAGE ----------
  const renderHome = () => (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '42px', color: '#1A2B5E' }}>VeriBuild</h1>
      <p style={{ color: '#666' }}>AI-powered building approval platform</p>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        <button onClick={() => setView('login')} style={{ padding: '10px 35px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Login</button>
        <button onClick={() => setView('register')} style={{ padding: '10px 35px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Register as Architect</button>
        <button onClick={() => setView('register-shop')} style={{ padding: '10px 35px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Register as Hardware Shop</button>
      </div>
      
      <div style={{ backgroundColor: '#f0f4f8', padding: '40px', borderRadius: '12px', marginBottom: '20px' }}>
        <h2>Streamline Your Building Approvals</h2>
        <p>VeriBuild connects architects, councils, and hardware shops.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><h3>Digital Submissions</h3><p>Architects submit building plans digitally.</p></div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><h3>Rapid Approvals</h3><p>Councils review and approve in record time.</p></div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><h3>Hardware Marketplace</h3><p>Shops list products and get BOQ leads.</p></div>
      </div>
      <p style={{ color: '#999' }}>© 2026 VeriBuild. Built by Gatekeeper AI.</p>
    </div>
  );

  // ---------- LOGIN ----------
  const renderLogin = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1A2B5E' }}>Login to VeriBuild</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <span onClick={() => setView('register')} style={{ color: '#00A896', cursor: 'pointer', textDecoration: 'underline' }}>Register</span>
        <span onClick={() => alert('Password reset feature coming soon!')} style={{ color: '#1A2B5E', cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</span>
      </div>
      <button onClick={() => setView('home')} style={{ marginTop: '15px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>← Back to Home</button>
    </div>
  );

  // ---------- REGISTER AS ARCHITECT ----------
  const renderRegister = () => (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1A2B5E' }}>Register as Architect</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label><input type="text" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
        <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Email</label><input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
        <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Password</label><input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
          <select value={regRole} onChange={(e) => { setRegRole(e.target.value); if (e.target.value === 'council_officer') { setRegRegNumber(''); } }} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <option value="architect">Architect</option>
            <option value="council_officer">Council Officer</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Council</label>
          <select value={regCouncil} onChange={(e) => { setRegCouncil(e.target.value); setShowCouncilOther(e.target.value === 'other'); }} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required>
            <option value="">Select your council...</option>
            <option value="Harare City Council">Harare City Council</option>
            <option value="Bulawayo City Council">Bulawayo City Council</option>
            <option value="Mutare City Council">Mutare City Council</option>
            <option value="Gweru City Council">Gweru City Council</option>
            <option value="Kwekwe City Council">Kwekwe City Council</option>
            <option value="Masvingo City Council">Masvingo City Council</option>
            <option value="Marondera Municipality">Marondera Municipality</option>
            <option value="Chinhoyi Municipality">Chinhoyi Municipality</option>
            <option value="other">Other (Council not listed)</option>
          </select>
        </div>
        {showCouncilOther && (
          <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ffc107' }}>
            <p style={{ marginTop: 0, marginBottom: '10px', color: '#856404' }}><strong>Council not yet on VeriBuild?</strong> Enter the name below and we'll notify you when they join.</p>
            <div style={{ marginBottom: '10px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Council Name</label><input type="text" placeholder="e.g., Chitungwiza Municipality" value={regCouncilOther} onChange={(e) => setRegCouncilOther(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required={showCouncilOther} /></div>
            <div><label style={{ display: 'block', marginBottom: '5px' }}>Email for Notification</label><input type="email" placeholder="your@email.com" value={regCouncilNotifyEmail} onChange={(e) => setRegCouncilNotifyEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required={showCouncilOther} /><small style={{ color: '#666' }}>We'll email you when your council joins VeriBuild.</small></div>
          </div>
        )}
        {regRole === 'architect' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Architect Registration Number</label>
            <input type="text" placeholder="e.g., ARCH-2024-001" value={regRegNumber} onChange={(e) => setRegRegNumber(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
            <small style={{ color: '#666' }}>Your official registration number from the Architects Council.</small>
          </div>
        )}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>Already have an account? <span onClick={() => setView('login')} style={{ color: '#1A2B5E', cursor: 'pointer', textDecoration: 'underline' }}>Login here</span></p>
      <button onClick={() => setView('home')} style={{ marginTop: '15px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back to Home</button>
    </div>
  );

  // ---------- REVIEW MODAL ----------
  const renderReviewModal = () => {
    if (!showReviewModal || !selectedSubmission) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <h2 style={{ marginTop: 0, color: '#1A2B5E' }}>Review Submission</h2>
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Project:</strong> {selectedSubmission.project_name}</p>
            <p><strong>Architect ID:</strong> {selectedSubmission.architect_id}</p>
            <p><strong>Council:</strong> {selectedSubmission.city}</p>
            <p><strong>Status:</strong> <span style={{ color: selectedSubmission.status === 'approved' ? '#00A896' : '#f39c12' }}>{selectedSubmission.status.toUpperCase()}</span></p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Plan Document:</strong>
            {selectedSubmission.file_url ? (
              <a href={selectedSubmission.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '5px', color: '#1A2B5E' }}>View Plan PDF (opens in new tab)</a>
            ) : (
              <p>No file uploaded</p>
            )}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Comment / Reason</label>
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Add your review comments here..." style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', minHeight: '80px', fontFamily: 'Arial, sans-serif' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => updateSubmissionStatus('approved')} disabled={loading} style={{ padding: '10px 25px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1, minWidth: '120px' }}>Approve</button>
            <button onClick={() => updateSubmissionStatus('changes_required')} disabled={loading} style={{ padding: '10px 25px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1, minWidth: '120px' }}>Request Changes</button>
            <button onClick={() => updateSubmissionStatus('rejected')} disabled={loading} style={{ padding: '10px 25px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1, minWidth: '120px' }}>Reject</button>
            <button onClick={closeReviewModal} style={{ padding: '10px 25px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', flex: 1, minWidth: '120px' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // ---------- ARCHITECT DASHBOARD ----------
  const renderArchitectDashboard = () => {
    const total = submissions.length;
    const approved = submissions.filter(s => s.status === 'approved').length;
    const pending = submissions.filter(s => s.status === 'submitted' || s.status === 'under_review').length;
    const changes = submissions.filter(s => s.status === 'changes_required').length;
    const rejected = submissions.filter(s => s.status === 'rejected').length;
    const isCouncil = user?.role === 'council_officer';

    return (
      <div style={{ padding: '20px 30px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1A2B5E' }}>Welcome back, {user?.full_name}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>{isCouncil ? 'Council Officer' : 'Architect'} • {user?.city || 'Council not set'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '6px 15px', borderRadius: '20px', fontSize: '13px', color: '#1A2B5E' }}>Approved: {approved}</div>
            <button onClick={handleLogout} style={{ padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #1A2B5E' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Total Submissions</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#1A2B5E', fontSize: '28px' }}>{total}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #00A896' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Approved</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#00A896', fontSize: '28px' }}>{approved}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #f39c12' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Pending Review</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#f39c12', fontSize: '28px' }}>{pending}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #e74c3c' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Changes Required</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c', fontSize: '28px' }}>{changes}</h2>
          </div>
          {isCouncil && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #e74c3c' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Rejected</p>
              <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c', fontSize: '28px' }}>{rejected}</h2>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#475569' }}>Quick Actions:</span>
          <button onClick={() => alert('Plan Tracking: Real-time status of all submissions.')} style={{ padding: '6px 18px', backgroundColor: '#f1f5f9', color: '#1A2B5E', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>Plan Tracking</button>
          {!isCouncil && (
            <button onClick={() => alert('BOQ Service: Generate Bills of Quantities.')} style={{ padding: '6px 18px', backgroundColor: '#f1f5f9', color: '#1A2B5E', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>BOQ Services</button>
          )}
          <button onClick={() => alert('Support: Report an issue or request help.')} style={{ padding: '6px 18px', backgroundColor: '#f1f5f9', color: '#1A2B5E', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>Support</button>
          <button onClick={() => setView('planchecker')} style={{ padding: '6px 18px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>Plan Checker</button>
          <button onClick={() => setView('hardware')} style={{ padding: '6px 18px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>My Shop</button>
          <button onClick={() => setView('hardware-directory')} style={{ padding: '6px 18px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}>Shop Directory</button>
        </div>

        {isCouncil && (
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1A2B5E' }}>Review Queue</h2>
            </div>
            {submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <p style={{ fontSize: '16px', margin: 0 }}>No submissions to review.</p>
                <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>Once architects submit plans, they will appear here.</p>
              </div>
            ) : (
              submissions.map((sub) => {
                const submittedDate = new Date(sub.submitted_at);
                const now = new Date();
                const daysWaiting = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));
                const isUrgent = daysWaiting > 5;
                return (
                  <div key={sub.id} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', backgroundColor: isUrgent ? '#fef2f2' : 'transparent', borderRadius: isUrgent ? '8px' : '0', marginBottom: isUrgent ? '8px' : '0', paddingLeft: isUrgent ? '15px' : '0', borderLeft: isUrgent ? '4px solid #e74c3c' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: '#1A2B5E' }}>{sub.project_name}</h3>
                        {isUrgent && <span style={{ backgroundColor: '#e74c3c', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>URGENT</span>}
                        <span style={{ backgroundColor: sub.status === 'approved' ? '#e8f5e9' : sub.status === 'submitted' ? '#fff3e0' : sub.status === 'changes_required' ? '#fce4ec' : '#f0f0f0', color: sub.status === 'approved' ? '#00A896' : sub.status === 'submitted' ? '#f39c12' : sub.status === 'changes_required' ? '#e74c3c' : '#666', fontSize: '11px', padding: '2px 10px', borderRadius: '12px', fontWeight: 'bold' }}>{sub.status.toUpperCase()}</span>
                      </div>
                      <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>{sub.project_address} • {sub.city} <span style={{ marginLeft: '15px', fontSize: '12px', color: isUrgent ? '#e74c3c' : '#94a3b8' }}>{daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} in queue</span></p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button onClick={() => openReviewModal(sub)} style={{ padding: '6px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Review</button>
                      {sub.file_url && <a href={sub.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 15px', backgroundColor: '#f1f5f9', color: '#1A2B5E', border: 'none', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center' }}>PDF</a>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {!isCouncil && (
          <>
            <div style={{ backgroundColor: '#fff', padding: '25px', border: '1px solid #ddd', borderRadius: '12px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#1A2B5E' }}>New Submission</h2>
              <form onSubmit={createSubmission}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><input type="text" placeholder="Project Name" value={newProject.project_name} onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
                  <div><input type="text" placeholder="Project Address" value={newProject.project_address} onChange={(e) => setNewProject({ ...newProject, project_address: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
                  <div>
                    <select value={newProject.council} onChange={(e) => { setNewProject({ ...newProject, council: e.target.value }); if (e.target.value !== 'other') { setSubCouncilOther(''); setSubCouncilNotifyEmail(''); } }} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required>
                      <option value="">Select Council...</option>
                      <option value="Harare City Council">Harare City Council</option>
                      <option value="Bulawayo City Council">Bulawayo City Council</option>
                      <option value="Mutare City Council">Mutare City Council</option>
                      <option value="Gweru City Council">Gweru City Council</option>
                      <option value="Kwekwe City Council">Kwekwe City Council</option>
                      <option value="Masvingo City Council">Masvingo City Council</option>
                      <option value="other">Other (Council not listed)</option>
                    </select>
                  </div>
                  <div><input type="number" placeholder="Land Size (sqm)" value={newProject.land_size} onChange={(e) => setNewProject({ ...newProject, land_size: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
                  <div>
                    <select value={newProject.usage_type} onChange={(e) => setNewProject({ ...newProject, usage_type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div><input type="text" placeholder="Scale (e.g., 1:100)" value={newProject.declared_scale} onChange={(e) => setNewProject({ ...newProject, declared_scale: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required /></div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload Plan File (PDF or CAD)</label>
                  <input type="file" accept=".pdf,.dwg,.dxf" onChange={handleFileChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
                  {selectedFile && <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}><strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</div>}
                  {uploadStatus && <div style={{ marginTop: '5px', fontSize: '14px', color: uploadStatus.includes('failed') ? '#e74c3c' : '#00A896' }}>{uploadStatus}</div>}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: '5px', marginTop: '5px' }}>
                      <div style={{ width: `${uploadProgress}%`, backgroundColor: '#1A2B5E', height: '5px', borderRadius: '5px' }}></div>
                    </div>
                  )}
                </div>
                {newProject.council === 'other' && (
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ffc107' }}>
                    <p style={{ marginTop: 0, marginBottom: '10px', color: '#856404' }}><strong>Council not yet on VeriBuild?</strong> Submit your plan anyway. We'll notify you when they join.</p>
                    <div style={{ marginBottom: '10px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Council Name</label><input type="text" placeholder="e.g., Chitungwiza Municipality" value={subCouncilOther} onChange={(e) => setSubCouncilOther(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required={newProject.council === 'other'} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Email for Notification</label><input type="email" placeholder="your@email.com" value={subCouncilNotifyEmail} onChange={(e) => setSubCouncilNotifyEmail(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required={newProject.council === 'other'} /><small style={{ color: '#666' }}>We'll email you when your council joins VeriBuild.</small></div>
                  </div>
                )}
                <button type="submit" disabled={loading || !selectedFile} style={{ width: '100%', padding: '12px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: loading || !selectedFile ? 'not-allowed' : 'pointer', marginTop: '15px', opacity: loading || !selectedFile ? 0.6 : 1 }}>
                  {loading ? 'Submitting...' : 'Submit Plan'}
                </button>
              </form>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B5E' }}>My Submissions</h2>
                <button onClick={fetchSubmissions} style={{ padding: '8px 15px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Refresh</button>
              </div>
              {submissions.length === 0 ? (
                <p style={{ color: '#666' }}>No submissions yet. Submit your first plan!</p>
              ) : (
                submissions.map((sub) => (
                  <div key={sub.id} style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#1A2B5E' }}>{sub.project_name}</h3>
                      <p style={{ margin: '0', color: '#666' }}>{sub.project_address}, {sub.city}</p>
                      <p style={{ margin: '5px 0 0 0' }}><strong>Status:</strong> <span style={{ color: sub.status === 'approved' ? '#00A896' : sub.status === 'submitted' ? '#f39c12' : sub.status === 'changes_required' ? '#e74c3c' : '#666', marginLeft: '5px' }}>{sub.status.toUpperCase()}</span></p>
                      {sub.file_url && <a href={sub.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#1A2B5E' }}>View Plan PDF</a>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{new Date(sub.submitted_at).toLocaleDateString()}</p>
                      <button style={{ padding: '4px 12px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }} onClick={() => alert(`Plan #${sub.id}\nStatus: ${sub.status}\nSubmitted: ${new Date(sub.submitted_at).toLocaleString()}`)}>View Details</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        <button onClick={() => setView('home')} style={{ marginTop: '30px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back to Home</button>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div>
      {renderReviewModal()}
      {view === 'home' && renderHome()}
      {view === 'login' && renderLogin()}
      {view === 'register' && renderRegister()}
      {view === 'dashboard' && renderArchitectDashboard()}
      {view === 'planchecker' && <PlanChecker token={token} />}
      {view === 'hardware' && <HardwareDashboard token={token} />}
      {view === 'hardware-directory' && <HardwareDirectory />}
      {view === 'register-shop' && <RegisterShop setView={setView} setToken={setToken} setUser={setUser} />}
    </div>
  );
}

export default App;
