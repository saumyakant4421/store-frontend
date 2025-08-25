import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../hooks/api';
import '../styles/storeOwner.css';

function StoreOwnerDashboard() {
  const { storeId } = useParams();
  const [data, setData] = useState({ ratings: [], average: 0 });
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  const canView = user && (user.role === 'Store Owner' || user.role === 'System Administrator');

  useEffect(() => {
    if (canView) {
      api
        .get(`/store-owner/dashboard/${storeId}`)
        .then((response) => setData(response.data))
        .catch((err) => {
          if (err.response?.status === 403) {
            setError('Access Denied: You do not own this store');
          } else if (err.response?.status === 404) {
            setError('Store not found');
          } else {
            setError('Failed to load dashboard');
          }
        });
    }
  }, [storeId, canView]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwSuccess('');
    setError('');
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/.test(password)) {
      setError('Password must be 8-16 chars, include uppercase and special char');
      return;
    }
    try {
      await api.post('/auth/update-password', { password });
      setPwSuccess('Password updated successfully!');
      setPassword('');
    } catch {
      setError('Failed to update password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!ready) return <div className="store-owner-container"><h4>Loading...</h4></div>;
  if (!canView) return <div className="store-owner-container"><h2>Access Denied</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#18181b', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 64 }}>
      <div className="store-owner-container" style={{ width: '100%', maxWidth: 540, background: '#23232b', borderRadius: 16, boxShadow: '0 2px 16px #000a', padding: '2.5rem 2rem 2rem 2rem', margin: '0 auto' }}>
        <h2 className="store-owner-title" style={{ color: '#fff', textAlign: 'center', marginBottom: 32 }}>Store Owner Dashboard</h2>
        {error && <div className="store-owner-alert">{error}</div>}
        {pwSuccess && <div className="store-owner-alert" style={{ color: '#4ade80' }}>{pwSuccess}</div>}
        <div className="store-owner-average" style={{ textAlign: 'center', fontSize: '1.3rem', color: '#ffd700', marginBottom: 24 }}>Average Rating: {Number(data.average).toFixed(2)}</div>
        <div style={{ background: '#23272a', borderRadius: 10, padding: '1.5rem 1rem', marginBottom: 24 }}>
          <h5 style={{ color: '#f4f4f5', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>Users who rated your store</h5>
          <ul className="store-owner-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.ratings.length === 0 && <li className="store-owner-list-item" style={{ textAlign: 'center', color: '#888' }}>No ratings yet.</li>}
            {data.ratings.map((rating) => (
              <li key={rating.id} className="store-owner-list-item" style={{ borderBottom: '1px solid #333', padding: '0.75rem 0', color: '#f1f1f1' }}>
                <span style={{ fontWeight: 500 }}>{rating.User?.name || 'Unknown User'}</span>: <span style={{ color: '#ffd700', fontWeight: 600 }}>{rating.rating}</span>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleUpdatePassword} style={{ marginTop: 8, marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="update-password" style={{ color: '#f1f1f1', marginBottom: 8, fontWeight: 500 }}>Update Password</label>
          <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 340 }}>
            <input
              id="update-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="New password"
              style={{ flex: 1, background: '#18181b', color: '#f1f1f1', border: '1px solid #333', borderRadius: 6, padding: '8px 12px' }}
            />
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 500 }}>Update</button>
          </div>
        </form>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 32px', marginTop: 8, cursor: 'pointer', fontWeight: 500 }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;
