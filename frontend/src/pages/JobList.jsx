import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const JobList = () => {
  const { API_URL } = useContext(AuthContext);
  const location = useLocation();

  // Get search param from URL if navigated from home page
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch jobs function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/jobs?type=${type}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs list:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [type, API_URL]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <section className="jobs sec-space obj-width extra-space">
      <h1>Find Your Dream Job</h1>
      <p style={{ color: '#666' }}>Explore thousands of job opportunities tailored for freelancers.</p>

      {/* Search bar */}
      <form className="jobs-form" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search jobs..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Job filters */}
      <ul className="job-id" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <li 
          onClick={() => setType('all')} 
          className={type === 'all' ? 'active' : ''}
        >
          All Jobs
        </li>
        <li 
          onClick={() => setType('freelancer')} 
          className={type === 'freelancer' ? 'active' : ''}
        >
          Freelancer
        </li>
        <li 
          onClick={() => setType('fullTime')} 
          className={type === 'fullTime' ? 'active' : ''}
        >
          Full Time
        </li>
        <li 
          onClick={() => setType('partTime')} 
          className={type === 'partTime' ? 'active' : ''}
        >
          Part Time
        </li>
      </ul>

      {/* Job listings */}
      <div className="jobs-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="jList">
              <img src="https://th.bing.com/th/id/OIP.uBYsSL7JDekYP3VpxWZvYQHaHa?rs=1&pid=ImgDetMain" alt="Job icon" />
              <div>
                <h3>{job.title}</h3>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'normal', color: '#666', fontSize: '0.9rem' }}>
                  Posted by {job.client?.firstName} {job.client?.lastName}
                </p>
              </div>
              <p>${job.budget}</p>
              <span className="badge">{job.type === 'fullTime' ? 'Full Time' : job.type === 'partTime' ? 'Part Time' : 'Freelancer'}</span>
            </Link>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3>No jobs found</h3>
            <p>Try resetting the category filter or searching for another keyword.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobList;
