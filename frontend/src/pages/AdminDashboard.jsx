import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  Users,
  Tractor,
  Leaf,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/orders')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 text-muted">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <span className="badge bg-danger text-white px-2 py-1 mb-1">
            <ShieldAlert size={14} className="me-1 inline" /> Administrator Access
          </span>
          <h2 className="fw-bold mb-0">Agricultural System Control Center</h2>
          <p className="text-muted small mb-0">Platform oversight, farmer registry, orders moderation, and emergency pest surveillance</p>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 text-center h-100">
            <Users size={24} className="text-primary mb-1 mx-auto" />
            <div className="small text-muted">Users</div>
            <h4 className="fw-bold mb-0">{stats?.totalUsers || 0}</h4>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 text-center h-100">
            <Tractor size={24} className="text-success mb-1 mx-auto" />
            <div className="small text-muted">Farms</div>
            <h4 className="fw-bold mb-0">{stats?.totalFarms || 0}</h4>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 text-center h-100">
            <Leaf size={24} className="text-info mb-1 mx-auto" />
            <div className="small text-muted">Crops</div>
            <h4 className="fw-bold mb-0">{stats?.totalCrops || 0}</h4>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 text-center h-100">
            <ShoppingBag size={24} className="text-warning mb-1 mx-auto" />
            <div className="small text-muted">Orders</div>
            <h4 className="fw-bold mb-0">{stats?.totalOrders || 0}</h4>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 text-center h-100">
            <DollarSign size={24} className="text-success mb-1 mx-auto" />
            <div className="small text-muted">Revenue</div>
            <h4 className="fw-bold mb-0">&#8377;{stats?.totalRevenue || 0}</h4>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 text-center h-100">
            <AlertTriangle size={24} className="text-danger mb-1 mx-auto" />
            <div className="small text-muted">Pest Alerts</div>
            <h4 className="fw-bold mb-0 text-danger">{stats?.activeAlerts || 0}</h4>
          </div>
        </div>
      </div>

      {/* Orders Moderation Table */}
      <div className="agri-card p-4 mb-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <PackageCheck size={20} className="text-primary" />
          <span>System-wide Marketplace Orders & Fulfillment</span>
        </h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Farmer</th>
                <th>Items Ordered</th>
                <th>Total Bill</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id || ord.id}>
                  <td className="font-monospace">{ord._id || ord.id}</td>
                  <td>
                    <strong>{ord.shippingAddress?.village || 'Raikot'}</strong>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{ord.shippingAddress?.phone}</div>
                  </td>
                  <td>
                    {ord.items?.map((item, i) => (
                      <div key={i}>{item.quantity}x {item.name}</div>
                    ))}
                  </td>
                  <td className="fw-bold text-success">&#8377;{ord.totalAmount}</td>
                  <td>{ord.paymentMethod}</td>
                  <td>
                    <span className={`badge ${ord.status === 'Delivered' ? 'bg-success' : ord.status === 'Dispatched' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: '130px' }}
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord._id || ord.id, e.target.value)}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered Users Table */}
      <div className="agri-card p-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Users size={20} className="text-success" />
          <span>Registered Farmers & Agronomists Registry</span>
        </h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id || u.id}>
                  <td className="fw-bold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                      {u.role === 'admin' ? 'Agronomist Admin' : 'Farmer'}
                    </span>
                  </td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    {u.location?.district ? `${u.location.district}, ${u.location.state}` : 'Punjab'}
                  </td>
                  <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
