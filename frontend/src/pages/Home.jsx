import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  CloudSun,
  FlaskConical,
  Bug,
  ShoppingBag,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Tractor
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="hero-banner p-4 p-md-5 mb-5 shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-light text-success fw-bold px-3 py-2 rounded-pill mb-3">
              🌱 Next-Gen Smart Farming Platform
            </span>
            <h1 className="display-5 fw-extrabold text-white mb-3">
              {t('tagline')}
            </h1>
            <p className="lead text-white-50 mb-4" style={{ maxWidth: '640px' }}>
              Bridge the gap between traditional agricultural wisdom and modern digital tools. 
              Monitor crops in real time, analyze soil NPK balance, receive hyper-local weather alerts, 
              and consult agronomy experts — all in one accessible platform.
            </p>
            <div className="d-flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-light btn-lg text-success fw-bold px-4 py-2 rounded-pill d-flex align-items-center gap-2">
                  <Tractor size={20} />
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-warning btn-lg text-dark fw-bold px-4 py-2 rounded-pill d-flex align-items-center gap-2">
                    <span>Get Started Free</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill">
                    Sign In with Demo
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="col-lg-4 text-center d-none d-lg-block">
            <div className="bg-white bg-opacity-10 p-4 rounded-4 backdrop-blur border border-white border-opacity-25 text-start">
              <h6 className="text-warning fw-bold text-uppercase mb-2">⚡ Quick Evaluation Access</h6>
              <p className="small text-white-50 mb-3">
                Pre-configured mentor test accounts are ready for instant login:
              </p>
              <div className="bg-dark bg-opacity-50 p-2 rounded mb-2 small font-monospace text-white">
                <div>🌾 <strong>Farmer:</strong> farmer@agritech.com</div>
                <div>🔑 Pass: <code>farmer123</code></div>
              </div>
              <div className="bg-dark bg-opacity-50 p-2 rounded small font-monospace text-white">
                <div>🛡️ <strong>Admin:</strong> admin@agritech.com</div>
                <div>🔑 Pass: <code>admin123</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">Comprehensive Smart Farming Modules</h2>
        <p className="text-muted">Designed to optimize agricultural output and reduce pest losses</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="agri-card p-4 h-100">
            <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success mb-3">
              <Tractor size={26} />
            </div>
            <h5 className="fw-bold">Farm & Crop Monitoring</h5>
            <p className="text-muted small">
              Track multi-plot acreage, soil classifications, and vegetative growth stages from sowing to harvest with yield forecasting.
            </p>
            <Link to={isAuthenticated ? "/crops" : "/login"} className="text-success fw-bold text-decoration-none small d-flex align-items-center gap-1">
              <span>Track Growth Stages</span> &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-4 h-100">
            <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning mb-3">
              <FlaskConical size={26} />
            </div>
            <h5 className="fw-bold">Soil Health & NPK Diagnostics</h5>
            <p className="text-muted small">
              Input Nitrogen, Phosphorus, Potassium and pH levels to generate instant algorithmic fertilizer recommendations and crop suitability reports.
            </p>
            <Link to={isAuthenticated ? "/soil" : "/login"} className="text-success fw-bold text-decoration-none small d-flex align-items-center gap-1">
              <span>Test Soil Health</span> &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-4 h-100">
            <div className="stat-icon-wrapper bg-danger bg-opacity-10 text-danger mb-3">
              <Bug size={26} />
            </div>
            <h5 className="fw-bold">Weather Forecast & Pest Defense</h5>
            <p className="text-muted small">
              Hyper-local 5-day weather advisories with early warnings for Fall Armyworm, Rust, and Aphids with organic Neem & bio-control solutions.
            </p>
            <Link to="/weather" className="text-success fw-bold text-decoration-none small d-flex align-items-center gap-1">
              <span>View Active Alerts</span> &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-4 h-100">
            <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary mb-3">
              <ShoppingBag size={26} />
            </div>
            <h5 className="fw-bold">Agri-Resource Marketplace</h5>
            <p className="text-muted small">
              Direct access to certified hybrid seeds, organic vermicompost, solar drip systems, and bio-pesticides with doorstep delivery.
            </p>
            <Link to="/marketplace" className="text-success fw-bold text-decoration-none small d-flex align-items-center gap-1">
              <span>Browse Catalog</span> &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-4 h-100">
            <div className="stat-icon-wrapper bg-info bg-opacity-10 text-info mb-3">
              <Users size={26} />
            </div>
            <h5 className="fw-bold">Agronomist Consultation Forum</h5>
            <p className="text-muted small">
              Post real farm queries, upload disease descriptions, and receive verified recommendations from agricultural university agronomists.
            </p>
            <Link to="/forum" className="text-success fw-bold text-decoration-none small d-flex align-items-center gap-1">
              <span>Join Discussion</span> &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="agri-card p-4 h-100">
            <div className="stat-icon-wrapper bg-secondary bg-opacity-10 text-secondary mb-3">
              <ShieldCheck size={26} />
            </div>
            <h5 className="fw-bold">Role-Based Security & Admin</h5>
            <p className="text-muted resource small">
              Encrypted JWT sessions, bcrypt password hashing, and administrative dashboard for moderating advisories and monitoring system health.
            </p>
            <Link to="/login" className="text-success fw-bold text-decoration-none small d-flex align-items-center gap-1">
              <span>Secure Authentication</span> &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
