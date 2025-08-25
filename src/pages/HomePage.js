
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  return (
    <div className="homepage-outer">
      <div className="homepage-box">
        <h1 className="homepage-title">Welcome to Store Rating App</h1>
        <p className="homepage-desc">Discover, rate, and review stores. Sign up to start sharing your experiences or log in to manage your ratings and stores.</p>
        <div className="homepage-btn-row">
          <button className="homepage-btn" onClick={() => navigate('/stores')}>Browse Stores</button>
          {!user && ready && (
            <>
              <button className="homepage-btn" onClick={() => navigate('/signup')}>Sign Up</button>
              <button className="homepage-btn" onClick={() => navigate('/login')}>Log In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
