const router       = require('express').Router();
const Notification = require('../models/Notification');
const { protect }  = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const notifs = await Notification.find({ recipient: req.user._id }).sort('-createdAt').limit(20);
  res.json({ success:true, notifications: notifs });
});

router.put('/:id/read', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read:true });
  res.json({ success:true });
});

router.put('/mark-all-read', protect, async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read:false }, { read:true });
  res.json({ success:true });
});

module.exports = router;
