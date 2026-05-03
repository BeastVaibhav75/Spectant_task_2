const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'feedback.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit request size

// Rate Limiting: Max 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many feedback submissions. Please try again later.' },
});

// Helper to read/write feedback
const getFeedbacks = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveFeedback = (feedback) => {
  const feedbacks = getFeedbacks();
  feedbacks.push({
    ...feedback,
    id: feedbacks.length + 1,
    timestamp: new Date(),
  });
  fs.writeFileSync(DB_PATH, JSON.stringify(feedbacks, null, 2));
  return feedbacks[feedbacks.length - 1];
};

// API: POST /feedback
app.post('/feedback', limiter, (req, res) => {
  const { name, email, feedback } = req.body;

  // 1. Improved Validation: Check for presence and type
  if (typeof name !== 'string' || typeof email !== 'string' || typeof feedback !== 'string') {
    return res.status(400).json({ error: 'Invalid input types.' });
  }

  // 2. Length Validation (Fixing Issue #2)
  if (name.length > 100 || feedback.length > 2000) {
    return res.status(400).json({ error: 'Input too long. Name max 100, Feedback max 2000 chars.' });
  }

  if (!name.trim() || !email.trim() || !feedback.trim()) {
    return res.status(400).json({ error: 'All fields are required and cannot be empty.' });
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // 3. Persistent Storage (Fixing Issue #3)
  try {
    const saved = saveFeedback({ name: name.trim(), email: email.trim(), feedback: feedback.trim() });
    console.log('New feedback saved:', saved);
    res.status(201).json({ message: 'Feedback submitted successfully!', data: saved });
  } catch (error) {
    console.error('Failed to save feedback:', error);
    res.status(500).json({ error: 'Internal server error while saving feedback.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
