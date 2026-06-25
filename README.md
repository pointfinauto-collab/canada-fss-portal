# 🇨🇦 Canada Development Opportunities Portal

**Government of Canada · Global Affairs Canada · Field Support Services (FSS) Program**

A professional, secure web application for registering development opportunity applicants for Canadian-funded projects in Ethiopia, Sudan, South Sudan, and Pan-African programs.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email credentials
```

### 3. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 4. Open the Portal
Visit `http://localhost:3000`

---

## 📁 Project Structure

```
canada-portal/
├── public/
│   ├── index.html          ← Main SPA frontend
│   ├── css/
│   │   └── styles.css      ← All styles (red/white/navy Canadian theme)
│   ├── js/
│   │   └── script.js       ← Frontend logic, routing, state management
│   └── images/
│       └── canada-flag.svg ← Canadian flag SVG
├── routes/
│   ├── auth.js             ← Register, login, password change
│   ├── applicants.js       ← Profile management, status
│   ├── documents.js        ← Upload, list, download documents
│   ├── payments.js         ← Fee processing, receipt
│   ├── admin.js            ← Admin panel APIs
│   └── notifications.js    ← Dashboard notifications
├── models/
│   ├── User.js             ← Applicant & admin schema (BCrypt passwords, UIC auto-gen)
│   ├── Document.js         ← Uploaded documents schema
│   ├── Payment.js          ← Payment records schema
│   └── Notification.js     ← Notification schema
├── middleware/
│   ├── auth.js             ← JWT protect + adminOnly guards
│   └── upload.js           ← Multer config (PDF/JPG/PNG, 10MB limit)
├── config/
│   ├── db.js               ← MongoDB connection
│   └── email.js            ← Nodemailer (welcome + status update emails)
├── server.js               ← Express app entry point
├── package.json
├── .env.example
└── README.md
```

---

## 🔑 Features

| Feature | Details |
|---|---|
| **UIC Generation** | Auto-generates `UIC-CA-2026-XXXXXX` on registration |
| **Authentication** | JWT + BCrypt password hashing |
| **Role-Based Access** | Applicant vs Admin roles |
| **Document Upload** | PDF, JPG, PNG — up to 10MB |
| **Payment Processing** | Admin assigns fee; applicant pays via dashboard |
| **Status Tracking** | 7 stages from Registered → Completed |
| **Email Notifications** | Welcome email + status update alerts |
| **Rate Limiting** | 100 req/15min general; 10 req/15min for login |
| **Security Headers** | Helmet.js (XSS, CSRF, etc.) |
| **Admin Panel** | Manage all applicants, fees, documents, statuses |
| **Bilingual** | English / French language toggle |

---

## 🔐 Default Admin Login (Demo)
- **Username:** `admin@canada.ca`
- **Password:** `Admin@2026`
- Click **Admin Login** on the login page

---

## 🛠 Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (SPA, no framework needed)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + BCrypt
- **Upload:** Multer
- **Email:** Nodemailer
- **Security:** Helmet, express-rate-limit, CORS

---

## 📧 Contact
FSS Program Office · fss-portal@canada.ca · +1 (613) 944-4000

*© 2026 Government of Canada · Global Affairs Canada*
