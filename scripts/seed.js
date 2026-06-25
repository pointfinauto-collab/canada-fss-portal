/**
 * Seed script — creates admin user and sample applicants
 * Run: node scripts/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/canada_fss_portal');

async function seed() {
  await User.deleteMany({});
  await User.create([
    { fullName:'Admin User', dateOfBirth:new Date('1980-01-01'), nationality:'Canadian', passportNumber:'CA000001', email:'admin@canada.ca', phone:'+1 613 944 4000', countryOfResidence:'Canada', applicantType:'Individual Consultant', password:'Admin@2026', role:'admin', emailVerified:true },
    { fullName:'Abebe Bekele', dateOfBirth:new Date('1985-03-15'), nationality:'Ethiopian', passportNumber:'ET123456', email:'abebe@example.com', phone:'+251 911 234567', countryOfResidence:'Ethiopia', organizationName:'Dev Consulting ET', applicantType:'Individual Consultant', password:'Applicant@2026', status:'Under Review', emailVerified:true },
    { fullName:'Amina Hassan',  dateOfBirth:new Date('1990-07-22'), nationality:'Sudanese',  passportNumber:'SD789012', email:'amina@ngo.org',  phone:'+249 912 345678', countryOfResidence:'Sudan',   organizationName:'Sudan Aid NGO', applicantType:'NGO / Civil Society', password:'Applicant@2026', status:'Approved', emailVerified:true },
  ]);
  console.log('✅ Database seeded successfully');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
