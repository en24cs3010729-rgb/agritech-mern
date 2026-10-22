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
            <div className="hero-farm-card">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
                alt="Smart Agricultural Farm"
              />
              <div className="hero-farm-overlay text-start">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-white text-success fw-bold px-3 py-1 rounded-pill shadow-sm small">
                    🌾 Smart Precision Farm
                  </span>
                  <span className="badge bg-success bg-opacity-75 text-white border border-white border-opacity-50 small">
                    ● Live Telemetry
                  </span>
                </div>

                <div className="bg-dark bg-opacity-40 p-3 rounded-3 backdrop-blur border border-white border-opacity-25 text-white">
                  <div className="d-flex justify-content-between align-items-center small mb-1">
                    <span className="text-white-50">Crop Health Index</span>
                    <strong className="text-warning">98% Optimal</strong>
                  </div>
                  <div className="custom-progress mb-2" style={{ height: '6px' }}>
                    <div className="progress-bar bg-warning" style={{ width: '98%' }}></div>
                  </div>
                  <div className="small text-white-50">
                    📡 Multi-plot IoT Soil & Weather Monitoring Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill mb-2">
          ✨ Complete Smart Agriculture Ecosystem
        </span>
        <h2 className="fw-bold text-dark">Comprehensive Smart Farming Modules</h2>
        <p className="text-muted">High-precision digital tools engineered to maximize crop yield, eliminate pest damage, and support farmers</p>
      </div>

      <div className="row g-4 mb-5">
        {/* Module 1: Farm & Crop Monitoring */}
        <div className="col-md-6 col-lg-4">
          <div
            className="feature-card"
            style={{
              '--module-accent': '#16a34a',
              '--module-glow': 'rgba(34, 197, 94, 0.22)',
              '--module-icon-bg': 'rgba(34, 197, 94, 0.12)',
              '--module-shadow': 'rgba(22, 163, 74, 0.22)',
              '--module-border': 'rgba(34, 197, 94, 0.45)'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="feature-icon-box">
                  <Tractor size={28} />
                </div>
                <span className="feature-badge-pill">
                  🌾 Multi-Plot Track
                </span>
              </div>
              <h5 className="fw-bold text-dark mb-2">Farm & Crop Monitoring</h5>
              <p className="text-muted small mb-4">
                Track multi-plot acreage, soil classifications, and vegetative phenological stages from seed germination to harvest with yield forecasting.
              </p>
            </div>
            <div>
              <Link to={isAuthenticated ? "/crops" : "/login"} className="feature-card-cta">
                <span>Track Growth Stages</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Module 2: Soil Health & NPK Diagnostics */}
        <div className="col-md-6 col-lg-4">
          <div
            className="feature-card"
            style={{
              '--module-accent': '#d97706',
              '--module-glow': 'rgba(245, 158, 11, 0.24)',
              '--module-icon-bg': 'rgba(245, 158, 11, 0.12)',
              '--module-shadow': 'rgba(217, 119, 6, 0.22)',
              '--module-border': 'rgba(245, 158, 11, 0.45)'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="feature-icon-box">
                  <FlaskConical size={28} />
                </div>
                <span className="feature-badge-pill">
                  🧪 NPK Bio-Algorithm
                </span>
              </div>
              <h5 className="fw-bold text-dark mb-2">Soil Health & Diagnostics</h5>
              <p className="text-muted small mb-4">
                Input Nitrogen, Phosphorus, Potassium and pH levels to generate instant algorithmic fertilizer recommendations and crop suitability reports.
              </p>
            </div>
            <div>
              <Link to={isAuthenticated ? "/soil" : "/login"} className="feature-card-cta">
                <span>Diagnose Soil Health</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Module 3: Weather Forecast & Pest Defense */}
        <div className="col-md-6 col-lg-4">
          <div
            className="feature-card"
            style={{
              '--module-accent': '#dc2626',
              '--module-glow': 'rgba(239, 68, 68, 0.24)',
              '--module-icon-bg': 'rgba(239, 68, 68, 0.12)',
              '--module-shadow': 'rgba(220, 38, 38, 0.22)',
              '--module-border': 'rgba(239, 68, 68, 0.45)'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="feature-icon-box">
                  <Bug size={28} />
                </div>
                <span className="feature-badge-pill">
                  ⚠️ Early Warning
                </span>
              </div>
              <h5 className="fw-bold text-dark mb-2">Weather & Pest Defense</h5>
              <p className="text-muted small mb-4">
                Hyper-local 5-day weather advisories with early warnings for Fall Armyworm, Rust, and Aphids with organic Neem & bio-control solutions.
              </p>
            </div>
            <div>
              <Link to="/weather" className="feature-card-cta">
                <span>View Live Defense Radar</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Module 4: Agri-Resource Marketplace */}
        <div className="col-md-6 col-lg-4">
          <div
            className="feature-card"
            style={{
              '--module-accent': '#2563eb',
              '--module-glow': 'rgba(59, 130, 246, 0.24)',
              '--module-icon-bg': 'rgba(59, 130, 246, 0.12)',
              '--module-shadow': 'rgba(37, 99, 235, 0.22)',
              '--module-border': 'rgba(59, 130, 246, 0.45)'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="feature-icon-box">
                  <ShoppingBag size={28} />
                </div>
                <span className="feature-badge-pill">
                  🛍️ Kisan Store
                </span>
              </div>
              <h5 className="fw-bold text-dark mb-2">Agri-Resource Marketplace</h5>
              <p className="text-muted small mb-4">
                Direct access to certified hybrid seeds, organic vermicompost, solar drip systems, and bio-pesticides with doorstep delivery and Kisan Pay.
              </p>
            </div>
            <div>
              <Link to="/marketplace" className="feature-card-cta">
                <span>Browse Resource Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Module 5: Agronomist Consultation Forum */}
        <div className="col-md-6 col-lg-4">
          <div
            className="feature-card"
            style={{
              '--module-accent': '#0d9488',
              '--module-glow': 'rgba(20, 184, 166, 0.24)',
              '--module-icon-bg': 'rgba(20, 184, 166, 0.12)',
              '--module-shadow': 'rgba(13, 148, 136, 0.22)',
              '--module-border': 'rgba(20, 184, 166, 0.45)'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="feature-icon-box">
                  <Users size={28} />
                </div>
                <span className="feature-badge-pill">
                  🌱 Verified Advisory
                </span>
              </div>
              <h5 className="fw-bold text-dark mb-2">Expert Consultation Forum</h5>
              <p className="text-muted small mb-4">
                Post real farm queries, upload disease symptoms, and receive verified corrective advice directly from agricultural university agronomists.
              </p>
            </div>
            <div>
              <Link to="/forum" className="feature-card-cta">
                <span>Join Discussion Forum</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Module 6: Role-Based Security & Admin */}
        <div className="col-md-6 col-lg-4">
          <div
            className="feature-card"
            style={{
              '--module-accent': '#7c3aed',
              '--module-glow': 'rgba(139, 92, 246, 0.24)',
              '--module-icon-bg': 'rgba(139, 92, 246, 0.12)',
              '--module-shadow': 'rgba(124, 58, 237, 0.22)',
              '--module-border': 'rgba(139, 92, 246, 0.45)'
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="feature-icon-box">
                  <ShieldCheck size={28} />
                </div>
                <span className="feature-badge-pill">
                  🛡️ RBAC & JWT
                </span>
              </div>
              <h5 className="fw-bold text-dark mb-2">Role-Based Security & Admin</h5>
              <p className="text-muted small mb-4">
                Encrypted JWT sessions, bcrypt password hashing, and administrative dashboard for broadcasting emergency pest alerts and monitoring system health.
              </p>
            </div>
            <div>
              <Link to="/login" className="feature-card-cta">
                <span>Secure Authentication</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
