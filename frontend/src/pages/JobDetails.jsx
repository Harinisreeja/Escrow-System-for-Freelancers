import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user, token, API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Application form fields
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs/${id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
          // Set default bid amount to job budget
          setBidAmount(data.job.budget);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
      setLoading(false);
    };

    fetchJobDetails();
  }, [id, API_URL]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      setSubmitError('Please enter a valid bid amount.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverLetter,
          bidAmount: parseFloat(bidAmount),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess('Application submitted successfully!');
        setCoverLetter('');
        setTimeout(() => {
          setShowApplyModal(false);
          setSubmitSuccess('');
          navigate('/dashboard');
        }, 1500);
      } else {
        setSubmitError(data.message || 'Error submitting application');
      }
    } catch (error) {
      setSubmitError('Server connection error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="obj-width extra-space" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Loading Job Details...</h2>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="obj-width extra-space" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Job Not Found</h2>
        <Link to="/jobs" id="s-btn" style={{ marginTop: '1.5rem' }}>Back to Jobs</Link>
      </div>
    );
  }

  return (
    <section className="job-details sec-space obj-width extra-space">
      <div className="job-header">
        <div className="job-img-row">
          <img src="https://th.bing.com/th/id/OIP.uBYsSL7JDekYP3VpxWZvYQHaHa?rs=1&pid=ImgDetMain" alt="Job Logo" />
          <div>
            <h1>{job.title}</h1>
            <p style={{ textTransform: 'capitalize' }}>
              {job.type === 'fullTime' ? 'Full Time' : job.type === 'partTime' ? 'Part Time' : 'Freelancer'} &middot; Posted by {job.client?.firstName} {job.client?.lastName}
            </p>
            <span>${job.budget}</span>
          </div>
        </div>

        {/* Action Button depending on Authentication State */}
        {user ? (
          user.role === 'freelancer' ? (
            <button onClick={() => setShowApplyModal(true)} id="s-btn" style={{ border: 'none', cursor: 'pointer' }}>
              Apply Now
            </button>
          ) : (
            <span style={{ fontSize: '1rem', color: '#666', fontStyle: 'italic' }}>
              You are logged in as a Client.
            </span>
          )
        ) : (
          <Link to="/login" id="s-btn">Log in to Apply</Link>
        )}
      </div>

      <div className="job-description">
        <h2>Job Description</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
        
        <h3>Job Details</h3>
        <ul>
          <li><strong>Role:</strong> {job.title}</li>
          <li><strong>Payment Type:</strong> Escrow Protected</li>
          <li><strong>Milestone Budget:</strong> ${job.budget}</li>
          <li><strong>Category:</strong> {job.type === 'fullTime' ? 'Full Time' : job.type === 'partTime' ? 'Part Time' : 'Freelancer'}</li>
        </ul>

        <h3>Escrow Protection Guarantee</h3>
        <p style={{ color: '#555', fontSize: '0.95rem' }}>
          This job is covered by our Escrow Payment protection. Once the client accepts your bid, they will deposit the contract amount in a secure milestone vault. Funds will only be released to your wallet upon your successful completion and submission of the deliverables.
        </p>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Apply for {job.title}</h2>
            <form onSubmit={handleApplySubmit}>
              {submitError && (
                <div className="messageDiv" style={{ backgroundColor: 'hsl(348, 86%, 43%)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '1rem' }}>
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="messageDiv" style={{ backgroundColor: 'hsl(140, 70%, 30%)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '1rem' }}>
                  {submitSuccess}
                </div>
              )}

              <div className="form-group">
                <label>Bid Amount ($)</label>
                <input 
                  type="number" 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  required
                />
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Client's budget is ${job.budget}</span>
              </div>

              <div className="form-group">
                <label>Cover Letter / Proposal</label>
                <textarea 
                  rows="6" 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you are the best fit for this project..."
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-sm" 
                  style={{ background: '#ccc', color: '#333' }}
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-sm btn-primary"
                  style={{ background: 'var(--btn-color)', color: 'white' }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default JobDetails;
