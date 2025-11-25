const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const perfLogger = require('./middleware/perfLogger');
const Post = require('./models/Post');
const User = require('./models/User');
const { verifyToken } = require('./utils/auth');

const app = express();
app.use(express.json());
app.use(cors());
// HTTP request logging for debugging
app.use(morgan('dev'));
app.use(perfLogger);

// Routes for posts
app.post('/api/posts', verifyToken, async (req, res) => {
  try {
    const authorId = req.user?.id;
    if (!req.body.title) return res.status(400).json({ error: 'Title is required' });

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content || '',
      author: authorId,
      category: req.body.category || null,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-')
    });

    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(+limit);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    Object.assign(post, req.body);
    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await Post.deleteOne({ _id: post._id });
    return res.status(200).json({ success: true });
  } catch (err) {
    logger.error(err.message || err);
    return res.status(500).json({ error: err.message });
  }
});

// Global error handler
app.use(errorHandler);

module.exports = app;
