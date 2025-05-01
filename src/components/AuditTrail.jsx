import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { fetchAuditLogs } from '../utils/auditLogger';
import './AuditTrail.css';

const AuditTrail = () => {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const result = await fetchAuditLogs(50);
      setAuditLogs(result.items);
      setLoading(false);
    } catch (err) {
      setError('Failed to load audit logs');
      setLoading(false);
    }
  };

  if (loading) return <div className="audit-trail-container">Loading...</div>;
  if (error) return <div className="audit-trail-container">{error}</div>;

  return (
    <div className="audit-trail-container">
      <div className="audit-trail-header">
        <h1>Calculator Audit Trail</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Calculator
        </button>
      </div>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Action</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.eventId}>
              <td>{new Date(parseInt(log.timestamp) * 1000).toLocaleString()}</td>
              <td>{log.action}</td>
              <td>{log.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTrail;