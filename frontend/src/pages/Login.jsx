import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await login(email, password);
      setSuccessMsg('Login is successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect Email or Password');
    }
  };

  return (
    <div 
      className="auth-page" 
      style={{
        backgroundImage: "url('https://i.pinimg.com/originals/a2/e7/0e/a2e70ee9920b35d55f9fc6d4b5af21aa.gif')",
      }}
    >
      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="messageDiv" style={{ backgroundColor: 'hsl(348, 86%, 43%)', opacity: 1 }}>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="messageDiv" style={{ backgroundColor: 'hsl(140, 70%, 30%)', opacity: 1 }}>
              {successMsg}
            </div>
          )}
          <h2>SIGN IN</h2>
          <input 
            className="form-control" 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            className="form-control" 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <p><a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a></p>
          <button type="submit" id="submitSignIn">
            Sign In
          </button>
          <p style={{ marginTop: '1.5rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'rgb(14, 56, 240)' }}>Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
