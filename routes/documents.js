const router   = require('express').Router();
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');
const upload   = require('../middleware/upload');
const fs       = require('fs');

router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:'No file uploaded' });
    const doc = await Document.create({
      applicant:    req.user._id,
      documentType: req.body.documentType || 'supporting',
      originalName: req.file.originalname,
      storagePath:  req.file.path,
      fileSize:     req.file.size,
      mimeType:     req.file.mimetype,
    });
    res.status(201).json({ success:true, message:'Document uploaded', document: doc });
  } catch (err) { res.status(500).json({ success:false, message: err.message }); }
});

router.get('/my', protect, async (req, res) => {
  const docs = await Document.find({ applicant: req.user._id });
  res.json({ success:true, documents: docs });
});

router.get('/:id/download', protect, async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, applicant: req.user._id });
  if (!doc) return res.status(404).json({ success:false, message:'Document not found' });
  res.download(doc.storagePath, doc.originalName);
});

module.exports = router;
