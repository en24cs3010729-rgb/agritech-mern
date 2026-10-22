const express = require('express');
const router = express.Router();
const { getPosts, createPost, addAnswer, upvotePost } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.post('/:id/answers', protect, addAnswer);
router.put('/:id/upvote', protect, upvotePost);

module.exports = router;
