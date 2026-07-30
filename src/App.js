// ============================================
// DASHBOARD (IMPROVED - 10/10 VERSION)
// ============================================

const renderDashboard = () => {
  if (!user) {
    return <p>Please login first.</p>;
  }

  const isCouncil = user.role === 'council_officer';
  // Calculate stats for the officer
  const total = submissions.length;
  const approved = submissions.filter(s => s.status === 'approved').length;
  const pending = submissions.filter(s => s.status === 'submitted' || s.status === 'under_review').length;
  const changes = submissions.filter(s => s.status === 'changes_required').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* ==========================================
          HEADER
      ========================================== */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px',
        backgroundColor: '#fff',
        padding: '15px 25px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1A2B5E' }}>
            Welcome back, {user.full_name}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            {isCouncil ? 'Council Officer' : 'Architect'} • {user.city || 'Council not set'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Gamification Badge */}
          <div style={{ 
            backgroundColor: '#f1f5f9', 
            padding: '6px 15px', 
            borderRadius: '20px',
            fontSize: '13px',
            color: '#1A2B5E'
          }}>
            ⭐ {approved} Plans Approved
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ==========================================
          STATS CARDS
      ========================================== */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px'
      }}>
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
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid '#e74c3c'' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Rejected</p>
            <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c', fontSize: '28px' }}>{rejected}</h2>
          </div>
        )}
      </div>

      {/* ==========================================
          SERVICES BAR (Cleaner UI)
      ========================================== */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        marginBottom: '30px',
        backgroundColor: '#fff',
        padding: '12px 20px',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#475569' }}>Quick Actions:</span>
        <button 
          onClick={() => alert('Plan Tracking: Real-time status of all submissions.')}
          style={{
            padding: '6px 18px',
            backgroundColor: '#f1f5f9',
            color: '#1A2B5E',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          📊 Plan Tracking
        </button>
        {!isCouncil && (
          <button 
            onClick={() => alert('BOQ Service: Generate Bills of Quantities.')}
            style={{
              padding: '6px 18px',
              backgroundColor: '#f1f5f9',
              color: '#1A2B5E',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            📋 BOQ Services
          </button>
        )}
        <button 
          onClick={() => alert('Support: Report an issue or request help.')}
          style={{
            padding: '6px 18px',
            backgroundColor: '#f1f5f9',
            color: '#1A2B5E',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          🆘 Support
        </button>
      </div>

      {/* ==========================================
          COUNCIL QUEUE (The "Wow" Improvement)
      ========================================== */}
      {isCouncil && (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '25px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1A2B5E' }}>Review Queue</h2>
            {/* Departmental Tabs (Future Feature) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', padding: '5px 15px', borderRadius: '20px' }}>🏛️ All</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>|</span>
              <span style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>Water</span>
              <span style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>Planning</span>
              <span style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>Fire</span>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <p style={{ fontSize: '16px', margin: 0 }}>📭 No submissions to review.</p>
              <p style={{ fontSize: '14px', margin: '5px 0 0 0' }}>Once architects submit plans, they will appear here.</p>
            </div>
          ) : (
            submissions.map((sub) => {
              // Calculate days waiting
              const submittedDate = new Date(sub.submitted_at);
              const now = new Date();
              const daysWaiting = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));
              const isUrgent = daysWaiting > 5;

              return (
                <div key={sub.id} style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  backgroundColor: isUrgent ? '#fef2f2' : 'transparent',
                  borderRadius: isUrgent ? '8px' : '0',
                  marginBottom: isUrgent ? '8px' : '0',
                  paddingLeft: isUrgent ? '15px' : '0',
                  borderLeft: isUrgent ? '4px solid #e74c3c' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: '#1A2B5E' }}>{sub.project_name}</h3>
                      {isUrgent && (
                        <span style={{ 
                          backgroundColor: '#e74c3c', 
                          color: 'white', 
                          fontSize: '10px', 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ URGENT
                        </span>
                      )}
                      <span style={{ 
                        backgroundColor: sub.status === 'approved' ? '#e8f5e9' : 
                                       sub.status === 'submitted' ? '#fff3e0' : 
                                       sub.status === 'changes_required' ? '#fce4ec' : '#f0f0f0',
                        color: sub.status === 'approved' ? '#00A896' : 
                               sub.status === 'submitted' ? '#f39c12' : 
                               sub.status === 'changes_required' ? '#e74c3c' : '#666',
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                      {sub.project_address} • {sub.city} 
                      <span style={{ marginLeft: '15px', fontSize: '12px', color: isUrgent ? '#e74c3c' : '#94a3b8' }}>
                        ⏳ {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} in queue
                      </span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => openReviewModal(sub)}
                      style={{
                        padding: '6px 20px',
                        backgroundColor: '#1A2B5E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: '0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2a3b6e'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#1A2B5E'}
                    >
                      🔍 Review
                    </button>
                    {sub.file_url && (
                      <a 
                        href={sub.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 15px',
                          backgroundColor: '#f1f5f9',
                          color: '#1A2B5E',
                          border: 'none',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        📄 PDF
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==========================================
          ARCHITECT DASHBOARD (Unchanged)
      ========================================== */}
      {!isCouncil && (
        <>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '25px', 
            border: '1px solid #ddd', 
            borderRadius: '12px', 
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
                    onChange={(e) => {
                      setNewProject({ ...newProject, council: e.target.value });
                      if (e.target.value !== 'other') {
                        setSubCouncilOther('');
                        setSubCouncilNotifyEmail('');
                      }
                    }}
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
                    <option value="other">Other (Council not listed)</option>
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
              
              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Upload Plan File (PDF or CAD)
                </label>
                <input
                  type="file"
                  accept=".pdf,.dwg,.dxf"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  required
                />
                {selectedFile && (
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
                {uploadStatus && (
                  <div style={{ marginTop: '5px', fontSize: '14px', color: uploadStatus.includes('failed') ? '#e74c3c' : '#00A896' }}>
                    {uploadStatus}
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: '5px', marginTop: '5px' }}>
                    <div style={{ width: `${uploadProgress}%`, backgroundColor: '#1A2B5E', height: '5px', borderRadius: '5px' }}></div>
                  </div>
                )}
              </div>

              {newProject.council === 'other' && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #ffc107'
                }}>
                  <p style={{ marginTop: 0, marginBottom: '10px', color: '#856404' }}>
                    <strong>Council not yet on VeriBuild?</strong> 
                    Submit your plan anyway. We'll notify you when they join.
                  </p>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Council Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Chitungwiza Municipality"
                      value={subCouncilOther}
                      onChange={(e) => setSubCouncilOther(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                      required={newProject.council === 'other'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email for Notification</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={subCouncilNotifyEmail}
                      onChange={(e) => setSubCouncilNotifyEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                      required={newProject.council === 'other'}
                    />
                    <small style={{ color: '#666' }}>We'll email you when your council joins VeriBuild.</small>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedFile}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1A2B5E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: loading || !selectedFile ? 'not-allowed' : 'pointer',
                  marginTop: '15px',
                  opacity: loading || !selectedFile ? 0.6 : 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit Plan'}
              </button>
            </form>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A2B5E' }}>
                My Submissions
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
                  alignItems: 'center',
                  flexWrap: 'wrap'
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
                    {sub.file_url && (
                      <a 
                        href={sub.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#1A2B5E' }}
                      >
                        View Plan PDF
                      </a>
                    )}
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
        </>
      )}

      <button
        onClick={() => setView('home')}
        style={{ marginTop: '30px', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        ← Back to Home
      </button>
    </div>
  );
};
