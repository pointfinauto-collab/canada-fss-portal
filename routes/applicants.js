const router = require('express').Router();
const User   = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, async (req, res) => {
  res.json({ success:true, applicant: req.user });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['phone','countryOfResidence','organizationName'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f]) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new:true });
    res.json({ success:true, applicant: user });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

router.get('/status', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('status uic');
  res.json({ success:true, status: user.status, uic: user.uic });
});

module.exports = router;
