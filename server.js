require('./jobs/alertCron');
const express = require('express');
const path = require('path');
const cors = require("cors");

const app = express();

const connectDB = require('./config/db');

// 1. Connect DB
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/member', require('./routes/memberRoutes'));

// 4. Catch-all (FIXED)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});