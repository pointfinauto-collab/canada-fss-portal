/**
 * Canada Development Opportunities Portal
 * server.js — Express Backend Entry Point
 */

require('dotenv').config();
const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const path          = require('path');
const morgan        = require('morgan');

const authRoutes        = require('./routes/auth');
const applicantRoutes   = require('./routes/applicants');
const documentRoutes    = require('./routes/documents');
const paymentRoutes     = require('./routes/payments');
const adminRoutes       = require('./routes/admin');
const notificationRoutes= require('./routes/notifications');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));

// ── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests. Please try again later.' });
app.use('/api/', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts.' });
app.use('/api/auth/', authLimiter);

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// ── Static Files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Database Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/canada_fss_portal', {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/applicants',    applicantRoutes);
app.use('/api/documents',     documentRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date(), service: 'Canada FSS Portal API' }));

// ── SPA Fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`🇨🇦 Canada FSS Portal running on http://localhost:${PORT}`));
module.exports = app;
