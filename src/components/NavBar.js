import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/NavBar.css';
import api from '../hooks/api';

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Go to the owner's dashboard if store exists
  const handleOwnerDashboard = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get('/store-owner/my-store');
      const storeId = res.data?.id;
      if (storeId) {
        navigate(`/store-owner/${storeId}`);
      } else {
        alert('No store found for your account.');
      }
    } catch {
      alert('Failed to fetch your store.');
    }
  };

  return (
    <nav className="navbar-dark">
      <div className="navbar-content">
        <Link to="/" className={location.pathname === '/' ? 'navbar-link active' : 'navbar-link'}>Stores</Link>
        {user?.role === 'System Administrator' && (
          <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'navbar-link active' : 'navbar-link'}>Admin Dashboard</Link>
        )}
        {user?.role === 'Store Owner' && (
          <a href="/store-owner" className={location.pathname.startsWith('/store-owner') ? 'navbar-link active' : 'navbar-link'} onClick={handleOwnerDashboard}>Owner Dashboard</a>
        )}
        {user && (
          <Link to="/profile" className={location.pathname.startsWith('/profile') ? 'navbar-link active' : 'navbar-link'}>Profile</Link>
        )}
        <div className="navbar-spacer" />
        {!user && (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'navbar-link active' : 'navbar-link'}>Login</Link>
            <Link to="/signup" className={location.pathname === '/signup' ? 'navbar-link active' : 'navbar-link'}>Signup</Link>
          </>
        )}
        {user && (
          <button className="navbar-link navbar-logout" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
