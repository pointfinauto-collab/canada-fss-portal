const router   = require('express').Router();
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../config/email');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET || 'canada_fss_secret_2026', { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, dateOfBirth, nationality, passportNumber, email, phone, countryOfResidence, organizationName, applicantType, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ success:false, message:'Email already registered' });
    const user = await User.create({ fullName, dateOfBirth, nationality, passportNumber, email, phone, countryOfResidence, organizationName, applicantType, password });
    try { await sendWelcomeEmail(email, fullName, user.uic); } catch(e) { console.warn('Email send failed:', e.message); }
    res.status(201).json({ success:true, message:'Registration successful', uic: user.uic, token: signToken(user._id) });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { uic: email }] }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success:false, message:'Invalid credentials' });
    res.json({ success:true, token: signToken(user._id), user: { id:user._id, uic:user.uic, fullName:user.fullName, email:user.email, role:user.role, status:user.status } });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

// Get current user
router.get('/me', protect, (req, res) => res.json({ success:true, user: req.user }));

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) return res.status(400).json({ success:false, message:'Incorrect current password' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success:true, message:'Password updated' });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

module.exports = router;
