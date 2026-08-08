import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('freelancer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    try {
      await register(firstName, lastName, email, password, role);
      setSuccessMsg('Account Created Successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to create user. Please try again.');
    }
  };

  return (
    <div 
      className="auth-page" 
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/1631678/pexels-photo-1631678.jpeg?cs=srgb&dl=pexels-abdghat-1631678.jpg&fm=jpg')",
        marginTop: '100px',
        padding: '3rem 1rem'
      }}
    >
      <div className="auth-card" style={{ maxWidth: '450px', background: 'rgba(255, 255, 255, 0.95)' }}>
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="messageDiv" style={{ backgroundColor: 'hsl(348, 86%, 43%)' }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="messageDiv" style={{ backgroundColor: 'hsl(140, 70%, 30%)' }}>
              {successMsg}
            </div>
          )}
          <h2 style={{ color: '#5732ee' }}>SIGN UP</h2>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>I want to sign up as a:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '1px solid #ccc',
                borderRadius: '10px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="freelancer">Freelancer (Look for work & earn)</option>
              <option value="client">Client (Hire freelancers & pay)</option>
            </select>
          </div>

          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" id="submitSignUp" style={{ marginTop: '1rem' }}>
            Sign Up
          </button>
          
          <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: 'rgb(14, 56, 240)' }}>Sign In</Link>
          </p>

          <hr />
          <b><u>Other options</u></b><br /><br />
          <input 
            style={{ height: '35px', width: '100%', textAlign: 'center', backgroundColor: 'transparent', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer' }} 
            type="button" 
            value="Continue with Google" 
            onClick={() => alert('OAuth features are simulated. Please use standard email registration.')}
          />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
