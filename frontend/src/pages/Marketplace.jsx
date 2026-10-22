import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Star, Check, Plus, Search, ShoppingCart } from 'lucide-react';

export default function Marketplace() {
  const { addToCart, cart } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null);

  const categories = ['All', 'Seeds', 'Fertilizer', 'Bio-Pesticide', 'Equipment', 'Irrigation Tools'];

  const fetchProducts = async () => {
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product._id || product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{t('market')}</h2>
          <p className="text-muted small mb-0">Certified seeds, bio-fertilizers, and smart solar irrigation systems</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-lg-8">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`agri-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-agri" type="submit">
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <ShoppingBag size={48} className="text-muted mb-3" />
          <h5>No Products Found</h5>
          <p className="text-muted small">Try adjusting your category or search query.</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((prod) => (
            <div key={prod._id || prod.id} className="col-md-6 col-lg-4">
              <div className="agri-card h-100 d-flex flex-column justify-content-between overflow-hidden">
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="badge bg-dark bg-opacity-75 position-absolute top-0 start-0 m-2">
                    {prod.category}
                  </span>
                </div>

                <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
                        <Star size={15} fill="#eab308" />
                        <span>{prod.rating || 4.8}</span>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success small">
                        In Stock ({prod.inStock})
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{prod.name}</h5>
                    <p className="text-muted small mb-3" style={{ minHeight: '38px' }}>
                      {prod.description.substring(0, 80)}...
                    </p>

                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {prod.benefits?.map((b, i) => (
                        <span key={i} className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
                    <div>
                      <span className="fs-5 fw-bold text-success">&#8377;{prod.price}</span>
                      <span className="text-muted small"> / {prod.unit}</span>
                    </div>
                    <button
                      className={`btn btn-sm ${addedItem === (prod._id || prod.id) ? 'btn-success' : 'btn-agri'} d-flex align-items-center gap-1`}
                      onClick={() => handleAddToCart(prod)}
                    >
                      {addedItem === (prod._id || prod.id) ? (
                        <>
                          <Check size={16} />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          <span>{t('addToCart')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
