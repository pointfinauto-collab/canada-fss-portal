module.exports = {
  APPLICATION_STATUSES: ['Registered','Documents Submitted','Under Review','Additional Information Required','Approved','Rejected','Completed'],
  DOCUMENT_TYPES:       ['passport','cv','certificates','company_registration','supporting'],
  APPLICANT_TYPES:      ['Individual Consultant','Contractor','NGO / Civil Society','Research Firm','Other Organization'],
  FEE_SCHEDULE: {
    'Individual Consultant': 150,
    'Contractor':            400,
    'NGO / Civil Society':   300,
    'Research Firm':         500,
    'Other Organization':    250,
  },
  PROGRAM_COUNTRIES:    ['Ethiopia','Sudan','South Sudan'],
  MAX_FILE_SIZE:        10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES:   ['application/pdf','image/jpeg','image/png','image/jpg'],
  JWT_EXPIRES_IN:       '7d',
  UIC_PREFIX:           'UIC-CA',
  PORTAL_EMAIL:         'fss-portal@canada.ca',
  PORTAL_PHONE:         '+1 (613) 944-4000',
};
