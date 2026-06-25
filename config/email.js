/**
 * Email Configuration — Canada FSS Portal
 * Nodemailer + SMTP
 */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

const FROM = '"Canada FSS Portal 🇨🇦" <noreply@canada.ca>';

const headerHtml = `
  <div style="background:#CC0000;padding:20px 24px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:18px;font-family:sans-serif">🇨🇦 Canada Development Opportunities Portal</h1>
    <p style="color:rgba(255,255,255,.85);margin:4px 0 0;font-size:12px">Field Support Services Program · Global Affairs Canada</p>
  </div>`;

const footerHtml = `
  <div style="background:#f5f5f5;padding:12px 24px;font-size:11px;color:#999;text-align:center;font-family:sans-serif">
    © 2026 Government of Canada · Global Affairs Canada · fss-portal@canada.ca
  </div>`;

// ── Welcome email after registration ────────────────────────────────────────
const sendWelcomeEmail = async (email, name, uic) => {
  await transporter.sendMail({
    from: FROM, to: email,
    subject: `🇨🇦 Registration Confirmed — Your UIC: ${uic}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${headerHtml}
      <div style="padding:28px 24px">
        <h2 style="color:#1a3a5c;margin-bottom:8px">Welcome, ${name}!</h2>
        <p style="color:#444;line-height:1.7">Your registration on the Canada Development Opportunities Portal has been confirmed. Your Unique Identification Code (UIC) is:</p>
        <div style="background:#1a3a5c;color:#f0c040;font-family:monospace;font-size:22px;font-weight:bold;padding:18px;text-align:center;border-radius:6px;margin:20px 0;letter-spacing:2px">${uic}</div>
        <p style="color:#444;line-height:1.7"><strong>Keep this code safe.</strong> Use it in all correspondence with the FSS Program office.</p>
        <div style="background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:16px;margin-top:20px">
          <p style="margin:0 0 8px;font-weight:600;color:#1a3a5c">Next Steps:</p>
          <ol style="color:#444;margin:0;padding-left:20px;line-height:2">
            <li>Login to your dashboard</li>
            <li>Upload required documents (passport, CV, certificates)</li>
            <li>Wait for fee assignment from our office</li>
            <li>Complete application fee payment via Flutterwave</li>
          </ol>
        </div>
      </div>
      ${footerHtml}
    </div>`
  });
};

// ── Status update email ───────────────────────────────────────────────────────
const sendStatusUpdateEmail = async (email, name, uic, status) => {
  const colors = {
    'Approved': '#157a3c', 'Rejected': '#dc2626',
    'Under Review': '#b45309', 'Documents Submitted': '#1a56db',
    'Completed': '#157a3c', 'Additional Information Required': '#6b21a8',
  };
  const color = colors[status] || '#1a3a5c';

  await transporter.sendMail({
    from: FROM, to: email,
    subject: `FSS Portal — Application Status Update: ${status}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${headerHtml}
      <div style="padding:28px 24px">
        <h2 style="color:#1a3a5c">Application Status Update</h2>
        <p style="color:#444">Dear <strong>${name}</strong>, your application status has been updated.</p>
        <p style="color:#444">UIC: <span style="font-family:monospace;font-weight:bold">${uic}</span></p>
        <div style="background:${color};color:#fff;font-size:18px;font-weight:bold;padding:16px;text-align:center;border-radius:6px;margin:20px 0">${status}</div>
        <p style="color:#444">Please <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}" style="color:#CC0000">login to your dashboard</a> for more details and next steps.</p>
      </div>
      ${footerHtml}
    </div>`
  });
};

// ── Payment confirmation email ────────────────────────────────────────────────
const sendPaymentConfirmationEmail = async (email, name, uic, receiptNumber, amount, currency) => {
  const date = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
  await transporter.sendMail({
    from: FROM, to: email,
    subject: `✅ Payment Confirmed — Receipt ${receiptNumber}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${headerHtml}
      <div style="padding:28px 24px">
        <h2 style="color:#157a3c">✅ Payment Confirmed</h2>
        <p style="color:#444">Dear <strong>${name}</strong>, your application fee payment has been received and confirmed.</p>
        <div style="background:#f9f9f9;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#666">Receipt Number</td><td style="padding:6px 0;font-weight:600;text-align:right;font-family:monospace">${receiptNumber}</td></tr>
            <tr><td style="padding:6px 0;color:#666">UIC</td><td style="padding:6px 0;font-weight:600;text-align:right;font-family:monospace">${uic}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Amount Paid</td><td style="padding:6px 0;font-weight:600;text-align:right">${amount} ${currency}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Date</td><td style="padding:6px 0;text-align:right">${date}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Payment Gateway</td><td style="padding:6px 0;text-align:right">Flutterwave</td></tr>
          </table>
        </div>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:14px;margin-top:16px">
          <p style="margin:0;color:#166534;font-size:14px">Your application is now under review. You will be notified of the decision within <strong>15–30 business days</strong>.</p>
        </div>
      </div>
      ${footerHtml}
    </div>`
  });
};

module.exports = { sendWelcomeEmail, sendStatusUpdateEmail, sendPaymentConfirmationEmail };
