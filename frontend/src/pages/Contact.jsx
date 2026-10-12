import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { API_URL } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Message submitted successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMsg(data.message || 'Error submitting message.');
      }
    } catch (error) {
      setErrorMsg('Connection error. Please try again later.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      {/* Contact Section */}
      <section className="contact obj-width sec-space extra-space">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions or feedback? Reach out to us—we'd love to hear from you!</p>
            <img src="/contact-support.svg" alt="Customer support representative" />
          </div>
          <div className="contact-form-card">
            <form id="contact-form" onSubmit={handleSubmit}>
              {successMsg && (
                <div className="form-message form-message-success">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="form-message form-message-error">
                  {errorMsg}
                </div>
              )}
              
              <label htmlFor="name">Name</label>
              <input 
                className="form-control" 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
              
              <label htmlFor="email">Email</label>
              <input 
                className="form-control" 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <label htmlFor="message">Message</label>
              <textarea 
                className="form-control" 
                id="message" 
                rows="5" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              
              <button 
                type="submit" 
                id="s-btn" 
                className="contact-submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact obj-width sec-space">
        <iframe 
          title="Google Map Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30773369.302625544!2d61.02926000290346!3d19.690694758878713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1735929301041!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
