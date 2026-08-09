// ============================================
// VERIBUILD - PLAN CHECKER COMPONENT
// Runs the Auto-Checker and displays results
// ============================================

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://veribuild-backend.onrender.com/api';

function PlanChecker({ token }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [buildingType, setBuildingType] = useState('residential');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runCheck = async () => {
    if (!pdfUrl) {
      alert('Please enter a PDF URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/auto-check`,
        {
          pdf_url: pdfUrl,
          building_type: buildingType
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1A2B5E', marginBottom: '20px' }}>
        🔍 Plan Auto-Checker
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Paste your plan URL to check against the Bulawayo Building By-laws.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          PDF URL
        </label>
        <input
          type="text"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          placeholder="https://example.com/plan.pdf"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Building Type
        </label>
        <select
          value={buildingType}
          onChange={(e) => setBuildingType(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <button
        onClick={runCheck}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#1A2B5E',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Checking...' : 'Run Auto-Check'}
      </button>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fce4ec', 
          borderRadius: '8px',
          color: '#e74c3c'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: result.overall_status === 'PASS' ? '#e8f5e9' :
                           result.overall_status === 'WARNINGS' ? '#fff3e0' : '#fce4ec',
            border: `1px solid ${
              result.overall_status === 'PASS' ? '#00A896' :
              result.overall_status === 'WARNINGS' ? '#f39c12' : '#e74c3c'
            }`,
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0 }}>
              Overall Status: <strong>{result.overall_status}</strong>
            </h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              {result.summary.critical_violations} critical violations, {result.summary.warnings} warnings
            </p>
          </div>

          {result.violations && result.violations.length > 0 && (
            <div>
              <h4 style={{ color: '#e74c3c' }}>Critical Violations</h4>
              {result.violations.map((v, i) => (
                <div key={i} style={{
                  padding: '10px',
                  backgroundColor: '#fce4ec',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #e74c3c'
                }}>
                  <strong>{v.rule_name}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                    Actual: {v.actual_value} {v.unit} | Required: {v.required_value} {v.unit}
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ color: '#f39c12' }}>Warnings</h4>
              {result.warnings.map((w, i) => (
                <div key={i} style={{
                  padding: '10px',
                  backgroundColor: '#fff3e0',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #f39c12'
                }}>
                  <strong>{w.rule_name}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                    Actual: {w.actual_value} {w.unit} | Required: {w.required_value} {w.unit}
                  </p>
                </div>
              ))}
            </div>
          )}

          {result.passed_checks && result.passed_checks.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ color: '#00A896' }}>Passed Checks</h4>
              {result.passed_checks.slice(0, 5).map((p, i) => (
                <div key={i} style={{
                  padding: '5px 10px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '3px',
                  marginBottom: '5px',
                  fontSize: '14px'
                }}>
                  ✅ {p.rule_name}: {p.actual_value} {p.unit}
                </div>
              ))}
              {result.passed_checks.length > 5 && (
                <p style={{ fontSize: '12px', color: '#666' }}>
                  + {result.passed_checks.length - 5} more passed checks
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlanChecker;
