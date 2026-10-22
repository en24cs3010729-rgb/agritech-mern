import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Tractor, Plus, MapPin, Droplets, Layers, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function FarmManagement() {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sizeInAcres: '',
    soilType: 'Loamy',
    irrigationType: 'Drip',
    waterSource: 'Solar Borewell',
    address: '',
    village: '',
    district: '',
    state: 'Punjab',
    pincode: ''
  });

  const fetchFarms = async () => {
    try {
      const res = await api.get('/farms');
      if (res.data.success) setFarms(res.data.data);
    } catch (err) {
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      sizeInAcres: '',
      soilType: 'Loamy',
      irrigationType: 'Drip',
      waterSource: 'Solar Borewell',
      address: '',
      village: '',
      district: '',
      state: 'Punjab',
      pincode: ''
    });
    setShowModal(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      sizeInAcres: farm.sizeInAcres,
      soilType: farm.soilType || 'Loamy',
      irrigationType: farm.irrigationType || 'Drip',
      waterSource: farm.waterSource || 'Borewell',
      address: farm.location?.address || '',
      village: farm.location?.village || '',
      district: farm.location?.district || '',
      state: farm.location?.state || 'Punjab',
      pincode: farm.location?.pincode || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sizeInAcres: Number(formData.sizeInAcres),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        waterSource: formData.waterSource,
        location: {
          address: formData.address,
          village: formData.village,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      if (editingFarm) {
        await api.put(`/farms/${editingFarm._id || editingFarm.id}`, payload);
      } else {
        await api.post('/farms', payload);
      }
      setShowModal(false);
      fetchFarms();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save farm');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this farm? This will also remove associated crops.')) {
      try {
        await api.delete(`/farms/${id}`);
        fetchFarms();
      } catch (err) {
        alert('Failed to delete farm');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{t('farms')} Management</h2>
          <p className="text-muted small mb-0">Register and configure agricultural land parcels, soil types & irrigation systems</p>
        </div>
        <button className="btn btn-agri d-flex align-items-center gap-2" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add New Farm</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <Tractor size={48} className="text-muted mb-3" />
          <h5>No Farms Registered Yet</h5>
          <p className="text-muted small mb-3">Add your first farm profile to start tracking crops and soil health.</p>
          <button className="btn btn-agri" onClick={openAddModal}>Add Your First Farm</button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id || farm.id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <h5 className="fw-bold text-dark mb-0">{farm.name}</h5>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1 rounded">
                      {farm.sizeInAcres} Acres
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-1 text-muted small mb-3">
                    <MapPin size={15} />
                    <span>
                      {farm.location?.village ? `${farm.location.village}, ` : ''}
                      {farm.location?.district || 'District'}, {farm.location?.state || 'State'}
                    </span>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Layers size={14} /> Soil Type:
                      </span>
                      <strong className="text-dark">{farm.soilType || 'Loamy'}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted d-flex align-items-center gap-1">
                        <Droplets size={14} /> Irrigation:
                      </span>
                      <strong className="text-dark">{farm.irrigationType || 'Drip'}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Water Source:</span>
                      <strong className="text-dark">{farm.waterSource || 'Borewell'}</strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 pt-2 border-top">
                  <button
                    className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    onClick={() => openEditModal(farm)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1"
                    onClick={() => handleDelete(farm._id || farm.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit Farm */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingFarm ? 'Edit Farm Profile' : 'Register New Farm'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Farm / Plot Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Green Horizon Farm"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Size (in Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="sizeInAcres"
                        className="form-control"
                        placeholder="e.g. 10.5"
                        value={formData.sizeInAcres}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Soil Type</label>
                      <select name="soilType" className="form-select" value={formData.soilType} onChange={handleChange}>
                        <option value="Alluvial">Alluvial Soil</option>
                        <option value="Black">Black Soil (Regur)</option>
                        <option value="Red">Red Soil</option>
                        <option value="Laterite">Laterite Soil</option>
                        <option value="Clay">Clay Soil</option>
                        <option value="Sandy">Sandy Loam</option>
                        <option value="Loamy">Loamy Soil</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Irrigation Type</label>
                      <select name="irrigationType" className="form-select" value={formData.irrigationType} onChange={handleChange}>
                        <option value="Drip">Drip Irrigation</option>
                        <option value="Sprinkler">Sprinkler Irrigation</option>
                        <option value="Canal">Canal Irrigation</option>
                        <option value="Borewell / Tube Well">Borewell / Tube Well</option>
                        <option value="Rainfed">Rainfed</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Water Source</label>
                      <input
                        type="text"
                        name="waterSource"
                        className="form-control"
                        placeholder="e.g. Solar Tube Well"
                        value={formData.waterSource}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Village</label>
                      <input
                        type="text"
                        name="village"
                        className="form-control"
                        value={formData.village}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">District</label>
                      <input
                        type="text"
                        name="district"
                        className="form-control"
                        value={formData.district}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-agri">Save Farm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
