import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanChecker from './PlanChecker';
import HardwareDashboard from './HardwareDashboard';
import HardwareDirectory from './HardwareDirectory';

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

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('architect');
  const [regCouncil, setRegCouncil] = useState('');
  const [regRegNumber, setRegRegNumber] = useState('');
  const [showCouncilOther, setShowCouncilOther] = useState(false);
  const [regCouncilOther, setRegCouncilOther] = useState('');
  const [regCouncilNotifyEmail, setRegCouncilNotifyEmail] = useState('');

  const [newProject, setNewProject] = useState({ project_name: '', project_address: '', council: '', land_size: '', usage_type: 'residential', declared_scale: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [subCouncilOther, setSubCouncilOther] = useState('');
  const [subCouncilNotifyEmail, setSubCouncilNotifyEmail] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  // --- AUTH ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email: loginEmail, password: loginPassword });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setView('dashboard');
      alert('Login successful!');
    } catch (error) { alert('Login failed'); }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalCouncil = regCouncil === 'other' ? regCouncilOther : regCouncil;
      const response = await axios.post(`${API_URL}/auth/register`, { email: regEmail, password: regPassword, full_name: regFullName, role: regRole, city: finalCouncil, registration_number: regRegNumber });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setView('dashboard');
      alert('Registration successful!');
    } catch (error) { alert('Registration failed'); }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setView('home');
  };

  // --- FILE UPLOAD ---
  const uploadFileToSupabase = async (file, fileName) => {
    try {
      const userId = user?.id || 'anonymous';
      const filePath = `submissions/${userId}/${Date.now()}_${fileName}`;
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/submissions/${filePath}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': file.type },
        body: file,
      });
      if (!response.ok) throw new Error(`Upload failed`);
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/submissions/${filePath}`;
      setUploadStatus('Upload complete!');
      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      setUploadStatus('Upload failed');
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setUploadStatus('File selected: ' + file.name); setUploadProgress(0); }
  };

  // --- SUBMISSIONS ---
  const fetchSubmissions = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/submissions`, { headers: { Authorization: `Bearer ${token}` } });
      setSubmissions(response.data.submissions || []);
    } catch (error) { console.error(error); }
  };

  const createSubmission = async (e) => {
    e.preventDefault();
    if (!token) { alert('Please login first'); return; }
    if (!selectedFile) { alert('Please select a plan file'); return; }
    setLoading(true);
    setUploadStatus('Uploading file...');
    try {
      const publicUrl = await uploadFileToSupabase(selectedFile, selectedFile.name);
      let finalCouncil = newProject.council === 'other' ? subCouncilOther || 'Unnamed Council' : newProject.council;
      await axios.post(`${API_URL}/submissions`, {
        project_name: newProject.project_name,
        project_address: newProject.project_address,
        city: finalCouncil,
        land_size: parseFloat(newProject.land_size),
        usage_type: newProject.usage_type,
        declared_scale: newProject.declared_scale,
        file_url: publicUrl
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Submission created successfully!');
      setNewProject({ project_name: '', project_address: '', council: '', land_size: '', usage_type: 'residential', declared_scale: '' });
      setSelectedFile(null);
      setUploadStatus('');
      setUploadProgress(0);
      fetchSubmissions();
    } catch (error) { alert('Submission failed'); }
    setLoading(false);
  };

  // --- COUNCIL REVIEW ---
  const openReviewModal = (submission) => { setSelectedSubmission(submission); setReviewComment(''); setShowReviewModal(true); };
  const closeReviewModal = () => { setShowReviewModal(false); setSelectedSubmission(null); setReviewComment(''); };

  const updateSubmissionStatus = async (status) => {
    if (!selectedSubmission) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/submissions/${selectedSubmission.id}`, { status: status }, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Plan ${status} successfully!`);
      closeReviewModal();
      fetchSubmissions();
    } catch (error) { alert('Update failed'); }
    setLoading(false);
  };

  // --- LEADERBOARD ---
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (token) { setView('dashboard'); fetchSubmissions(); }
    fetchLeaderboard();
  }, [token]);

  // --- RENDER FUNCTIONS (Simplified for length) ---
  const renderHome = () => (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '42px', color: '#1A2B5E' }}>VeriBuild</h1>
      <p style={{ color: '#666' }}>AI-powered building approval platform</p>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '20px 0' }}>
        <button onClick={() => setView('login')} style={{ padding: '10px 35px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Login</button>
        <button onClick={() => setView('register')} style={{ padding: '10px 35px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Register</button>
      </div>
      <div style={{ backgroundColor: '#f0f4f8', padding: '40px', borderRadius: '12px', marginBottom: '20px' }}>
        <h2>Streamline Your Building Approvals</h2>
        <p>VeriBuild connects architects, councils, and the public.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><h3>Digital Submissions</h3><p>Submit building plans digitally.</p></div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><h3>Rapid Approvals</h3><p>Councils review and approve in record time.</p></div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><h3>Transparent Leaderboard</h3><p>See top architects.</p></div>
      </div>
      <p>© 2026 VeriBuild. Built by Gatekeeper AI.</p>
    </div>
  );

  const renderLogin = () => (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required />
        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '8px' }}>Login</button>
      </form>
      <p>Don't have an account? <span onClick={() => setView('register')} style={{ color: '#00A896', cursor: 'pointer' }}>Register</span></p>
      <button onClick={() => setView('home')} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#eee', border: 'none' }}>Back</button>
    </div>
  );

  const renderRegister = () => (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required />
        <input type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required />
        <input type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required />
        <select value={regRole} onChange={(e) => setRegRole(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}>
          <option value="architect">Architect</option>
          <option value="council_officer">Council Officer</option>
        </select>
        <select value={regCouncil} onChange={(e) => setRegCouncil(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required>
          <option value="">Select your council...</option>
          <option value="Harare City Council">Harare</option>
          <option value="Bulawayo City Council">Bulawayo</option>
          <option value="other">Other</option>
        </select>
        {regRole === 'architect' && <input type="text" placeholder="Registration Number" value={regRegNumber} onChange={(e) => setRegRegNumber(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }} required />}
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '8px' }}>Register</button>
      </form>
      <button onClick={() => setView('home')} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#eee', border: 'none' }}>Back</button>
    </div>
  );

  const renderReviewModal = () => {
    if (!showReviewModal || !selectedSubmission) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '100%' }}>
          <h2>Review Submission</h2>
          <p><strong>Project:</strong> {selectedSubmission.project_name}</p>
          <p><strong>Status:</strong> {selectedSubmission.status}</p>
          <textarea placeholder="Comment..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', minHeight: '80px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => updateSubmissionStatus('approved')} style={{ padding: '10px 20px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '6px' }}>Approve</button>
            <button onClick={() => updateSubmissionStatus('changes_required')} style={{ padding: '10px 20px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px' }}>Request Changes</button>
            <button onClick={() => updateSubmissionStatus('rejected')} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px' }}>Reject</button>
            <button onClick={closeReviewModal} style={{ padding: '10px 20px', backgroundColor: '#eee', border: 'none', borderRadius: '6px' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!user) return <div style={{ textAlign: 'center', padding: '40px' }}><h2>Please log in</h2><button onClick={() => setView('login')} style={{ padding: '10px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none' }}>Go to Login</button></div>;
    const isCouncil = user.role === 'council_officer';
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div><h1>Welcome, {user.full_name}</h1><p>{user.city}</p></div>
          <button onClick={handleLogout} style={{ padding: '8px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px' }}>Logout</button>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button onClick={() => setView('planchecker')} style={{ padding: '8px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '20px' }}>Plan Checker</button>
          <button onClick={() => setView('hardware')} style={{ padding: '8px 20px', backgroundColor: '#00A896', color: 'white', border: 'none', borderRadius: '20px' }}>My Shop</button>
          <button onClick={() => setView('hardware-directory')} style={{ padding: '8px 20px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '20px' }}>Shop Directory</button>
        </div>
        {!isCouncil && (
          <div style={{ backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>New Submission</h2>
            <form onSubmit={createSubmission}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Project Name" value={newProject.project_name} onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
                <input type="text" placeholder="Address" value={newProject.project_address} onChange={(e) => setNewProject({ ...newProject, project_address: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
                <select value={newProject.council} onChange={(e) => setNewProject({ ...newProject, council: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required>
                  <option value="">Select Council</option>
                  <option value="Harare City Council">Harare</option>
                  <option value="Bulawayo City Council">Bulawayo</option>
                  <option value="other">Other</option>
                </select>
                <input type="number" placeholder="Land Size (sqm)" value={newProject.land_size} onChange={(e) => setNewProject({ ...newProject, land_size: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
                <select value={newProject.usage_type} onChange={(e) => setNewProject({ ...newProject, usage_type: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
                <input type="text" placeholder="Scale (e.g., 1:100)" value={newProject.declared_scale} onChange={(e) => setNewProject({ ...newProject, declared_scale: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
              </div>
              <input type="file" accept=".pdf,.dwg,.dxf" onChange={handleFileChange} style={{ margin: '10px 0', padding: '10px' }} required />
              <button type="submit" disabled={loading || !selectedFile} style={{ width: '100%', padding: '12px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '8px', opacity: loading || !selectedFile ? 0.6 : 1 }}>Submit Plan</button>
            </form>
          </div>
        )}
        {isCouncil && (
          <div>
            <h2>Review Queue</h2>
            {submissions.length === 0 ? <p>No submissions.</p> : submissions.map(sub => (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                <span>{sub.project_name} - {sub.status}</span>
                <button onClick={() => openReviewModal(sub)} style={{ padding: '5px 15px', backgroundColor: '#1A2B5E', color: 'white', border: 'none', borderRadius: '4px' }}>Review</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setView('home')} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#eee', border: 'none' }}>Back to Home</button>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div>
      {renderReviewModal()}
      {view === 'home' && renderHome()}
      {view === 'login' && renderLogin()}
      {view === 'register' && renderRegister()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'planchecker' && <PlanChecker token={token} />}
      {view === 'hardware' && <HardwareDashboard token={token} />}
      {view === 'hardware-directory' && <HardwareDirectory />}
    </div>
  );
}

export default App;
