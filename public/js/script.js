/* =============================================
   Canada Development Opportunities Portal
   script.js — Frontend Logic (Canada.ca Design)
   ============================================= */

// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
  lang: 'en',
  currentUser: null,
  applicants: [
    { uic:'UIC-CA-2026-108421', name:'Abebe Bekele',     email:'abebe@example.com',  type:'Individual Consultant', country:'Ethiopia',    status:'Under Review',        fee:'CAD 150' },
    { uic:'UIC-CA-2026-209833', name:'Amina Hassan',     email:'amina@ngo.org',       type:'NGO / Civil Society',  country:'Sudan',       status:'Approved',            fee:'CAD 300' },
    { uic:'UIC-CA-2026-317552', name:'James Oduya',      email:'james@firm.co',       type:'Research Firm',        country:'Kenya',       status:'Documents Submitted', fee:'CAD 500' },
    { uic:'UIC-CA-2026-422198', name:'Fatima Al-Rashid', email:'fatima@example.sd',   type:'Contractor',           country:'South Sudan', status:'Registered',          fee:'Not assigned' },
    { uic:'UIC-CA-2026-531047', name:'Tigist Yohannes',  email:'tigist@example.et',   type:'Individual Consultant', country:'Ethiopia',   status:'Rejected',            fee:'CAD 150' },
  ]
};

const docTypes = [
  { id:'passport',     label:'Passport Copy',          req:true,  status:'pending' },
  { id:'cv',           label:'CV / Resume',             req:true,  status:'pending' },
  { id:'certificates', label:'Academic Certificates',   req:true,  status:'pending' },
  { id:'company_reg',  label:'Company Registration',    req:false, status:'pending' },
  { id:'support',      label:'Supporting Documents',    req:false, status:'pending' },
];

const statusTimeline = [
  { label:'Registered',                     done:true,  date:'June 22, 2026', note:'Account created and UIC assigned' },
  { label:'Documents Submitted',            done:false, date:'—',             note:'Upload passport, CV and certificates' },
  { label:'Under Review',                   done:false, date:'—',             note:'Admin reviews submitted documents' },
  { label:'Additional Information Required',done:false, date:'—',             note:'If additional information is needed' },
  { label:'Approved',                       done:false, date:'—',             note:'Application approved for FSS roster' },
  { label:'Completed',                      done:false, date:'—',             note:'Welcome to the FSS program' },
];

const statusClasses = {
  'Registered':                    'status-registered',
  'Documents Submitted':           'status-submitted',
  'Under Review':                  'status-review',
  'Approved':                      'status-approved',
  'Rejected':                      'status-rejected',
  'Additional Information Required':'status-additional',
  'Completed':                     'status-completed',
};

const translations = {
  en: {
    heroH:    'Canada Development Opportunities Portal',
    heroP:    "Canada's official registration portal for development opportunities in Ethiopia, Sudan, South Sudan and Pan-African programs.",
    abTitle:  'Program Overview',
    elTitle:  'Eligibility Requirements',
    procTitle:'Application Process',
    faqTitle: 'Frequently asked questions',
  },
  fr: {
    heroH:    'Portail des opportunités de développement du Canada',
    heroP:    "Le portail officiel d'inscription du Canada pour les opportunités de développement en Éthiopie, au Soudan, au Soudan du Sud et dans les programmes panafricains.",
    abTitle:  'Aperçu du programme',
    elTitle:  "Conditions d'admissibilité",
    procTitle:'Processus de candidature',
    faqTitle: 'Questions fréquemment posées',
  }
};

// ─── LANGUAGE SPLASH ─────────────────────────────────────────────────────────
function selectLang(lang) {
  state.lang = lang;
  const splash = document.getElementById('lang-splash');
  if (splash) { splash.style.opacity = '0'; splash.style.transition = 'opacity .4s'; setTimeout(() => splash.style.display = 'none', 400); }
  applyTranslations();
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) btn.textContent = lang === 'en' ? 'Français' : 'English';
}

function toggleLang() {
  state.lang = state.lang === 'en' ? 'fr' : 'en';
  applyTranslations();
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) btn.textContent = state.lang === 'en' ? 'Français' : 'English';
  document.querySelectorAll('.gc-lang-switch').forEach(b => { b.textContent = state.lang === 'en' ? 'Français' : 'English'; });
}

function applyTranslations() {
  const t = translations[state.lang];
  const map = { 'hero-h': t.heroH, 'hero-p': t.heroP, 'ab-title': t.abTitle, 'el-title': t.elTitle, 'proc-title': t.procTitle, 'faq-title': t.faqTitle };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = val; });
}

// ─── PAGE NAVIGATION ─────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
  window.scrollTo(0, 0);
}

function scrollSec(id) {
  showPage('page-home');
  setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 120);
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function toast(msg, type = '') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast-msg ' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

// ─── MODALS ──────────────────────────────────────────────────────────────────
function showAdminLogin() { document.getElementById('modal-admin-login').style.display = 'flex'; }
function closeModal(id)   { document.getElementById(id).style.display = 'none'; }

// ─── UIC GENERATOR ───────────────────────────────────────────────────────────
function genUIC() { return 'UIC-CA-2026-' + String(Math.floor(100000 + Math.random() * 900000)); }

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function doRegister() {
  const name    = document.getElementById('reg-name').value.trim();
  const dob     = document.getElementById('reg-dob').value;
  const nat     = document.getElementById('reg-nat').value;
  const passport= document.getElementById('reg-passport').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const phone   = document.getElementById('reg-phone').value.trim();
  const country = document.getElementById('reg-country').value;
  const org     = document.getElementById('reg-org').value.trim();
  const type    = document.getElementById('reg-type').value;
  const pw      = document.getElementById('reg-pw').value;
  const pw2     = document.getElementById('reg-pw2').value;
  const terms   = document.getElementById('reg-terms').checked;

  if (!name||!dob||!nat||!passport||!email||!phone||!country||!type||!pw) { toast('Please fill in all required fields.','error'); return; }
  if (pw.length < 8)  { toast('Password must be at least 8 characters.','error'); return; }
  if (pw !== pw2)     { toast('Passwords do not match.','error'); return; }
  if (!terms)         { toast('Please accept the Terms & Conditions.','error'); return; }

  const uic   = genUIC();
  const today = new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'});
  state.currentUser = { name, dob, nat, passport, email, phone, country, org, type, uic, status:'Registered', regDate:today };
  state.applicants.unshift({ uic, name, email, type, country, status:'Registered', fee:'Not assigned' });

  toast('Registration successful! Your UIC: ' + uic, 'success');
  setupDashboard();
  setTimeout(() => showPage('page-dashboard'), 1200);
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-pw').value;
  if (!email||!pw) { toast('Please enter your email/UIC and password.','error'); return; }
  if (!state.currentUser) {
    state.currentUser = {
      name:'Abebe Bekele', email, phone:'+251 911 234567', nat:'Ethiopian',
      passport:'A1234567', country:'Ethiopia', org:'Development Consulting Ethiopia',
      type:'Individual Consultant', uic:'UIC-CA-2026-108421', status:'Under Review', regDate:'June 15, 2026'
    };
  }
  toast('Sign in successful. Welcome back!','success');
  setupDashboard();
  setTimeout(() => showPage('page-dashboard'), 800);
}

function doLogout() { state.currentUser = null; toast('You have been securely signed out.'); showPage('page-home'); }

// ─── ADMIN ───────────────────────────────────────────────────────────────────
function doAdminLogin() {
  const u = document.getElementById('adm-user').value;
  const p = document.getElementById('adm-pw').value;
  if (!u||!p) { toast('Enter admin credentials.','error'); return; }
  closeModal('modal-admin-login');
  toast('Admin authenticated.','success');
  setupAdminTable();
  setTimeout(() => showPage('page-admin'), 800);
}
function doAdminLogout() { showPage('page-home'); toast('Admin session ended.'); }

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function setupDashboard() {
  const u = state.currentUser;
  if (!u) return;
  const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
  ['dash-avatar','dash-name','dash-uic-small','dash-uic-main','dash-uic-stat','dash-uic-banner'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id==='dash-avatar') el.textContent = initials;
    else if (id==='dash-name') el.textContent = u.name;
    else el.textContent = u.uic;
  });
  if (document.getElementById('dash-status-stat')) document.getElementById('dash-status-stat').textContent = u.status||'Registered';

  // Profile
  const pg = document.getElementById('profile-grid');
  if (pg) pg.innerHTML = [
    ['Full Name',u.name],['Email',u.email],['Phone',u.phone],['Nationality',u.nat],
    ['Passport',u.passport],['Country',u.country],['Organization',u.org||'—'],['Type',u.type]
  ].map(([l,v])=>`<div><div class="pf-label">${l}</div><div class="pf-val">${v||'—'}</div></div>`).join('');
  const profUic = document.getElementById('prof-uic');
  if (profUic) profUic.textContent = u.uic;

  // Status steps
  const ss = document.getElementById('dash-status-steps');
  if (ss) ss.innerHTML = [
    { icon:'✓', label:'Registration complete', sub:u.regDate||'June 22, 2026', done:true },
    { icon:'↑', label:'Documents pending',     sub:'Upload passport, CV and certificates', done:false },
    { icon:'🔍',label:'Under review',           sub:'Waiting for document submission', done:false },
    { icon:'✓', label:'Decision',              sub:'Pending', done:false },
  ].map(s=>`<div style="display:flex;align-items:center;gap:12px;padding:8px 0;${!s.done?'opacity:.5':''}">
    <div style="width:32px;height:32px;border-radius:50%;background:${s.done?'var(--success)':'#e5e7eb'};color:${s.done?'#fff':'#9ca3af'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px">${s.icon}</div>
    <div><div style="font-size:13px;font-weight:${s.done?'700':'400'}">${s.label}</div><div style="font-size:11px;color:var(--muted)">${s.sub}</div></div></div>`).join('');

  renderDocList();

  // Timeline
  const tl = document.getElementById('status-timeline');
  if (tl) tl.innerHTML = statusTimeline.map(s=>`
    <div class="timeline-item">
      <div class="tl-dot ${s.done?'done':'pending'}">${s.done?'✓':'○'}</div>
      <div><div class="tl-label ${s.done?'':'pending'}">${s.label}</div><div class="tl-meta">${s.date} · ${s.note}</div></div>
    </div>`).join('');

  showDashTab('overview');
}

function renderDocList() {
  const dl = document.getElementById('doc-upload-list');
  if (!dl) return;
  dl.innerHTML = docTypes.map(d=>`
    <div class="doc-row">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">📄</span>
        <div><div class="doc-name">${d.label}${d.req?' <span style="color:var(--red)">*</span>':''}</div>
        <div class="doc-status ${d.status==='uploaded'?'ok':''}">${d.status==='uploaded'?'✓ Uploaded':'Pending upload'}</div></div>
      </div>
      <button class="btn btn-outline-dark btn-sm" onclick="uploadDoc('${d.id}')">Upload</button>
    </div>`).join('');
}

function showDashTab(tab) {
  ['overview','profile','documents','payment','status','messages','settings'].forEach(t => {
    const el = document.getElementById('dtab-'+t);
    if (el) { el.style.display = ''; el.classList.toggle('d-none', t!==tab); }
  });
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', !!(el.getAttribute('onclick')&&el.getAttribute('onclick').includes("'"+tab+"'")));
  });
}

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────
function uploadDoc(id) {
  const d = docTypes.find(x=>x.id===id);
  if (d) { d.status='uploaded'; toast(d.label+' uploaded successfully.','success'); renderDocList(); }
}
function simulateUpload() {
  const p = docTypes.find(d=>d.status==='pending');
  if (p) uploadDoc(p.id); else toast('All documents have been uploaded.','success');
}

// ─── FLUTTERWAVE PAYMENT ─────────────────────────────────────────────────────
let _flwTxRef = null;

async function initiateFlutterwavePayment() {
  const u = state.currentUser;
  if (!u) { toast('Please sign in first.','error'); return; }
  const btn = document.querySelector('#pay-action-area button');
  if (btn) { btn.disabled=true; btn.textContent='Preparing payment...'; }

  const txRef = 'FSS-'+u.uic+'-'+Date.now();
  _flwTxRef = txRef;

  const payload = {
    public_key:      'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X',
    tx_ref:          txRef,
    amount:          150,
    currency:        'USD',
    payment_options: 'card,mobilemoney,ussd,banktransfer',
    customer: { email: u.email||'applicant@example.com', phonenumber: u.phone||'', name: u.name },
    customizations: {
      title:       'Canada FSS Portal',
      description: 'Application Processing Fee — '+u.uic,
      logo:        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/200px-Flag_of_Canada_%28Pantone%29.svg.png',
    },
    meta: { uic: u.uic },
    callback:  (response) => onFlutterwaveSuccess(response),
    onclose:   ()         => { toast('Payment window closed. You can retry anytime.'); if (btn) { btn.disabled=false; btn.textContent='🔒 Pay Securely with Flutterwave'; } },
  };

  if (typeof FlutterwaveCheckout === 'undefined') {
    if (btn) { btn.disabled=false; btn.textContent='🔒 Pay Securely with Flutterwave'; }
    simulateFlutterwaveSuccess(txRef); return;
  }
  FlutterwaveCheckout(payload);
  if (btn) { btn.disabled=false; btn.textContent='🔒 Pay Securely with Flutterwave'; }
}

function onFlutterwaveSuccess(response) {
  if (response.status==='successful') showPaymentSuccess(response.tx_ref, response.transaction_id, response.amount, response.currency);
  else toast('Payment was not completed. Please try again.','error');
}

function simulateFlutterwaveSuccess(txRef) {
  toast('Demo: Simulating successful Flutterwave payment...','');
  setTimeout(() => showPaymentSuccess(txRef,'TXN-'+Date.now(),150,'USD'), 1800);
}

function showPaymentSuccess(txRef, txId, amount, currency) {
  const receipt = 'RCP-CA-'+Date.now();
  const date = new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'});
  const actionArea  = document.getElementById('pay-action-area');
  const successArea = document.getElementById('pay-success-area');
  const feeBadge    = document.getElementById('pay-fee-status');
  if (actionArea)  actionArea.classList.add('d-none');
  if (successArea) successArea.classList.remove('d-none');
  if (feeBadge)    { feeBadge.textContent='Paid'; feeBadge.className='status status-approved'; }
  const rd = document.getElementById('pay-receipt-display');
  if (rd) rd.textContent = 'Receipt: '+receipt+' · '+date;

  const ph = document.getElementById('payment-history');
  if (ph) ph.innerHTML=`<table><thead><tr><th>Date</th><th>Description</th><th>Transaction ID</th><th>Amount</th><th>Method</th><th>Receipt</th></tr></thead>
    <tbody><tr><td>${date}</td><td>Application Processing Fee</td><td style="font-family:monospace;font-size:11px">${txId}</td>
    <td style="font-weight:700;color:var(--success)">${amount} ${currency}</td><td>Flutterwave</td>
    <td><button class="btn btn-outline-dark btn-sm" onclick="printReceipt('${receipt}','${date}','${txId}','${amount}','${currency}')">Download</button></td>
    </tr></tbody></table>`;
  toast('Payment of '+amount+' '+currency+' confirmed! Receipt: '+receipt,'success');
}

function printReceipt(receiptNo,date,txId,amount,currency) {
  const u = state.currentUser||{};
  const w = window.open('','_blank','width=720,height:940');
  w.document.write(`<!DOCTYPE html><html><head><title>Official Receipt — ${receiptNo}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;color:#333;max-width:680px;margin:0 auto}
.hdr{background:#AF3C43;color:#fff;padding:20px 28px;border-radius:3px;margin-bottom:6px}
.hdr h2{margin:0;font-size:18px}.hdr p{margin:4px 0 0;font-size:12px;opacity:.85}
.sub-hdr{background:#26374A;color:#fff;padding:8px 28px;font-size:13px;margin-bottom:28px}
.box{border:1px solid #ddd;border-radius:3px;padding:24px}
.seal{text-align:center;font-size:48px;margin:16px 0}
.ok{color:#278400;font-size:20px;font-weight:700;text-align:center;margin-bottom:20px}
table{width:100%;border-collapse:collapse;font-size:14px}
td{padding:10px 0;border-bottom:1px solid #f0f0f0}
td:first-child{color:#666;width:45%}td:last-child{font-weight:600}
.ftr{text-align:center;color:#999;font-size:11px;margin-top:32px;line-height:1.8}
.wordmark{font-family:Georgia,serif;font-size:22px;font-weight:bold}
</style></head><body>
<div class="hdr"><h2>🇨🇦 Canada Development Opportunities Portal</h2><p>Field Support Services (FSS) Program · Global Affairs Canada · OFFICIAL RECEIPT</p></div>
<div class="sub-hdr">Government of Canada / Gouvernement du Canada</div>
<div class="box">
<div class="seal">🔒</div><div class="ok">✓ Payment Confirmed</div>
<table>
<tr><td>Receipt Number</td><td style="color:#AF3C43;font-family:monospace">${receiptNo}</td></tr>
<tr><td>UIC</td><td style="font-family:monospace">${u.uic||'—'}</td></tr>
<tr><td>Applicant Name</td><td>${u.name||'—'}</td></tr>
<tr><td>Email Address</td><td>${u.email||'—'}</td></tr>
<tr><td>Payment Date</td><td>${date}</td></tr>
<tr><td>Amount Paid</td><td style="color:#278400;font-size:18px">${amount} ${currency}</td></tr>
<tr><td>Transaction ID</td><td style="font-family:monospace;font-size:12px">${txId}</td></tr>
<tr><td>Payment Gateway</td><td>Flutterwave</td></tr>
<tr><td>Description</td><td>FSS Program — Application Processing Fee</td></tr>
<tr><td>Status</td><td style="color:#278400;font-weight:700">✓ PAID</td></tr>
</table></div>
<div class="ftr">
Government of Canada · Global Affairs Canada<br>
125 Sussex Drive, Ottawa ON K1A 0G2 · fss-portal@canada.ca · +1 (613) 944-4000<br>
This is an official computer-generated receipt. No signature required.<br>
<span class="wordmark">Canad<span style="background:#CC0000;color:#fff;padding:0 3px;font-size:16px">a</span></span><br>
© 2026 Government of Canada
</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
  w.document.close();
}

function downloadReceipt() { const b = document.querySelector('#payment-history button'); if (b) b.click(); }
function doPayment() { initiateFlutterwavePayment(); }

// ─── STATUS CHECK ─────────────────────────────────────────────────────────────
function checkStatus() {
  const q = document.getElementById('status-query').value.trim();
  const r = document.getElementById('status-result');
  if (!q) { toast('Please enter a UIC or email address.','error'); return; }
  const found = state.applicants.find(a => a.uic.toLowerCase()===q.toLowerCase()||a.email.toLowerCase()===q.toLowerCase());
  r.classList.remove('d-none'); r.style.display='';
  if (found) {
    r.innerHTML=`<div class="alert alert-success"><div><strong>Application found</strong><br>
    Name: ${found.name}<br>UIC: <span style="font-family:monospace">${found.uic}</span><br>
    Status: <span class="status ${statusClasses[found.status]||'status-registered'}">${found.status}</span></div></div>`;
  } else {
    r.innerHTML=`<div class="alert alert-error">No application found for "<strong>${q}</strong>". Please check your UIC number or email address.</div>`;
  }
}

// ─── ADMIN TABLE ──────────────────────────────────────────────────────────────
function setupAdminTable(filter='',statusFilter='') {
  const tbody = document.getElementById('admin-tbody');
  if (!tbody) return;
  const data = state.applicants.filter(a => {
    const q = filter.toLowerCase();
    const sm = !statusFilter||a.status===statusFilter;
    return sm&&(!q||(a.name.toLowerCase().includes(q)||a.uic.toLowerCase().includes(q)||a.email.toLowerCase().includes(q)));
  });
  tbody.innerHTML = data.map(a=>`<tr>
    <td style="font-family:monospace;font-size:11px">${a.uic}</td>
    <td style="font-weight:600">${a.name}</td>
    <td style="font-size:12px">${a.email}</td>
    <td style="font-size:12px">${a.type}</td>
    <td>${a.country}</td>
    <td><span class="status ${statusClasses[a.status]||'status-registered'}">${a.status}</span></td>
    <td style="font-size:13px">${a.fee}</td>
    <td><div style="display:flex;gap:4px">
      <button class="btn btn-success btn-sm" onclick="changeStatus('${a.uic}','Approved')" title="Approve">✓</button>
      <button class="btn btn-danger btn-sm" onclick="changeStatus('${a.uic}','Rejected')" title="Reject">✗</button>
      <button class="btn btn-outline-dark btn-sm" onclick="toast('Viewing docs for ${a.name}','')" title="Documents">📄</button>
    </div></td></tr>`).join('');
}

function filterApplicants(v) { setupAdminTable(v, document.querySelector('#atab-applicants select')?.value||''); }
function filterByStatus(v)    { setupAdminTable(document.querySelector('#atab-applicants input')?.value||'',v); }
function changeStatus(uic,ns) {
  const a = state.applicants.find(x=>x.uic===uic);
  if (a) { a.status=ns; setupAdminTable(); toast(a.name+' status updated to '+ns+'.','success'); }
}
function assignFee() {
  const uic = document.getElementById('fee-uic').value.trim();
  const cat = document.getElementById('fee-cat').value;
  const a = state.applicants.find(x=>x.uic===uic);
  if (a) { a.fee=(cat.split('—')[1]||'').trim(); toast('Fee assigned to '+a.name+'.','success'); }
  else toast('UIC not found.','error');
}

// ─── ADMIN TABS ───────────────────────────────────────────────────────────────
function showAdminTab(tab, el) {
  ['applicants','fees','reports'].forEach(t => {
    const d = document.getElementById('atab-'+t);
    if (d) d.classList.toggle('d-none', t!==tab);
  });
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  if (el) el.classList.add('active');
  if (tab==='reports') renderReports();
}

function renderReports() {
  const countries=[{n:'Ethiopia',v:520},{n:'Sudan',v:310},{n:'South Sudan',v:180},{n:'Kenya',v:140},{n:'Other',v:90}];
  const maxC = Math.max(...countries.map(c=>c.v));
  const cb=document.getElementById('country-bars');
  if (cb) cb.innerHTML=countries.map(c=>`<div class="progress-wrap"><div class="progress-meta"><span>${c.n}</span><span>${c.v}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.round(c.v/maxC*100)}%"></div></div></div>`).join('');
  const statuses=[{n:'Approved',v:876,c:'var(--success)'},{n:'Under Review',v:342,c:'var(--warn)'},{n:'Registered',v:200,c:'var(--info)'},{n:'Rejected',v:22,c:'var(--red)'}];
  const sb=document.getElementById('status-bars');
  if (sb) sb.innerHTML=statuses.map(s=>`<div class="progress-wrap"><div class="progress-meta"><span>${s.n}</span><span>${s.v}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.round(s.v/876*100)}%;background:${s.c}"></div></div></div>`).join('');
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function toggleFaq(el) {
  const a = el.nextElementSibling;
  a.classList.toggle('open');
  el.parentElement.classList.toggle('open');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupAdminTable();
});
