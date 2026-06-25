/**
 * Input Validation Middleware
 * Provides sanitization and validation for all API inputs
 */

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = pw => pw && pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
const sanitizeStr = str => typeof str === 'string' ? str.trim().replace(/<[^>]*>/g, '') : '';

exports.validateRegistration = (req, res, next) => {
  const { fullName, email, password, nationality, passportNumber, phone, countryOfResidence, applicantType } = req.body;
  const errors = [];
  if (!fullName || fullName.trim().length < 2)    errors.push('Full name is required (min 2 chars)');
  if (!validateEmail(email))                       errors.push('Valid email address is required');
  if (!validatePassword(password))                 errors.push('Password must be 8+ chars with uppercase and number');
  if (!nationality)                                errors.push('Nationality is required');
  if (!passportNumber || passportNumber.length < 5)errors.push('Valid passport number is required');
  if (!phone)                                      errors.push('Phone number is required');
  if (!countryOfResidence)                         errors.push('Country of residence is required');
  if (!applicantType)                              errors.push('Applicant type is required');
  if (errors.length) return res.status(400).json({ success: false, errors });

  // Sanitize
  req.body.fullName         = sanitizeStr(fullName);
  req.body.passportNumber   = sanitizeStr(passportNumber);
  req.body.phone            = sanitizeStr(phone);
  req.body.organizationName = sanitizeStr(req.body.organizationName || '');
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email/UIC and password are required' });
  next();
};
