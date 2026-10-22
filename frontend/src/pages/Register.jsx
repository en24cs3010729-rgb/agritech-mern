import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    state: 'Punjab',
    district: '',
    village: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        location: {
          state: formData.state,
          district: formData.district,
          village: formData.village
        }
      };

      const user = await register(payload);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '560px' }}>
      <div className="agri-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success mx-auto mb-2">
            <UserPlus size={26} />
          </div>
          <h3 className="fw-bold text-dark">{t('register')}</h3>
          <p className="text-muted small">Create your digital smart farming account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Account Role</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleFarmer"
                  value="farmer"
                  checked={formData.role === 'farmer'}
                  onChange={handleChange}
                />
                <label className="form-check-label small fw-semibold" htmlFor="roleFarmer">
                  🌾 Farmer / Cultivator
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleAdmin"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                />
                <label className="form-check-label small fw-semibold" htmlFor="roleAdmin">
                  🛡️ Agronomist / Admin
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Ramesh Patel"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="row g-2 mb-4">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="Punjab"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">District</label>
              <input
                type="text"
                name="district"
                className="form-control"
                placeholder="Ludhiana"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Village / Area</label>
              <input
                type="text"
                name="village"
                className="form-control"
                placeholder="Raikot"
                value={formData.village}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-agri w-100 py-2"
            disabled={loading}
          >
            {loading ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4 text-muted small">
          Already registered?{' '}
          <Link to="/login" className="text-success fw-bold text-decoration-none">
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
