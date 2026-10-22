import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  CloudSunRain,
  Bug,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Compass,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function WeatherPest() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Broadcast modal for Admin
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    pestName: '',
    severity: 'High',
    affectedCrops: 'Wheat, Mustard',
    symptoms: '',
    organicRemedy: '',
    chemicalRemedy: '',
    affectedRegions: 'Punjab, Haryana'
  });

  const fetchData = async () => {
    try {
      const [weatherRes, alertsRes] = await Promise.all([
        api.get('/weather'),
        api.get('/weather/pest-alerts')
      ]);
      if (weatherRes.data.success) setWeather(weatherRes.data.data);
      if (alertsRes.data.success) setPestAlerts(alertsRes.data.data);
    } catch (err) {
      console.error('Error loading weather & pest alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...broadcastData,
        affectedCrops: broadcastData.affectedCrops.split(',').map((s) => s.trim()),
        affectedRegions: broadcastData.affectedRegions.split(',').map((s) => s.trim())
      };
      await api.post('/weather/pest-alerts', payload);
      setShowBroadcastModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to broadcast alert');
    }
  };

  const filteredAlerts = severityFilter === 'All'
    ? pestAlerts
    : pestAlerts.filter((a) => a.severity.toLowerCase() === severityFilter.toLowerCase());

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{t('weather')} & Pest Defense</h2>
          <p className="text-muted small mb-0">Hyper-local agro-meteorology and real-time biological pest surveillance</p>
        </div>
        {isAdmin && (
          <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={() => setShowBroadcastModal(true)}>
            <Plus size={16} />
            <span>Broadcast Pest Alert</span>
          </button>
        )}
      </div>

      {/* Real-time Weather Section */}
      <div className="row g-4 mb-5">
        <div className="col-lg-5">
          <div className="agri-card p-4 h-100 bg-gradient text-dark">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-success text-white">Live Agro-Radar</span>
              <span className="small text-muted">
                {weather?.location?.district || 'Ludhiana'}, {weather?.location?.state || 'Punjab'}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3 my-3">
              <span className="display-4 fw-bold">{weather?.current?.tempC || 28}&deg;C</span>
              <div>
                <h5 className="fw-bold mb-0">{weather?.current?.condition || 'Sunny & Clear'}</h5>
                <span className="text-muted small">Feels like {weather?.current?.feelsLikeC || 29}&deg;C</span>
              </div>
            </div>

            <div className="row g-2 my-2 text-center small">
              <div className="col-4">
                <div className="p-2 bg-light rounded">
                  <div className="text-muted">Humidity</div>
                  <strong>{weather?.current?.humidity || 58}%</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 bg-light rounded">
                  <div className="text-muted">Wind</div>
                  <strong>{weather?.current?.windKph || 12} km/h</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 bg-light rounded">
                  <div className="text-muted">Rain Probability</div>
                  <strong>{weather?.current?.precipitationChance || 10}%</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 mt-3 small border">
              <strong className="text-success d-block mb-1">🌾 Agricultural Advisory:</strong>
              {weather?.current?.spraySuitability} &bull; {weather?.current?.irrigationAdvice}
            </div>
          </div>
        </div>

        {/* 5-Day Forecast Grid */}
        <div className="col-lg-7">
          <div className="agri-card p-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Calendar size={20} className="text-success" />
              <span>5-Day Agricultural Weather Forecast</span>
            </h5>
            <div className="d-flex flex-column gap-2">
              {weather?.forecast?.map((f, i) => (
                <div key={i} className="p-2 px-3 bg-light rounded-3 d-flex flex-wrap align-items-center justify-content-between small">
                  <span className="fw-bold text-dark" style={{ minWidth: '85px' }}>{f.day}</span>
                  <span className="text-muted">{f.condition}</span>
                  <span className="fw-semibold">{f.tempMax}&deg; / {f.tempMin}&deg;C</span>
                  <span className="badge bg-info text-dark">🌧️ {f.rainChance}% rain</span>
                  <span className="text-muted fst-italic d-none d-md-inline" style={{ maxWidth: '220px' }}>
                    {f.advisory}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pest Alerts Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <Bug size={24} className="text-danger" />
          <span>Active Pest & Disease Alerts</span>
        </h4>
        <div className="d-flex gap-1">
          {['All', 'Critical', 'High', 'Medium'].map((sev) => (
            <button
              key={sev}
              className={`btn btn-sm ${severityFilter === sev ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {filteredAlerts.map((alert) => (
          <div key={alert._id || alert.id} className="col-lg-6">
            <div className="agri-card p-4 h-100 border-start border-4 border-danger">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="fw-bold text-dark mb-1">{alert.title}</h5>
                  <span className="text-muted small fst-italic">{alert.pestName}</span>
                </div>
                <span className={`badge ${alert.severity === 'Critical' ? 'bg-danger' : alert.severity === 'High' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                  {alert.severity} Risk
                </span>
              </div>

              <div className="small mb-2">
                <strong>Affected Crops:</strong>{' '}
                {alert.affectedCrops?.map((c, i) => (
                  <span key={i} className="badge bg-light text-dark border me-1">{c}</span>
                ))}
              </div>

              <div className="small mb-3 text-muted">
                <strong>Symptoms:</strong> {alert.symptoms}
              </div>

              <div className="p-3 bg-light rounded-3 small">
                <div className="text-success mb-2">
                  <strong>🌿 Organic / Biological Remedy:</strong> {alert.organicRemedy}
                </div>
                {alert.chemicalRemedy && (
                  <div className="text-danger">
                    <strong>⚠️ Chemical Rescue Spray:</strong> {alert.chemicalRemedy}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Broadcast Pest Alert Modal */}
      {showBroadcastModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-danger">Broadcast Official Pest Alert</h5>
                <button type="button" className="btn-close" onClick={() => setShowBroadcastModal(false)}></button>
              </div>
              <form onSubmit={handleBroadcastSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Alert Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Stem Borer Infestation Warning"
                      value={broadcastData.title}
                      onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Pest / Disease Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Scirpophaga incertulas"
                        value={broadcastData.pestName}
                        onChange={(e) => setBroadcastData({ ...broadcastData, pestName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Risk Severity</label>
                      <select
                        className="form-select"
                        value={broadcastData.severity}
                        onChange={(e) => setBroadcastData({ ...broadcastData, severity: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Affected Crops (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={broadcastData.affectedCrops}
                      onChange={(e) => setBroadcastData({ ...broadcastData, affectedCrops: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Symptoms Observed</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={broadcastData.symptoms}
                      onChange={(e) => setBroadcastData({ ...broadcastData, symptoms: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Organic Remedy</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={broadcastData.organicRemedy}
                      onChange={(e) => setBroadcastData({ ...broadcastData, organicRemedy: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowBroadcastModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger">Broadcast Alert</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
