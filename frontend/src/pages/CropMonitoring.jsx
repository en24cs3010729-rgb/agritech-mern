import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Plus, Calendar, Activity, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

export default function CropMonitoring() {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    farmId: '',
    name: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    growthStage: 'Vegetative',
    healthStatus: 'Good',
    estimatedYieldKg: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [cropsRes, farmsRes] = await Promise.all([
        api.get('/crops'),
        api.get('/farms')
      ]);
      if (cropsRes.data.success) setCrops(cropsRes.data.data);
      if (farmsRes.data.success) {
        setFarms(farmsRes.data.data);
        if (farmsRes.data.data.length > 0 && !formData.farmId) {
          setFormData((prev) => ({ ...prev, farmId: farmsRes.data.data[0]._id || farmsRes.data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load crop data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/crops', formData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add crop');
    }
  };

  const handleStageChange = async (cropId, newStage) => {
    try {
      await api.put(`/crops/${cropId}`, { growthStage: newStage });
      fetchData();
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Delete this crop record?')) {
      try {
        await api.delete(`/crops/${cropId}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete crop');
      }
    }
  };

  const filteredCrops = selectedFarm
    ? crops.filter((c) => (c.farm?._id || c.farm) === selectedFarm)
    : crops;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{t('crops')}</h2>
          <p className="text-muted small mb-0">Monitor crop stages, vegetative health, and harvest predictions</p>
        </div>
        <div className="d-flex gap-2 align-items-center mt-2 mt-md-0">
          <select
            className="form-select form-select-sm"
            style={{ width: '180px' }}
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
          >
            <option value="">All Farms</option>
            {farms.map((f) => (
              <option key={f._id || f.id} value={f._id || f.id}>{f.name}</option>
            ))}
          </select>
          <button className="btn btn-sm btn-agri d-flex align-items-center gap-1" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Add Crop</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <Leaf size={48} className="text-muted mb-3" />
          <h5>No Crops Being Monitored</h5>
          <p className="text-muted small mb-3">Register your first crop to track growth and projected yield.</p>
          <button className="btn btn-agri" onClick={() => setShowModal(true)}>Add Crop</button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCrops.map((crop) => (
            <div key={crop._id || crop.id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{crop.name}</h5>
                      <span className="text-muted small">{crop.variety}</span>
                    </div>
                    <span className={`badge ${crop.healthStatus === 'Excellent' || crop.healthStatus === 'Good' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {crop.healthStatus}
                    </span>
                  </div>

                  <div className="bg-light p-3 rounded-3 my-3 small">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Calendar size={13} /> Sown On:
                      </span>
                      <strong>{new Date(crop.plantingDate).toLocaleDateString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Calendar size={13} /> Expected Harvest:
                      </span>
                      <strong>{new Date(crop.expectedHarvestDate).toLocaleDateString()}</strong>
                    </div>
                    {crop.estimatedYieldKg > 0 && (
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Est. Yield:</span>
                        <strong className="text-success">{crop.estimatedYieldKg.toLocaleString()} kg</strong>
                      </div>
                    )}
                  </div>

                  {crop.notes && (
                    <p className="small text-muted bg-white p-2 border rounded mb-3">
                      📝 {crop.notes}
                    </p>
                  )}

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-muted">Update Stage:</label>
                    <select
                      className="form-select form-select-sm"
                      value={crop.growthStage}
                      onChange={(e) => handleStageChange(crop._id || crop.id, e.target.value)}
                    >
                      <option value="Sowing / Germination">1. Sowing / Germination</option>
                      <option value="Vegetative">2. Vegetative Growth</option>
                      <option value="Flowering">3. Flowering</option>
                      <option value="Grain Filling / Fruiting">4. Grain Filling / Fruiting</option>
                      <option value="Maturity / Ready to Harvest">5. Ready to Harvest</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-top text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(crop._id || crop.id)}
                    title="Remove Crop"
                  >
                    <Trash2 size={14} className="me-1 inline" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding crop */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Register Crop to Monitor</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Farm</label>
                    <select
                      name="farmId"
                      className="form-select"
                      value={formData.farmId}
                      onChange={handleChange}
                      required
                    >
                      {farms.map((f) => (
                        <option key={f._id || f.id} value={f._id || f.id}>{f.name} ({f.sizeInAcres} Acres)</option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. Wheat, Basmati Rice"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Variety / Hybrid</label>
                      <input
                        type="text"
                        name="variety"
                        className="form-control"
                        placeholder="e.g. HD-2967"
                        value={formData.variety}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Planting Date</label>
                      <input
                        type="date"
                        name="plantingDate"
                        className="form-control"
                        value={formData.plantingDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Harvest Date</label>
                      <input
                        type="date"
                        name="expectedHarvestDate"
                        className="form-control"
                        value={formData.expectedHarvestDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Growth Stage</label>
                      <select name="growthStage" className="form-select" value={formData.growthStage} onChange={handleChange}>
                        <option value="Sowing / Germination">Sowing / Germination</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Grain Filling / Fruiting">Grain Filling / Fruiting</option>
                        <option value="Maturity / Ready to Harvest">Maturity / Ready to Harvest</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Health Status</label>
                      <select name="healthStatus" className="form-select" value={formData.healthStatus} onChange={handleChange}>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Needs Attention">Needs Attention</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Estimated Yield (in kg)</label>
                    <input
                      type="number"
                      name="estimatedYieldKg"
                      className="form-control"
                      placeholder="e.g. 15000"
                      value={formData.estimatedYieldKg}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Field Observation Notes</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Spraying completed, moisture adequate"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-agri">Register Crop</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
