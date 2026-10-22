import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, User, ShieldAlert, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '480px' }}>
      <div className="agri-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success mx-auto mb-2">
            <LogIn size={26} />
          </div>
          <h3 className="fw-bold text-dark">{t('login')}</h3>
          <p className="text-muted small">Sign in to your AgriTech farming portal</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* One Click Demo Credentials */}
        <div className="bg-light p-3 rounded-3 mb-4 border">
          <div className="small fw-bold text-muted text-uppercase mb-2">⚡ Quick 1-Click Demo Login:</div>
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-success text-start d-flex align-items-center justify-content-between"
              onClick={() => fillDemo('farmer@agritech.com', 'farmer123')}
            >
              <span>🌾 <strong>Farmer Account</strong> (Ramesh Patel)</span>
              <span className="badge bg-success">Fill</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger text-start d-flex align-items-center justify-content-between"
              onClick={() => fillDemo('admin@agritech.com', 'admin123')}
            >
              <span>🛡️ <strong>Admin Account</strong> (Dr. Sunita)</span>
              <span className="badge bg-danger">Fill</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. farmer@agritech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-agri w-100 py-2"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : t('login')}
          </button>
        </form>

        <div className="text-center mt-4 text-muted small">
          Don't have an account?{' '}
          <Link to="/register" className="text-success fw-bold text-decoration-none">
            {t('register')}
          </Link>
        </div>
      </div>
    </div>
  );
}
