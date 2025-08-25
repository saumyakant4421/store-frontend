import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/Signup.css';


function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user, ready } = useAuth();

  useEffect(() => {
    if (ready && user) {
      navigate('/');
    }
  }, [user, ready, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Match backend validation
    if (form.name.length < 20 || form.name.length > 60) {
      setError('Name must be 20-60 characters');
      return;
    }
    if (form.address.length > 400) {
      setError('Address must not exceed 400 characters');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(form.password)) {
      setError('Password must be 8-16 characters, include uppercase and special character');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Invalid email format');
      return;
    }
    try {
      await api.post('/auth/signup', form);
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      // Show backend validation errors if present
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setError(backendError || 'Signup failed');
    }
  };

  return (
    <div className="signup-outer">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        {error && <div className="signup-error">{error}</div>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="signup-input"
            placeholder="Name (20-60 chars)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="signup-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="signup-input"
            placeholder="Password (8-16 chars, uppercase, special char)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="text"
            className="signup-input"
            placeholder="Address (max 400 chars)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;