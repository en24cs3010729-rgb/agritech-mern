const ForumPost = require('../models/ForumPost');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get all forum posts
// @route   GET /api/forum
const getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (getDbStatus()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.title = { $regex: search, $options: 'i' };
      const posts = await ForumPost.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: posts.length, data: posts });
    }

    let posts = [...store.forumPosts];
    if (category && category !== 'All') {
      posts = posts.filter(p => p.category === category);
    }
    if (search) {
      posts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()));
    }
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new question
// @route   POST /api/forum
const createPost = async (req, res) => {
  try {
    const { title, category, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    if (getDbStatus()) {
      const post = await ForumPost.create({
        author: req.user._id,
        authorName: req.user.name,
        title,
        category: category || 'General',
        content,
        tags: tags || []
      });
      return res.status(201).json({ success: true, data: post });
    }

    const newPost = {
      _id: `post_${Date.now()}`,
      id: `post_${Date.now()}`,
      author: req.user._id.toString(),
      authorName: req.user.name,
      title,
      category: category || 'General',
      content,
      tags: tags || ['Farming', 'Advice'],
      upvotes: 0,
      answers: [],
      createdAt: new Date()
    };

    store.forumPosts.unshift(newPost);
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add answer to a post (expert consultation)
// @route   POST /api/forum/:id/answers
const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerText } = req.body;

    if (!answerText) {
      return res.status(400).json({ success: false, message: 'Answer text is required' });
    }

    const isAgronomist = req.user.role === 'admin';

    if (getDbStatus()) {
      const post = await ForumPost.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Question not found' });

      post.answers.push({
        expert: req.user._id,
        expertName: isAgronomist ? `${req.user.name} (Agronomist Expert)` : req.user.name,
        isAgronomist,
        answerText,
        helpfulVotes: 0,
        answeredAt: new Date()
      });

      await post.save();
      return res.status(201).json({ success: true, data: post });
    }

    const post = store.forumPosts.find(p => p._id === id || p.id === id);
    if (!post) return res.status(404).json({ success: false, message: 'Question not found' });

    post.answers.push({
      expert: req.user._id.toString(),
      expertName: isAgronomist ? `${req.user.name} (Agronomist Expert)` : req.user.name,
      isAgronomist,
      answerText,
      helpfulVotes: 0,
      answeredAt: new Date()
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upvote a post
// @route   PUT /api/forum/:id/upvote
const upvotePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const post = await ForumPost.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true });
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      return res.json({ success: true, data: post });
    }

    const post = store.forumPosts.find(p => p._id === id || p.id === id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.upvotes = (post.upvotes || 0) + 1;
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPosts, createPost, addAnswer, upvotePost };
