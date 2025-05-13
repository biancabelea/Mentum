const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text, resourceId } = req.body;
    const authorId = req.user._id;

    if (!text || !resourceId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newComment = new Comment({
      text,
      resource: resourceId,
      author: authorId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to post comment.' });
  }
});

router.get('/:resourceId', async (req, res) => {
  try {
    const comments = await Comment.find({ resource: req.params.resourceId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
});

module.exports = router;
