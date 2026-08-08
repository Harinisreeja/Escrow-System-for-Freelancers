import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="obj-width">
        <div className="top">
          <div>
            <img className="logo" src="https://dynamic.design.com/preview/logodraft/869ee20a-f5c7-46df-90c6-4fe725088b52/image/large.png" alt="Logo" style={{ height: '60px', width: 'auto' }} />
            <p>Search for your desired jobs.</p>
          </div>
          <div>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="bx bxl-facebook-square"></i></a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="bx bxl-instagram-alt"></i></a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer"><i className="bx bxl-twitter"></i></a>
            <a href="https://www.behance.net" target="_blank" rel="noreferrer"><i className="bx bxl-behance"></i></a>
          </div>
        </div>
        <div className="bottom">
          <div>
            <h3>Project</h3>
            <a href="#changelog">Changelog</a>
            <a href="#status">Status</a>
            <a href="#license">License</a>
            <a href="#versions">All Versions</a>
          </div>
          <div>
            <h3>Community</h3>
            <a href="https://github.com/Harinisreeja" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#issues">Issues</a>
            <a href="#projects">Project</a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          </div>
          <div>
            <h3>Help</h3>
            <a href="#support">Support</a>
            <a href="#troubleshooting">Troubleshooting</a>
            <a href="#contact">Contact us</a>
          </div>
          <div>
            <h3>Others</h3>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#license">License</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
