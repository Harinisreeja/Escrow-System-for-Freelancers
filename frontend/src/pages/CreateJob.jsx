import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [type, setType] = useState('freelancer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { user, token, API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (user && user.role !== 'client') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      setErrorMsg('Please enter a valid budget amount.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          budget: parseFloat(budget),
          type,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Job posted successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Error creating job listing');
      }
    } catch (error) {
      setErrorMsg('Connection error. Please try again.');
    }
  };

  return (
    <div className="obj-width extra-space">
      <div className="form-container">
        <h2>Post a New Job Opportunity</h2>
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="messageDiv" style={{ backgroundColor: 'hsl(348, 86%, 43%)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '1.5rem' }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="messageDiv" style={{ backgroundColor: 'hsl(140, 70%, 30%)', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '1.5rem' }}>
              {successMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input 
              type="text" 
              id="title" 
              placeholder="e.g. Senior React Developer, SEO Copywriter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Job Type / Duration</label>
            <select 
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="freelancer">Freelancer Contract</option>
              <option value="fullTime">Full Time Position</option>
              <option value="partTime">Part Time Position</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Escrow Budget ($)</label>
            <input 
              type="number" 
              id="budget" 
              placeholder="Enter milestone budget amount (USD)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required 
            />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Note: This amount will be locked in the escrow contract when you accept a freelancer.</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description & Requirements</label>
            <textarea 
              id="description" 
              rows="8" 
              placeholder="Provide a detailed description of the project deliverables, timeline, milestones, and candidate requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button type="submit" id="s-btn" style={{ border: 'none', width: '200px', cursor: 'pointer' }}>
              Publish Job Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
