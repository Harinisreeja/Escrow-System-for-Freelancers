import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header id="head">
      <div id="navbar" class="obj-width">
        <Link to="/" class="logo">
          <img src="https://dynamic.design.com/preview/logodraft/869ee20a-f5c7-46df-90c6-4fe725088b52/image/large.png" alt="Logo" />
        </Link>
        <ul id="menu" className={menuActive ? 'active' : ''}>
          <li><Link to="/" onClick={() => setMenuActive(false)}>Home</Link></li>
          <li><Link to="/jobs" onClick={() => setMenuActive(false)}>Find jobs</Link></li>
          <li><Link to="/contact" onClick={() => setMenuActive(false)}>Contact</Link></li>
          
          {user && (
            <>
              <li><Link to="/dashboard" onClick={() => setMenuActive(false)}>Dashboard</Link></li>
              {user.role === 'client' && (
                <li><Link to="/create-job" onClick={() => setMenuActive(false)}>Post Job</Link></li>
              )}
            </>
          )}

          {user ? (
            <button id="btn" onClick={handleLogout} style={{ border: 'none', cursor: 'pointer' }}>
              Logout ({user.firstName})
            </button>
          ) : (
            <Link to="/login" id="btn" style={{ textDecoration: 'none' }}>
              Login
            </Link>
          )}
        </ul>
        <i id="bar" className="bx bx-menu" onClick={toggleMenu}></i>
      </div>
    </header>
  );
};

export default Navbar;
