import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sprout,
  LayoutDashboard,
  Tractor,
  Leaf,
  FlaskConical,
  CloudSunRain,
  ShoppingBag,
  MessageSquare,
  ShieldAlert,
  LogOut,
  LogIn,
  ShoppingCart,
  Globe,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, cart } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { themeSetting, setThemeSetting, activeTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg agri-navbar sticky-top py-2">
      <div className="container">
        <Link to="/" className="agri-brand me-4">
          <Sprout size={30} className="text-success" />
          <span>{t('brand')}</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agriNavbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="agriNavbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                {t('home')}
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    {t('dashboard')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/farms"
                    className={`nav-link ${location.pathname === '/farms' ? 'active' : ''}`}
                  >
                    {t('farms')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/crops"
                    className={`nav-link ${location.pathname === '/crops' ? 'active' : ''}`}
                  >
                    {t('crops')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/soil"
                    className={`nav-link ${location.pathname === '/soil' ? 'active' : ''}`}
                  >
                    {t('soil')}
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link
                to="/weather"
                className={`nav-link ${location.pathname === '/weather' ? 'active' : ''}`}
              >
                {t('weather')}
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/marketplace"
                className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}
              >
                {t('market')}
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/forum"
                className={`nav-link ${location.pathname === '/forum' ? 'active' : ''}`}
              >
                {t('forum')}
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link text-danger fw-bold ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <ShieldAlert size={16} className="me-1 inline" />
                  {t('admin')}
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Theme Selector (Light, Dark, Auto) */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light border d-flex align-items-center gap-1 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                title="Theme Settings"
              >
                {themeSetting === 'dark' ? (
                  <Moon size={16} className="text-warning" />
                ) : themeSetting === 'light' ? (
                  <Sun size={16} className="text-warning" />
                ) : (
                  <Monitor size={16} className="text-primary" />
                )}
                <span className="fw-semibold text-capitalize small">
                  {themeSetting === 'light' ? 'White' : themeSetting === 'dark' ? 'Dark' : 'Auto'}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button
                    className={`dropdown-item d-flex align-items-center gap-2 ${themeSetting === 'light' ? 'active fw-bold' : ''}`}
                    onClick={() => setThemeSetting('light')}
                  >
                    <Sun size={15} className="text-warning" />
                    <span>White (Light)</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item d-flex align-items-center gap-2 ${themeSetting === 'dark' ? 'active fw-bold' : ''}`}
                    onClick={() => setThemeSetting('dark')}
                  >
                    <Moon size={15} className="text-primary" />
                    <span>Dark</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item d-flex align-items-center gap-2 ${themeSetting === 'auto' ? 'active fw-bold' : ''}`}
                    onClick={() => setThemeSetting('auto')}
                  >
                    <Monitor size={15} className="text-secondary" />
                    <span>Auto (System Theme)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Language Selector */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light border d-flex align-items-center gap-1 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                <Globe size={16} className="text-secondary" />
                <span className="fw-semibold small">
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button className="dropdown-item" onClick={() => setLang('en')}>
                    English (EN)
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setLang('hi')}>
                    हिन्दी (HI)
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setLang('te')}>
                    తెలుగు (TE)
                  </button>
                </li>
              </ul>
            </div>

            {/* Cart Button */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="btn btn-light position-relative border d-flex align-items-center p-2 rounded-circle"
                title="Cart"
              >
                <ShoppingCart size={18} className="text-dark" />
                {totalCartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Auth Info */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-light border d-flex align-items-center gap-2 dropdown-toggle py-1 px-3 rounded-pill"
                  data-bs-toggle="dropdown"
                >
                  <div
                    className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="small fw-semibold">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>
                      Admin
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <Link to="/orders" className="dropdown-item">
                      {t('orders')}
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <LogOut size={16} />
                      {t('logout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-agri-outline d-flex align-items-center gap-1">
                  <LogIn size={15} />
                  <span>{t('login')}</span>
                </Link>
                <Link to="/register" className="btn btn-sm btn-agri">
                  <span>{t('register')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
