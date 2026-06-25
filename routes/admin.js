const router   = require('express').Router();
const User     = require('../models/User');
const Payment  = require('../models/Payment');
const Document = require('../models/Document');
const { protect, adminOnly } = require('../middleware/auth');
const { sendStatusUpdateEmail } = require('../config/email');

router.use(protect, adminOnly);

router.get('/applicants', async (req, res) => {
  const { status, search, page=1, limit=20 } = req.query;
  const query = { role:'applicant' };
  if (status) query.status = status;
  if (search) query.$or = [{ fullName: new RegExp(search,'i') }, { email: new RegExp(search,'i') }, { uic: new RegExp(search,'i') }];
  const total = await User.countDocuments(query);
  const applicants = await User.find(query).select('-password').skip((page-1)*limit).limit(Number(limit));
  res.json({ success:true, applicants, total, pages: Math.ceil(total/limit) });
});

router.put('/applicants/:id/status', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new:true });
    if (!user) return res.status(404).json({ success:false, message:'User not found' });
    try { await sendStatusUpdateEmail(user.email, user.fullName, user.uic, req.body.status); } catch(e){}
    res.json({ success:true, message:'Status updated', user });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

router.post('/applicants/:id/assign-fee', async (req, res) => {
  try {
    const { amount } = req.body;
    await User.findByIdAndUpdate(req.params.id, { applicationFee: amount, feeStatus:'pending' });
    await Payment.create({ applicant: req.params.id, amount, assignedBy: req.user._id });
    res.json({ success:true, message:'Fee assigned' });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

router.get('/stats', async (req, res) => {
  const total    = await User.countDocuments({ role:'applicant' });
  const approved = await User.countDocuments({ status:'Approved' });
  const rejected = await User.countDocuments({ status:'Rejected' });
  const pending  = await User.countDocuments({ status:'Under Review' });
  const revenue  = await Payment.aggregate([{ $match:{ status:'completed' } }, { $group:{ _id:null, total:{ $sum:'$amount' } } }]);
  res.json({ success:true, stats:{ total, approved, rejected, pending, revenue: revenue[0]?.total || 0 } });
});

router.post('/send-message', async (req, res) => {
  const { userId, message } = req.body;
  await User.findByIdAndUpdate(userId, { $push: { notifications: { message } } });
  res.json({ success:true, message:'Message sent' });
});

module.exports = router;
