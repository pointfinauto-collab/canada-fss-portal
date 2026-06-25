/**
 * Canada FSS Portal — Payment Routes
 * Flutterwave Integration (inline charge + webhook verification)
 */

const router   = require('express').Router();
const axios    = require('axios');
const crypto   = require('crypto');
const Payment  = require('../models/Payment');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendPaymentConfirmationEmail } = require('../config/email');

const FLW_SECRET_KEY    = process.env.FLW_SECRET_KEY    || 'FLWSECK_TEST-XXXXXXXXXXXXXXXXXXXX-X';
const FLW_PUBLIC_KEY    = process.env.FLW_PUBLIC_KEY    || 'FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXX-X';
const FLW_WEBHOOK_HASH  = process.env.FLW_WEBHOOK_HASH  || 'canada_fss_webhook_secret_2026';
const FLW_BASE_URL      = 'https://api.flutterwave.com/v3';

// ── Utility: generate receipt number ────────────────────────────────────────
function genReceipt() {
  return 'RCP-CA-' + Date.now() + '-' + Math.floor(Math.random() * 9000 + 1000);
}

// ── GET /api/payments/config ─── send public key to frontend ────────────────
router.get('/config', protect, (req, res) => {
  res.json({ success: true, publicKey: FLW_PUBLIC_KEY });
});

// ── GET /api/payments/my ─── list user's payments ───────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ applicant: req.user._id }).sort('-createdAt');
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/payments/fee ─── get assigned fee for logged-in user ────────────
router.get('/fee', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('applicationFee feeStatus applicantType uic fullName email');
    res.json({
      success: true,
      fee:        user.applicationFee,
      feeStatus:  user.feeStatus,
      type:       user.applicantType,
      uic:        user.uic,
      name:       user.fullName,
      email:      user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/payments/initiate ─── initiate Flutterwave payment ─────────────
router.post('/initiate', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.applicationFee) {
      return res.status(400).json({ success: false, message: 'No fee has been assigned to your account yet.' });
    }

    const pending = await Payment.findOne({ applicant: user._id, status: 'pending' });
    if (!pending) {
      return res.status(400).json({ success: false, message: 'No pending payment found. Contact admin.' });
    }

    const txRef = 'FSS-' + user.uic + '-' + Date.now();
    pending.transactionRef = txRef;
    await pending.save();

    // Build Flutterwave inline payload (returned to frontend for use with Flutterwave.js popup)
    const payload = {
      public_key:   FLW_PUBLIC_KEY,
      tx_ref:       txRef,
      amount:       user.applicationFee,
      currency:     'USD',          // Flutterwave handles USD → local currency conversion
      payment_options: 'card,mobilemoney,ussd,banktransfer',
      customer: {
        email:       user.email,
        phonenumber: user.phone,
        name:        user.fullName,
      },
      customizations: {
        title:       'Canada FSS Portal',
        description: `Application Processing Fee — ${user.uic}`,
        logo:        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/200px-Flag_of_Canada_%28Pantone%29.svg.png',
      },
      meta: {
        uic:           user.uic,
        applicant_id:  String(user._id),
        fee_cad:       user.applicationFee,
      },
      redirect_url: `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/api/payments/callback`,
    };

    res.json({ success: true, payload, txRef });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/payments/verify ─── verify transaction after Flutterwave callback ──
router.post('/verify', protect, async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.body;
    if (!transaction_id) return res.status(400).json({ success: false, message: 'transaction_id required' });

    // Call Flutterwave verify endpoint
    const { data } = await axios.get(`${FLW_BASE_URL}/transactions/${transaction_id}/verify`, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` }
    });

    const flwData = data.data;

    if (data.status !== 'success' || flwData.status !== 'successful') {
      return res.status(400).json({ success: false, message: 'Payment not successful on Flutterwave.' });
    }

    const user = await User.findById(req.user._id);

    // Guard: ensure amount matches assigned fee (within $1 tolerance for currency rounding)
    if (flwData.amount < user.applicationFee - 1) {
      return res.status(400).json({ success: false, message: 'Payment amount mismatch.' });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { applicant: req.user._id, status: 'pending' },
      {
        status:          'completed',
        transactionId:   String(transaction_id),
        transactionRef:  tx_ref,
        paidAt:          new Date(),
        receiptNumber:   genReceipt(),
        paymentMethod:   flwData.payment_type || 'card',
        flwData: {
          flwRef:       flwData.flw_ref,
          currency:     flwData.currency,
          chargedAmount:flwData.charged_amount,
          network:      flwData.card?.issuer || flwData.meta?.source || '',
        },
      },
      { new: true }
    );

    // Update user fee status
    await User.findByIdAndUpdate(req.user._id, { feeStatus: 'paid' });

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail(user.email, user.fullName, user.uic, payment.receiptNumber, flwData.charged_amount, flwData.currency);
    } catch (e) { console.warn('Email send failed:', e.message); }

    res.json({
      success:       true,
      message:       'Payment verified and confirmed.',
      receiptNumber: payment.receiptNumber,
      transactionId: payment.transactionId,
      paidAt:        payment.paidAt,
      amount:        flwData.charged_amount,
      currency:      flwData.currency,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/payments/webhook ─── Flutterwave server-to-server webhook ──────
router.post('/webhook', async (req, res) => {
  try {
    // Verify Flutterwave webhook signature
    const hash = req.headers['verif-hash'];
    if (!hash || hash !== FLW_WEBHOOK_HASH) {
      return res.status(401).json({ message: 'Unauthorized webhook' });
    }

    const event = req.body;
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const { tx_ref, id: transaction_id, charged_amount, currency, payment_type } = event.data;
      const uic = event.data.meta?.uic;

      if (uic) {
        const user = await User.findOne({ uic });
        if (user) {
          const payment = await Payment.findOneAndUpdate(
            { applicant: user._id, status: 'pending' },
            {
              status:         'completed',
              transactionId:  String(transaction_id),
              transactionRef: tx_ref,
              paidAt:         new Date(),
              receiptNumber:  genReceipt(),
              paymentMethod:  payment_type || 'card',
            },
            { new: true }
          );
          await User.findByIdAndUpdate(user._id, { feeStatus: 'paid' });
          console.log(`✅ Webhook: Payment confirmed for ${uic} — ${charged_amount} ${currency}`);
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// ── GET /api/payments/receipt/:id ─── download payment receipt ───────────────
router.get('/receipt/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!payment || payment.status !== 'completed') {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    const user = await User.findById(req.user._id);
    // Return receipt data as JSON (frontend renders printable HTML)
    res.json({
      success: true,
      receipt: {
        receiptNumber:  payment.receiptNumber,
        uic:            user.uic,
        applicantName:  user.fullName,
        email:          user.email,
        amount:         payment.amount,
        currency:       'CAD',
        transactionId:  payment.transactionId,
        paymentMethod:  payment.paymentMethod,
        paidAt:         payment.paidAt,
        description:    payment.description,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
