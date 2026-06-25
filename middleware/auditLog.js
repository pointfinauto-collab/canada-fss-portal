/**
 * Audit Log Middleware
 * Records sensitive actions for security compliance
 */
const fs   = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

module.exports = (action) => (req, res, next) => {
  const entry = {
    timestamp:  new Date().toISOString(),
    action,
    userId:     req.user?._id || 'anonymous',
    ip:         req.ip,
    method:     req.method,
    path:       req.path,
    userAgent:  req.headers['user-agent'],
  };
  const logFile = path.join(logDir, `audit-${new Date().toISOString().slice(0,10)}.log`);
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  next();
};
