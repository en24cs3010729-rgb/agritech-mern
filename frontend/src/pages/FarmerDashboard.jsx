import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import {
  Tractor,
  Leaf,
  FlaskConical,
  ShoppingBag,
  CloudSun,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Wind
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soilReports, setSoilReports] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmsRes, cropsRes, soilRes, alertsRes, weatherRes] = await Promise.all([
          api.get('/farms'),
          api.get('/crops'),
          api.get('/soil'),
          api.get('/weather/pest-alerts'),
          api.get('/weather')
        ]);

        if (farmsRes.data.success) setFarms(farmsRes.data.data);
        if (cropsRes.data.success) setCrops(cropsRes.data.data);
        if (soilRes.data.success) setSoilReports(soilRes.data.data);
        if (alertsRes.data.success) setPestAlerts(alertsRes.data.data);
        if (weatherRes.data.success) setWeather(weatherRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const latestSoilScore = soilReports.length > 0 ? soilReports[0].healthScore : 88;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Gathering your farm analytics...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Top Banner / Welcome */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">
            {t('welcome')}, {user?.name}! 👋
          </h2>
          <p className="text-muted small mb-0">
            {user?.location?.village || 'Raikot'}, {user?.location?.district || 'Ludhiana'} &bull; Real-time Farm Intelligence
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <Link to="/farms" className="btn btn-sm btn-agri-outline d-flex align-items-center gap-1">
            <PlusCircle size={16} />
            <span>Add Farm</span>
          </Link>
          <Link to="/soil" className="btn btn-sm btn-agri d-flex align-items-center gap-1">
            <FlaskConical size={16} />
            <span>Diagnose Soil</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">{t('totalFarms')}</span>
              <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success" style={{ width: '40px', height: '40px' }}>
                <Tractor size={20} />
              </div>
            </div>
            <h3 className="fw-bold mb-0">{farms.length}</h3>
            <span className="text-success small fw-semibold">
              {farms.reduce((sum, f) => sum + (Number(f.sizeInAcres) || 0), 0)} Total Acres
            </span>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">{t('activeCrops')}</span>
              <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary" style={{ width: '40px', height: '40px' }}>
                <Leaf size={20} />
              </div>
            </div>
            <h3 className="fw-bold mb-0">{crops.length}</h3>
            <span className="text-primary small fw-semibold">Monitored Plots</span>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">{t('soilStatus')}</span>
              <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning" style={{ width: '40px', height: '40px' }}>
                <FlaskConical size={20} />
              </div>
            </div>
            <h3 className="fw-bold mb-0">{latestSoilScore} / 100</h3>
            <span className="text-success small fw-semibold">Optimal Range</span>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="agri-card p-3 h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Pest Alerts</span>
              <div className="stat-icon-wrapper bg-danger bg-opacity-10 text-danger" style={{ width: '40px', height: '40px' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-danger">{pestAlerts.length}</h3>
            <span className="text-danger small fw-semibold">Active Warnings</span>
          </div>
        </div>
      </div>

      {/* Weather Advisory & Pest Alerts Banner */}
      <div className="row g-4 mb-4">
        {/* Weather Card */}
        <div className="col-lg-7">
          <div className="agri-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <CloudSun size={24} className="text-warning" />
                <h5 className="fw-bold mb-0">{t('weatherToday')}</h5>
              </div>
              <span className="badge bg-light text-dark border">
                {weather?.location?.district || 'Ludhiana'}, {weather?.location?.state || 'Punjab'}
              </span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 mb-3">
              <div className="d-flex align-items-center gap-3">
                <span className="display-6 fw-bold text-dark">{weather?.current?.tempC || 28}&deg;C</span>
                <div>
                  <div className="fw-semibold">{weather?.current?.condition || 'Clear Sky / Sunny'}</div>
                  <div className="text-muted small">Feels like {weather?.current?.feelsLikeC || 29}&deg;C</div>
                </div>
              </div>
              <div className="text-end small text-muted">
                <div>Humidity: <strong>{weather?.current?.humidity || 58}%</strong></div>
                <div>Wind: <strong>{weather?.current?.windKph || 12} km/h NW</strong></div>
              </div>
            </div>

            <div className="p-3 border rounded-3 bg-white">
              <div className="small fw-bold text-success text-uppercase mb-1">
                🚜 Field Advisory for Today
              </div>
              <p className="small mb-1 text-dark">
                <strong>Foliar Spray:</strong> {weather?.current?.spraySuitability || 'Excellent for Spraying'}
              </p>
              <p className="small mb-0 text-muted">
                <strong>Irrigation:</strong> {weather?.current?.irrigationAdvice || 'Light drip irrigation recommended.'}
              </p>
            </div>
          </div>
        </div>

        {/* Pest Alerts Box */}
        <div className="col-lg-5">
          <div className="agri-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <AlertTriangle size={22} className="text-danger" />
                <h5 className="fw-bold mb-0">Active Threat Alerts</h5>
              </div>
              <Link to="/weather" className="small text-danger fw-bold text-decoration-none">
                All Alerts &rarr;
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {pestAlerts.slice(0, 2).map((alert) => (
                <div key={alert._id || alert.id} className="p-3 rounded-3 border border-danger-subtle bg-danger-subtle bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-bold small text-dark">{alert.title}</span>
                    <span className={`badge ${alert.severity === 'Critical' ? 'bg-danger' : alert.severity === 'High' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="small text-muted mb-2">{alert.symptoms.substring(0, 85)}...</p>
                  <div className="small bg-white p-2 rounded border">
                    <strong className="text-success">🌿 Remedy:</strong> {alert.organicRemedy.substring(0, 75)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Crops Tracking Table */}
      <div className="agri-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="fw-bold mb-0">Registered Crops & Growth Status</h5>
            <span className="text-muted small">Tracking phenological stages across all your farm plots</span>
          </div>
          <Link to="/crops" className="btn btn-sm btn-agri">
            Manage All Crops
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Crop Name</th>
                <th>Variety</th>
                <th>Planting Date</th>
                <th>Expected Harvest</th>
                <th>Stage</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop._id || crop.id}>
                  <td className="fw-bold text-dark">{crop.name}</td>
                  <td>{crop.variety}</td>
                  <td className="small text-muted">{new Date(crop.plantingDate).toLocaleDateString()}</td>
                  <td className="small text-muted">{new Date(crop.expectedHarvestDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-info text-dark rounded-pill">
                      {crop.growthStage}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${crop.healthStatus === 'Excellent' || crop.healthStatus === 'Good' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {crop.healthStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
