const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Discussion title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Crop Management', 'Soil & Fertilizer', 'Pest & Diseases', 'Irrigation & Weather', 'Market & Subsidies', 'General'],
    default: 'General'
  },
  content: {
    type: String,
    required: [true, 'Query content is required']
  },
  upvotes: {
    type: Number,
    default: 0
  },
  tags: [String],
  answers: [{
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expertName: String,
    isAgronomist: {
      type: Boolean,
      default: false
    },
    answerText: {
      type: String,
      required: true
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', forumPostSchema);
