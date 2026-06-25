const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
  applicant:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, required: true, enum: ['passport','cv','certificates','company_registration','supporting'] },
  originalName: { type: String, required: true },
  storagePath:  { type: String, required: true },
  fileSize:     { type: Number },
  mimeType:     { type: String },
  status:       { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  adminNotes:   { type: String, default: '' },
  reviewedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt:   { type: Date },
}, { timestamps: true });
module.exports = mongoose.model('Document', documentSchema);
