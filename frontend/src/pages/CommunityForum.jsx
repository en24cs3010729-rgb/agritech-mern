import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquare,
  ThumbsUp,
  Plus,
  Send,
  Award,
  Search,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function CommunityForum() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New question form
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionData, setQuestionData] = useState({
    title: '',
    category: 'Crop Management',
    content: '',
    tags: 'Wheat, Fertilizer'
  });

  // Reply states
  const [replyText, setReplyText] = useState({});

  const categories = [
    'All',
    'Crop Management',
    'Soil & Fertilizer',
    'Pest & Diseases',
    'Irrigation & Weather',
    'Market & Subsidies',
    'General'
  ];

  const fetchPosts = async () => {
    try {
      let url = '/forum';
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data.success) setPosts(res.data.data);
    } catch (err) {
      console.error('Failed to load forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...questionData,
        tags: questionData.tags.split(',').map((t) => t.trim())
      };
      await api.post('/forum', payload);
      setShowQuestionModal(false);
      setQuestionData({ title: '', category: 'Crop Management', content: '', tags: 'Wheat, Fertilizer' });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit question');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await api.put(`/forum/${postId}/upvote`);
      fetchPosts();
    } catch (err) {
      alert('Failed to upvote');
    }
  };

  const handleReplySubmit = async (postId) => {
    const text = replyText[postId];
    if (!text) return;

    try {
      await api.post(`/forum/${postId}/answers`, { answerText: text });
      setReplyText({ ...replyText, [postId]: '' });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit answer');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">{t('forum')} & Expert Advisory</h2>
          <p className="text-muted small mb-0">
            Consult university agronomists, share crop wisdom, and get solutions to farming challenges
          </p>
        </div>
        {isAuthenticated && (
          <button className="btn btn-agri d-flex align-items-center gap-1" onClick={() => setShowQuestionModal(true)}>
            <Plus size={18} />
            <span>Ask a Question</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
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
                placeholder="Search topics & questions..."
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

      {/* Questions Feed */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <MessageSquare size={48} className="text-muted mb-3" />
          <h5>No Discussions Yet</h5>
          <p className="text-muted small">Be the first farmer to ask an expert query!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {posts.map((post) => (
            <div key={post._id || post.id} className="agri-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="badge bg-light text-success border mb-1">
                    {post.category}
                  </span>
                  <h5 className="fw-bold text-dark mb-1">{post.title}</h5>
                  <div className="small text-muted">
                    Posted by <strong>{post.authorName}</strong> &bull; {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                  onClick={() => handleUpvote(post._id || post.id)}
                >
                  <ThumbsUp size={14} />
                  <span>{post.upvotes || 0}</span>
                </button>
              </div>

              <p className="text-muted small mb-3">{post.content}</p>

              <div className="d-flex flex-wrap gap-1 mb-3">
                {post.tags?.map((t, i) => (
                  <span key={i} className="badge bg-light text-muted border small">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Answers List */}
              <div className="border-top pt-3">
                <h6 className="fw-bold small text-muted mb-2">
                  Verified Expert Answers ({post.answers?.length || 0}):
                </h6>
                <div className="d-flex flex-column gap-2 mb-3">
                  {post.answers?.map((ans, i) => (
                    <div key={i} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-1">
                          <strong className="text-dark small">{ans.expertName}</strong>
                          {ans.isAgronomist && (
                            <span className="badge bg-success bg-opacity-25 text-success small d-flex align-items-center gap-1">
                              <Award size={12} /> Agronomist
                            </span>
                          )}
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {new Date(ans.answeredAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="small text-dark mb-0">{ans.answerText}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                {isAuthenticated && (
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={user.role === 'admin' ? "Provide expert agronomist guidance..." : "Add your experience / solution..."}
                      value={replyText[post._id || post.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [post._id || post.id]: e.target.value })}
                    />
                    <button
                      className="btn btn-sm btn-agri d-flex align-items-center gap-1"
                      onClick={() => handleReplySubmit(post._id || post.id)}
                    >
                      <Send size={14} />
                      <span>Answer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showQuestionModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Ask an Agronomy Expert</h5>
                <button type="button" className="btn-close" onClick={() => setShowQuestionModal(false)}></button>
              </div>
              <form onSubmit={handleAskSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Question Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Yellow stripe rust appearing on wheat crop"
                      value={questionData.title}
                      onChange={(e) => setQuestionData({ ...questionData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={questionData.category}
                      onChange={(e) => setQuestionData({ ...questionData, category: e.target.value })}
                    >
                      <option value="Crop Management">Crop Management</option>
                      <option value="Soil & Fertilizer">Soil & Fertilizer</option>
                      <option value="Pest & Diseases">Pest & Diseases</option>
                      <option value="Irrigation & Weather">Irrigation & Weather</option>
                      <option value="Market & Subsidies">Market & Subsidies</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Detailed Query</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe symptoms, affected plot size, or farming queries in detail..."
                      value={questionData.content}
                      onChange={(e) => setQuestionData({ ...questionData, content: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={questionData.tags}
                      onChange={(e) => setQuestionData({ ...questionData, tags: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowQuestionModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-agri">Post Question</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
