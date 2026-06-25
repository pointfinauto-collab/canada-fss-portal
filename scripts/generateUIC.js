/**
 * UIC Generator Utility
 * Generates unique UIC numbers in the format UIC-CA-YYYY-XXXXXX
 */
const crypto = require('crypto');

function generateUIC(year = new Date().getFullYear()) {
  const random = crypto.randomInt(100000, 999999);
  return `UIC-CA-${year}-${random}`;
}

function generateBatchUICs(count = 10) {
  const uics = new Set();
  while (uics.size < count) uics.add(generateUIC());
  return [...uics];
}

module.exports = { generateUIC, generateBatchUICs };

// CLI usage: node scripts/generateUIC.js 5
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 1;
  generateBatchUICs(count).forEach(u => console.log(u));
}
