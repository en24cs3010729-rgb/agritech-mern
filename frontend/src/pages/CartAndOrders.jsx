import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Package, Trash2, CheckCircle2, ArrowRight, Truck } from 'lucide-react';

export default function CartAndOrders() {
  const { cart, removeFromCart, clearCart, user } = useAuth();
  const { t } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  const [address, setAddress] = useState({
    address: 'Plot 44, GT Road Bypass',
    village: user?.location?.village || 'Raikot',
    district: user?.location?.district || 'Ludhiana',
    state: user?.location?.state || 'Punjab',
    pincode: '141109',
    phone: user?.phone || '+91 98765 43210'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (Kisan Pay)');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmittingOrder(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          product: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit
        })),
        totalAmount,
        shippingAddress: address,
        paymentMethod
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        clearCart();
        setOrderPlacedSuccess(true);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">Shopping Cart & {t('orders')}</h2>
          <p className="text-muted small mb-0">Order agricultural resources and track shipments to your farm gate</p>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Cart Items List */}
        <div className="col-lg-7">
          <div className="agri-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <ShoppingCart size={20} className="text-success" />
              <span>Items in Cart ({cart.length})</span>
            </h5>

            {orderPlacedSuccess && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                <CheckCircle2 size={20} />
                <span>Your order has been placed successfully! Estimated delivery in 3 days.</span>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <ShoppingCart size={40} className="mb-2 text-muted" />
                <p className="mb-0">Your cart is empty.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cart.map((item) => (
                  <div
                    key={item.product._id || item.product.id}
                    className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between"
                  >
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{item.product.name}</h6>
                      <span className="text-muted small">
                        &#8377;{item.product.price} &times; {item.quantity} {item.product.unit}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold text-success fs-6">
                        &#8377;{item.product.price * item.quantity}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger p-1 rounded-circle"
                        onClick={() => removeFromCart(item.product._id || item.product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
                  <span className="fs-5 fw-bold">Total Bill:</span>
                  <span className="fs-4 fw-bold text-success">&#8377;{totalAmount}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="col-lg-5">
          <div className="agri-card p-4">
            <h5 className="fw-bold mb-3">Delivery & Checkout</h5>
            <form onSubmit={handleCheckout}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Delivery Address / Village</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Village</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address.village}
                    onChange={(e) => setAddress({ ...address, village: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">District</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Contact Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Payment Option</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash on Delivery (Kisan Pay)">Cash on Delivery (Kisan Pay)</option>
                  <option value="UPI">UPI (Google Pay / PhonePe)</option>
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-agri w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled={cart.length === 0 || submittingOrder}
              >
                <span>{submittingOrder ? 'Placing Order...' : t('buyNow')}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Past Orders History */}
      <div className="agri-card p-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Truck size={20} className="text-primary" />
          <span>Order History & Dispatch Tracking</span>
        </h5>

        {loadingOrders ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <Package size={40} className="mb-2 text-muted" />
            <p>No previous orders found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id || ord.id}>
                    <td className="font-monospace small">{ord._id || ord.id}</td>
                    <td className="small text-muted">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td>
                      <ul className="list-unstyled mb-0 small">
                        {ord.items?.map((item, i) => (
                          <li key={i}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="fw-bold text-success">&#8377;{ord.totalAmount}</td>
                    <td className="small text-muted">{ord.paymentMethod}</td>
                    <td>
                      <span className={`badge ${ord.status === 'Delivered' ? 'bg-success' : ord.status === 'Dispatched' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
