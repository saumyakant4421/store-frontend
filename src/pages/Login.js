import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/Login.css';


function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, logout, user, ready } = useAuth();

  useEffect(() => {
    if (ready && user) {
      navigate('/');
    }
  }, [user, ready, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleUpdatePassword = async () => {
    const currentPassword = prompt('Enter current password');
    const newPassword = prompt('Enter new password (8-16 chars, uppercase, special char)');
    if (!currentPassword || !newPassword || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/.test(newPassword)) {
      setError('Invalid password format');
      return;
    }
    try {
      await api.put('/auth/update-password', { currentPassword, newPassword });
      alert('Password updated');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="login-outer">
      <div className="login-box">
        <h2 className="login-title">Log In</h2>
        {error && <div className="login-error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div>
            <button type="submit" className="login-btn">Login</button>
            {user && <button type="button" className="login-btn" onClick={logout}>Logout</button>}
            {user && <button type="button" className="login-btn" onClick={handleUpdatePassword}>Update Password</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;