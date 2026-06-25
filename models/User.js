const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  uic:             { type: String, unique: true },
  fullName:        { type: String, required: true, trim: true },
  dateOfBirth:     { type: Date, required: true },
  nationality:     { type: String, required: true },
  passportNumber:  { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:           { type: String, required: true },
  countryOfResidence: { type: String, required: true },
  organizationName: { type: String, default: '' },
  applicantType:   { type: String, required: true, enum: ['Individual Consultant','Contractor','NGO / Civil Society','Research Firm','Other Organization'] },
  password:        { type: String, required: true, minlength: 8 },
  role:            { type: String, enum: ['applicant','admin'], default: 'applicant' },
  status:          { type: String, enum: ['Registered','Documents Submitted','Under Review','Additional Information Required','Approved','Rejected','Completed'], default: 'Registered' },
  emailVerified:   { type: Boolean, default: false },
  twoFactorEnabled:{ type: Boolean, default: false },
  twoFactorSecret: { type: String },
  applicationFee:  { type: Number, default: null },
  feeStatus:       { type: String, enum: ['not_assigned','pending','paid'], default: 'not_assigned' },
  notifications:   [{ message: String, read: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } }],
  auditLog:        [{ action: String, performedBy: String, timestamp: { type: Date, default: Date.now }, details: String }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(pw) { return bcrypt.compare(pw, this.password); };

userSchema.pre('save', function(next) {
  if (!this.uic) this.uic = 'UIC-CA-2026-' + String(Math.floor(100000 + Math.random() * 900000));
  next();
});

module.exports = mongoose.model('User', userSchema);
