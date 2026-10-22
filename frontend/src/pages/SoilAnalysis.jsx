import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  FlaskConical,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Plus,
  TrendingUp,
  Award,
  Sprout
} from 'lucide-react';

export default function SoilAnalysis() {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [soilReports, setSoilReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    farmId: '',
    nitrogen: 320,
    phosphorus: 35,
    potassium: 210,
    phLevel: 6.8,
    moisturePercent: 48,
    organicCarbonPercent: 0.75
  });

  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [farmsRes, soilRes] = await Promise.all([
          api.get('/farms'),
          api.get('/soil')
        ]);
        if (farmsRes.data.success) {
          setFarms(farmsRes.data.data);
          if (farmsRes.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, farmId: farmsRes.data.data[0]._id || farmsRes.data.data[0].id }));
          }
        }
        if (soilRes.data.success) {
          setSoilReports(soilRes.data.data);
          if (soilRes.data.data.length > 0) {
            setActiveReport(soilRes.data.data[0]);
          }
        }
      } catch (err) {
        console.error('Error loading soil data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/soil', formData);
      if (res.data.success) {
        setSoilReports([res.data.data, ...soilReports]);
        setActiveReport(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit soil diagnosis');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{t('soil')} Diagnostics & Analytics</h2>
          <p className="text-muted small mb-0">
            Scientific algorithmic analysis of Nitrogen, Phosphorus, Potassium & pH to maximize crop yield
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Soil Testing Input Form */}
        <div className="col-lg-5">
          <div className="agri-card p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FlaskConical size={22} className="text-success" />
              <h5 className="fw-bold mb-0">New Soil Test Input</h5>
            </div>

            <form onSubmit={handleDiagnose}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Target Farm / Plot</label>
                <select
                  name="farmId"
                  className="form-select"
                  value={formData.farmId}
                  onChange={handleChange}
                  required
                >
                  {farms.map((f) => (
                    <option key={f._id || f.id} value={f._id || f.id}>
                      {f.name} ({f.soilType} Soil)
                    </option>
                  ))}
                </select>
              </div>

              {/* Nitrogen */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>Nitrogen (N) - {formData.nitrogen} kg/ha</span>
                  <span className="text-muted">Target: 280 - 560 kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="100"
                  max="600"
                  step="10"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                />
              </div>

              {/* Phosphorus */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>Phosphorus (P) - {formData.phosphorus} kg/ha</span>
                  <span className="text-muted">Target: 20 - 50 kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="5"
                  max="80"
                  step="1"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                />
              </div>

              {/* Potassium */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>Potassium (K) - {formData.potassium} kg/ha</span>
                  <span className="text-muted">Target: 150 - 300 kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="50"
                  max="400"
                  step="5"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                />
              </div>

              {/* pH Level */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>Soil pH - {formData.phLevel}</span>
                  <span className="text-muted">Target: 6.0 - 7.5 (Neutral)</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="4.0"
                  max="9.5"
                  step="0.1"
                  name="phLevel"
                  value={formData.phLevel}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                  <span>4.0 (Acidic)</span>
                  <span>7.0 (Neutral)</span>
                  <span>9.5 (Alkaline)</span>
                </div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Moisture (%)</label>
                  <input
                    type="number"
                    name="moisturePercent"
                    className="form-control"
                    value={formData.moisturePercent}
                    onChange={handleChange}
                    min="5"
                    max="90"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    name="organicCarbonPercent"
                    className="form-control"
                    value={formData.organicCarbonPercent}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-agri w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled={submitting}
              >
                <TrendingUp size={18} />
                <span>{submitting ? 'Running Scientific Diagnostic...' : 'Calculate Soil Health Report'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Diagnosis Results & Recommendations */}
        <div className="col-lg-7">
          {activeReport ? (
            <div className="agri-card p-4 h-100">
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-4">
                <div>
                  <span className="badge bg-light text-muted border mb-1">
                    Tested: {new Date(activeReport.testDate || activeReport.createdAt).toLocaleDateString()}
                  </span>
                  <h4 className="fw-bold mb-0">Soil Health Diagnostic Result</h4>
                </div>
                <div className="text-end">
                  <div className="display-6 fw-bold text-success">{activeReport.healthScore}/100</div>
                  <span className={`badge ${activeReport.overallStatus === 'Optimal' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {activeReport.overallStatus}
                  </span>
                </div>
              </div>

              {/* NPK Visual Status Bars */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Nutrient Bioavailability Indicators:</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <div className="small text-muted mb-1">Nitrogen (N)</div>
                      <div className="h5 fw-bold mb-0 text-success">{activeReport.nitrogen} kg/ha</div>
                      <div className="small text-muted mt-1">Status: {activeReport.nitrogen < 250 ? 'Low' : activeReport.nitrogen > 550 ? 'High' : 'Optimal'}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <div className="small text-muted mb-1">Phosphorus (P)</div>
                      <div className="h5 fw-bold mb-0 text-primary">{activeReport.phosphorus} kg/ha</div>
                      <div className="small text-muted mt-1">Status: {activeReport.phosphorus < 20 ? 'Deficient' : 'Sufficient'}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 text-center">
                      <div className="small text-muted mb-1">Potassium (K)</div>
                      <div className="h5 fw-bold mb-0 text-warning">{activeReport.potassium} kg/ha</div>
                      <div className="small text-muted mt-1">Status: {activeReport.potassium < 140 ? 'Deficient' : 'Optimal'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Smart Recommendations */}
              <div className="mb-4">
                <h6 className="fw-bold d-flex align-items-center gap-1 mb-2">
                  <Lightbulb size={18} className="text-warning" />
                  <span>Agronomist Corrective Recommendations</span>
                </h6>
                <div className="d-flex flex-column gap-2">
                  {activeReport.recommendations?.map((rec, i) => (
                    <div key={i} className="p-3 rounded-3 border bg-light small">
                      <div className="fw-bold text-dark mb-1">{rec.category}</div>
                      <p className="text-muted mb-1">{rec.message}</p>
                      <div className="text-success fw-semibold">
                        🌱 <strong>Corrective Action:</strong> {rec.remedy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Crops */}
              <div>
                <h6 className="fw-bold d-flex align-items-center gap-1 mb-2">
                  <Sprout size={18} className="text-success" />
                  <span>Prime Suitable Crops for this Soil</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {activeReport.suggestedCrops?.map((crop, i) => (
                    <span key={i} className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fs-6">
                      ✓ {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="agri-card p-5 text-center text-muted">
              <FlaskConical size={48} className="mb-3 text-muted" />
              <h5>No Soil Reports Available</h5>
              <p className="small">Adjust the sliders on the left and click "Calculate Soil Health Report" to run diagnosis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
