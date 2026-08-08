import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs`);
        const data = await res.json();
        if (data.success) {
          // Get first 3 jobs
          setRecentJobs(data.jobs.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching jobs for homepage:', error);
      }
    };
    fetchRecentJobs();
  }, [API_URL]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-box obj-width">
          <div className="h-left" style={{ marginTop: '9rem' }}>
            <h1> Find the perfect <br /> freelancer platform for<br /> your Business</h1>
            <p>Work with talented people at the most affordable price to get <br /> the most out of your time and cost</p>
            <form className="search" onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="What are you looking for..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
          <div className="h-right" style={{ marginTop: '9rem' }}>
            <img src="https://www.shutterstock.com/image-photo/freelance-part-time-outsources-job-260nw-300532442.jpg" alt="Freelance working" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features sec-space obj-width">
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', margin: '0 0 1rem 0' }}>Need something to be done??</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Most viewed and all-time top-selling services</p>
        <div className="fe-box">
          <div className="fe-post">
            <img src="https://th.bing.com/th/id/OIP.OBKeHFtf-PXhy0AyTzfBRAHaHa?rs=1&pid=ImgDetMain" alt="Post Job" />
            <h3>Post a job</h3>
            <p>It's free and easy to post a job. Simply fill in the title, description, and budget.</p>
          </div>
          <div className="fe-post">
            <img src="https://th.bing.com/th/id/OIP.rPFOO73rx3rWwsWPrFMwegAAAA?rs=1&pid=ImgDetMain" alt="Freelancers" />
            <h3>Choose freelancers</h3>
            <p>Compare bids, portfolios, and reviews to hire the best person for your job.</p>
          </div>
          <div className="fe-post">
            <img src="https://png.pngtree.com/png-clipart/20220917/original/pngtree-lock-icon-png-image_8622086.png" alt="Lock payment" />
            <h3>Pay safely</h3>
            <p>Funds are held securely in our Escrow vault. Only release them when work is done.</p>
          </div>
          <div className="fe-post">
            <img src="https://th.bing.com/th/id/OIP.S4KPaUA8kwFfPwMYGJrhqQHaHI?rs=1&pid=ImgDetMain" alt="Support team" />
            <h3>Our team is here</h3>
            <p>Friendly support ready to assist you and mediate disputes if necessary.</p>
          </div>
        </div>
      </section>

      {/* Job Listing Section */}
      <section className="jobs sec-space obj-width">
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', margin: '0 0 1rem 0' }}>Demanding Jobs</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Explore recent active jobs from top clients</p>
        
        <div className="jobs-container">
          {recentJobs.length > 0 ? (
            recentJobs.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="jList">
                <img src="https://th.bing.com/th/id/OIP.uBYsSL7JDekYP3VpxWZvYQHaHa?rs=1&pid=ImgDetMain" alt="Web Developer icon" />
                <div>
                  <h3>{job.title}</h3>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>Posted by {job.client?.firstName}</span>
                </div>
                <p>${job.budget}</p>
                <span className="badge">{job.type === 'fullTime' ? 'Full Time' : job.type === 'partTime' ? 'Part Time' : 'Freelancer'}</span>
              </Link>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px' }}>
              <p>No active jobs found. Check back later!</p>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/jobs" id="s-btn">View All Jobs</Link>
        </div>
      </section>

      {/* Brand Section */}
      <section className="trust sec-space obj-width">
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', margin: '0 0 1rem 0' }}>Trusted by the global elite</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Powering secure transactions globally</p>
        <div className="t-box">
          <img src="https://www.shareicon.net/data/2015/11/11/670416_logo_512x512.png" alt="Brand Logo" />
          <img src="https://th.bing.com/th/id/OIP.pPiGKksHZwnStPGLIpKNpgHaHa?w=600&h=600&rs=1&pid=ImgDetMain" alt="Brand Logo" />
          <img src="https://vectorseek.com/wp-content/uploads/2023/04/Dropcam-Logo-Vector-730x730.jpg" alt="Brand Logo" />
          <img src="https://www.steritype.com/wp-content/uploads/logitech-416x416.png" alt="Brand Logo" />
          <img src="https://d1.awsstatic.com/customer-references-case-studies-logos/customer-pages_logos/WYNK-Music_Logo.478309649aa33e1c24fd858e76653245281ddb3b.png" alt="Brand Logo" />
        </div>
      </section>

      {/* Team Section */}
      <section className="team sec-space obj-width">
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', margin: '0 0 1rem 0' }}>Top-rated freelancers</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Highly professional experts ready to work</p>
        <div className="team-container">
          <div className="f1-box">
            <img src="https://th.bing.com/th/id/OIP.MNdZ1s39gp9NwgpIHjHqdAAAAA?w=204&h=176&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Robert Fox" />
            <h3>Robert Fox</h3>
            <div className="skill">
              <span>HTML</span>
              <span>CSS</span>
              <span>JS</span>
            </div>
            <Link to="/jobs" id="s-btn">View Jobs</Link>
          </div>
          <div className="f1-box">
            <img src="https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/bayzxsc51yyew43amjca" alt="Kristin Watson" />
            <h3>Kristin Watson</h3>
            <div className="skill">
              <span>HTML</span>
              <span>CSS</span>
              <span>JS</span>
            </div>
            <Link to="/jobs" id="s-btn">View Jobs</Link>
          </div>
          <div className="f1-box">
            <img src="https://th.bing.com/th?id=OIP.kG6Udnh8JVrwYBC4Pdt_OgAAAA&w=149&h=212&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="Darrell Steward" />
            <h3>Darrell Steward</h3>
            <div className="skill">
              <span>HTML</span>
              <span>CSS</span>
              <span>JS</span>
            </div>
            <Link to="/jobs" id="s-btn">View Jobs</Link>
          </div>
          <div className="f1-box">
            <img src="https://th.bing.com/th/id/OIP.UM7w2UDUT7JPVo0yn_3w0QAAAA?rs=1&pid=ImgDetMain" alt="Theresa Webb" />
            <h3>Theresa Webb</h3>
            <div className="skill">
              <span>HTML</span>
              <span>CSS</span>
              <span>JS</span>
            </div>
            <Link to="/jobs" id="s-btn">View Jobs</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
