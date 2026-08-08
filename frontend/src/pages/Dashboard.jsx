import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token, refreshUser, API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  // State lists
  const [myJobs, setMyJobs] = useState([]); // Clients only
  const [escrows, setEscrows] = useState([]);
  const [myApplications, setMyApplications] = useState([]); // Freelancers only
  
  // Interactive job applications state (Client view)
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [jobApplications, setJobApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // General loading
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Escrow setup helper modal
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowTarget, setEscrowTarget] = useState(null); // { jobId, freelancerId, amount, appName }

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [token, user?.role]);

  const showNotification = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => {
      setMessage({ text: '', isError: false });
    }, 6000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Refresh user balance/profile
      await refreshUser();

      // 2. Fetch Escrow list
      const escrowRes = await fetch(`${API_URL}/escrow/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const escrowData = await escrowRes.json();
      if (escrowData.success) {
        setEscrows(escrowData.escrows);
      }

      // 3. Fetch role-specific details
      if (user?.role === 'client') {
        const jobsRes = await fetch(`${API_URL}/jobs/client/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const jobsData = await jobsRes.json();
        if (jobsData.success) {
          setMyJobs(jobsData.jobs);
        }
      } else if (user?.role === 'freelancer') {
        const appsRes = await fetch(`${API_URL}/jobs/freelancer/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appsData = await appsRes.json();
        if (appsData.success) {
          setMyApplications(appsData.applications);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard details:', error);
      showNotification('Could not load dashboard data. Check database server connection.', true);
    }
    setLoading(false);
  };

  // Fetch applications for a job (Client only)
  const handleViewApplications = async (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setLoadingApps(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setJobApplications(data.applications);
      } else {
        showNotification(data.message || 'Error loading job applications', true);
      }
    } catch (error) {
      showNotification('Network error loading applications.', true);
    }
    setLoadingApps(false);
  };

  // Accept/Reject application (Client only)
  const handleUpdateAppStatus = async (appId, status) => {
    try {
      const res = await fetch(`${API_URL}/jobs/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Application status successfully set to ${status}!`);
        
        // Refresh list of applications in view
        if (selectedJobId) {
          handleViewApplications(selectedJobId, selectedJobTitle);
        }
        // Refresh dashboard statistics
        fetchDashboardData();
      } else {
        showNotification(data.message || 'Error updating status', true);
      }
    } catch (error) {
      showNotification('Network error updating status.', true);
    }
  };

  // Trigger Escrow payment initialization (Client only)
  const handleInitiateEscrowSetup = (jobId, freelancerId, amount, appName) => {
    setEscrowTarget({ jobId, freelancerId, amount, appName });
    setShowEscrowModal(true);
  };

  const handleConfirmEscrowSetup = async () => {
    if (!escrowTarget) return;
    try {
      const res = await fetch(`${API_URL}/escrow/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: escrowTarget.jobId,
          freelancerId: escrowTarget.freelancerId,
          amount: escrowTarget.amount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Escrow created successfully! Milestone funds are now locked.');
        setShowEscrowModal(false);
        setEscrowTarget(null);
        setSelectedJobId(null); // Clear applicant tray
        fetchDashboardData();
      } else {
        showNotification(data.message || 'Could not fund escrow contract', true);
      }
    } catch (error) {
      showNotification('Connection error setup escrow.', true);
    }
  };

  // Release Escrow (Client only)
  const handleReleaseEscrow = async (escrowId) => {
    if (!window.confirm('Are you sure you want to release locked funds to the freelancer? This action is irreversible.')) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/escrow/${escrowId}/release`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Milestone funds released successfully to the freelancer!');
        fetchDashboardData();
      } else {
        showNotification(data.message || 'Error releasing funds', true);
      }
    } catch (error) {
      showNotification('Network error releasing funds.', true);
    }
  };

  // Refund Escrow (Client only)
  const handleRefundEscrow = async (escrowId) => {
    if (!window.confirm('Are you sure you want to request a refund? The locked escrow amount will be returned to your balance.')) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/escrow/${escrowId}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Funds successfully returned to your wallet balance!');
        fetchDashboardData();
      } else {
        showNotification(data.message || 'Error refunding funds', true);
      }
    } catch (error) {
      showNotification('Network error requesting refund.', true);
    }
  };

  if (loading) {
    return (
      <div className="obj-width extra-space" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Loading Dashboard details...</h2>
      </div>
    );
  }

  return (
    <div className="obj-width extra-space" style={{ paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>User Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Welcome back, {user?.firstName} {user?.lastName}!</p>

      {/* Global Toast Notification */}
      {message.text && (
        <div 
          style={{
            backgroundColor: message.isError ? '#f8d7da' : '#d4edda',
            color: message.isError ? '#721c24' : '#155724',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}
        >
          {message.text}
        </div>
      )}

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Side Column: Profile & Balance info */}
        <div>
          <div className="wallet-box">
            <h3>My Escrow Wallet</h3>
            <div className="balance">${user?.balance?.toFixed(2)}</div>
            <p>Role Account Type: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong></p>
            {user?.role === 'client' && (
              <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', marginTop: '10px' }}>
                Use balance to create Escrow Milestone contracts.
              </span>
            )}
          </div>

          <div className="dashboard-card">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>User Details</h3>
            <p><strong>First Name:</strong> {user?.firstName}</p>
            <p><strong>Last Name:</strong> {user?.lastName}</p>
            <p><strong>Email Address:</strong> {user?.email}</p>
          </div>
        </div>

        {/* Right Side Column: Table details based on Role */}
        <div>
          {/* CLIENT DASHBOARD */}
          {user?.role === 'client' && (
            <>
              {/* Jobs Posted Section */}
              <div className="dashboard-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>My Job Listings</h3>
                  <button className="btn-sm btn-primary" onClick={() => navigate('/create-job')}>Post New Job</button>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Milestone Budget</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myJobs.length > 0 ? (
                        myJobs.map((job) => (
                          <tr key={job._id}>
                            <td><strong>{job.title}</strong></td>
                            <td>${job.budget}</td>
                            <td>
                              <span className={`status-badge ${job.status}`}>
                                {job.status === 'open' ? 'Open (Hiring)' : job.status === 'in-progress' ? 'In Progress' : 'Completed'}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn-sm btn-primary" 
                                onClick={() => handleViewApplications(job._id, job.title)}
                              >
                                View Applicants
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>No jobs posted yet. Click 'Post New Job' to start hiring!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Applicant Review Tray */}
              {selectedJobId && (
                <div className="dashboard-card" style={{ borderColor: 'var(--primary-color)', borderLeft: '5px solid var(--primary-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Applicants for: <em>{selectedJobTitle}</em></h3>
                    <button className="btn-sm" style={{ background: '#ccc' }} onClick={() => setSelectedJobId(null)}>Close Tray</button>
                  </div>
                  
                  {loadingApps ? (
                    <p style={{ textAlign: 'center' }}>Loading applicants...</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="custom-table" style={{ marginTop: '1.5rem' }}>
                        <thead>
                          <tr>
                            <th>Freelancer</th>
                            <th>Bid Amount</th>
                            <th>Proposal Letter</th>
                            <th>Application Status</th>
                            <th>Decision Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobApplications.length > 0 ? (
                            jobApplications.map((app) => (
                              <tr key={app._id}>
                                <td><strong>{app.freelancer?.firstName} {app.freelancer?.lastName}</strong><br /><span style={{ fontSize: '0.8rem', color: '#666' }}>{app.freelancer?.email}</span></td>
                                <td>${app.bidAmount}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.coverLetter}>
                                  {app.coverLetter}
                                </td>
                                <td>
                                  <span className={`status-badge ${app.status}`}>
                                    {app.status}
                                  </span>
                                </td>
                                <td>
                                  {app.status === 'pending' && (
                                    <>
                                      <button 
                                        className="btn-sm btn-success" 
                                        onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                                      >
                                        Accept
                                      </button>
                                      <button 
                                        className="btn-sm btn-danger" 
                                        onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {app.status === 'accepted' && (
                                    <button 
                                      className="btn-sm btn-primary"
                                      onClick={() => handleInitiateEscrowSetup(selectedJobId, app.freelancer?._id, app.bidAmount, `${app.freelancer?.firstName} ${app.freelancer?.lastName}`)}
                                    >
                                      Setup Escrow
                                    </button>
                                  )}
                                  {app.status === 'rejected' && <span style={{ color: '#999', fontStyle: 'italic' }}>Closed</span>}
                                </td>
                              </tr>
                            ))

                          ) : (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center' }}>No applications received for this job yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Escrow Funded List */}
              <div className="dashboard-card">
                <h3 style={{ marginTop: 0 }}>My Active Escrows</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Link</th>
                        <th>Freelancer</th>
                        <th>Locked Funds</th>
                        <th>Escrow Status</th>
                        <th>Available Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {escrows.length > 0 ? (
                        escrows.map((esc) => (
                          <tr key={esc._id}>
                            <td><strong>{esc.job?.title}</strong></td>
                            <td>{esc.freelancer?.firstName} {esc.freelancer?.lastName}</td>
                            <td>${esc.amount}</td>
                            <td>
                              <span className={`status-badge ${esc.status}`}>
                                {esc.status}
                              </span>
                            </td>
                            <td>
                              {esc.status === 'locked' ? (
                                <>
                                  <button 
                                    className="btn-sm btn-success" 
                                    onClick={() => handleReleaseEscrow(esc._id)}
                                  >
                                    Release Funds
                                  </button>
                                  <button 
                                    className="btn-sm btn-danger" 
                                    onClick={() => handleRefundEscrow(esc._id)}
                                  >
                                    Request Refund
                                  </button>
                                </>
                              ) : (
                                <span style={{ color: '#999', fontStyle: 'italic', fontSize: '0.85rem' }}>Completed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center' }}>No active escrow payments found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* FREELANCER DASHBOARD */}
          {user?.role === 'freelancer' && (
            <>
              {/* Freelancer Applications Submitted */}
              <div className="dashboard-card">
                <h3 style={{ marginTop: 0 }}>My Submitted Applications</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Client</th>
                        <th>Bid Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myApplications.length > 0 ? (
                        myApplications.map((app) => (
                          <tr key={app._id}>
                            <td><strong>{app.job?.title}</strong></td>
                            <td>{app.job?.client?.firstName} {app.job?.client?.lastName}</td>
                            <td>${app.bidAmount}</td>
                            <td>
                              <span className={`status-badge ${app.status}`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>You haven't applied to any jobs yet. Check out the 'Find Jobs' page!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Escrow Earnings Pending/Completed */}
              <div className="dashboard-card">
                <h3 style={{ marginTop: 0 }}>My Escrow Payments</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Client Email</th>
                        <th>Escrow Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {escrows.length > 0 ? (
                        escrows.map((esc) => (
                          <tr key={esc._id}>
                            <td><strong>{esc.job?.title}</strong></td>
                            <td>{esc.client?.email}</td>
                            <td>${esc.amount}</td>
                            <td>
                              <span className={`status-badge ${esc.status}`}>
                                {esc.status}
                              </span>
                              {esc.status === 'locked' && (
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#856404', marginTop: '5px' }}>
                                  Locked in escrow vault (Pending release by client)
                                </span>
                              )}
                              {esc.status === 'released' && (
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#155724', marginTop: '5px' }}>
                                  Transferred to your wallet balance!
                                </span>
                              )}
                              {esc.status === 'refunded' && (
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#721c24', marginTop: '5px' }}>
                                  Returned to Client
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>No escrow payments set up for you yet. Once your application is accepted, the client can fund the escrow.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Setup Escrow Confirm Modal */}
      {showEscrowModal && escrowTarget && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Establish Escrow Contract</h2>
            <p>You are setting up an Escrow milestone contract for <strong>{escrowTarget.appName}</strong>.</p>
            <p style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #1e3c72' }}>
              <strong>Contract Details:</strong><br />
              - Freelancer Name: {escrowTarget.appName}<br />
              - Amount to Lock: ${escrowTarget.amount}<br />
              - Current Balance: ${user?.balance?.toFixed(2)}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#e00' }}>
              Warning: Confirming will immediately deduct <strong>${escrowTarget.amount}</strong> from your wallet balance and store it inside the secure locked vault.
            </p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-sm" 
                style={{ background: '#ccc', color: '#333' }}
                onClick={() => { setShowEscrowModal(false); setEscrowTarget(null); }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-sm btn-success"
                onClick={handleConfirmEscrowSetup}
              >
                Confirm & Lock Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
