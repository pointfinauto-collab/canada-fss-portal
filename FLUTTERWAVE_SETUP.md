# 🦋 Flutterwave Payment Integration Guide
## Canada FSS Portal

---

## Step 1: Create a Flutterwave Account
1. Go to **https://dashboard.flutterwave.com/signup**
2. Create a business account (select "Non-profit / Government" as business type)
3. Complete KYC verification

---

## Step 2: Get Your API Keys
1. Login → **Settings → API Keys**
2. Copy your:
   - `Public Key` → starts with `FLWPUBK_TEST-...` (test) or `FLWPUBK-...` (live)
   - `Secret Key` → starts with `FLWSECK_TEST-...` (test) or `FLWSECK-...` (live)
3. Set a custom **Webhook Hash** (any random string you choose)

---

## Step 3: Add Keys to Your .env File
```env
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-actual-public-key-here-X
FLW_SECRET_KEY=FLWSECK_TEST-your-actual-secret-key-here-X
FLW_WEBHOOK_HASH=your_custom_webhook_secret_2026
```

---

## Step 4: Configure Webhook in Flutterwave Dashboard
1. Go to **Settings → Webhooks**
2. Set Webhook URL to:
   ```
   https://yourdomain.com/api/payments/webhook
   ```
3. Set the **Secret Hash** to match your `FLW_WEBHOOK_HASH`
4. Enable events: `charge.completed`

---

## Step 5: Update Public Key in Frontend
In `public/js/script.js`, find:
```js
public_key: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X',
```
Replace with your actual public key.

> **Note:** In production, the server should provide the public key via `/api/payments/config` instead of hardcoding it in the frontend.

---

## Step 6: Set Redirect URL (for bank transfer payments)
In `routes/payments.js`, the redirect URL is:
```
${process.env.CLIENT_ORIGIN}/api/payments/callback
```
Make sure `CLIENT_ORIGIN` in your `.env` points to your live domain.

---

## Supported Payment Methods by Country

| Country       | Methods Available                        |
|---------------|------------------------------------------|
| 🇪🇹 Ethiopia   | Telebirr, CBE Birr, Card               |
| 🇸🇩 Sudan      | Card, Bank Transfer                      |
| 🇸🇸 South Sudan| Card, Mobile Money                       |
| 🇰🇪 Kenya      | M-Pesa, Card, Bank Transfer             |
| 🇺🇬 Uganda     | Airtel Money, MTN Mobile Money, Card    |
| 🇨🇦 Canada     | Visa, Mastercard, Amex                  |

---

## Currency Note
Flutterwave charges in **USD** by default on this portal. Applicants see the equivalent in their local currency. The fee assigned by admin is in CAD; the server converts to USD at the time of payment initiation.

To charge in CAD directly, change `currency: 'USD'` to `currency: 'CAD'` in `routes/payments.js`.

---

## Test Cards (Sandbox)
| Card Number         | Expiry  | CVV | Result    |
|---------------------|---------|-----|-----------|
| 4187427415564246    | 09/32   | 828 | ✅ Success |
| 4242424242424242    | 01/30   | 123 | ❌ Decline |

**Test Mobile Money PIN:** 1234

---

## Going Live
1. Complete Flutterwave KYC
2. Switch from `TEST` keys to `LIVE` keys in `.env`
3. Update webhook URL to your live domain
4. Test with a real small transaction first

---

## Support
- Flutterwave Docs: https://developer.flutterwave.com
- FSS Portal contact: fss-portal@canada.ca
