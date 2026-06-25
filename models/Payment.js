/**
 * Payment Model — Canada FSS Portal
 * Supports Flutterwave transaction data
 */
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  applicant:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:         { type: Number, required: true },
  currency:       { type: String, default: 'CAD' },
  description:    { type: String, default: 'Application Processing Fee' },
  status:         { type: String, enum: ['pending','completed','failed','refunded'], default: 'pending' },

  // Flutterwave specific fields
  transactionId:  { type: String, sparse: true },
  transactionRef: { type: String, sparse: true },   // FSS-UIC-timestamp (our tx_ref)
  paymentMethod:  { type: String },                  // card, mobilemoney, ussd, banktransfer
  receiptNumber:  { type: String },
  paidAt:         { type: Date },

  // Raw Flutterwave response data
  flwData: {
    flwRef:        { type: String },
    currency:      { type: String },
    chargedAmount: { type: Number },
    network:       { type: String },
  },

  // Admin assignment info
  assignedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAt:   { type: Date, default: Date.now },

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
