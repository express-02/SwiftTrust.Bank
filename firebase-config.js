// ============================================
// SwiftTrust Bank — shared Firebase config
// Used by every SwiftTrust page
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyAueqbCcGN_LKDTd6YnPkPcWSIufFqsqwM",
  authDomain: "fedex-4bdba.firebaseapp.com",
  projectId: "fedex-4bdba",
  storageBucket: "fedex-4bdba.firebasestorage.app",
  messagingSenderId: "770647474446",
  appId: "1:770647474446:web:8a3a4c595b2286e7ab575f"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// SwiftTrust admin (same person as Express Trade)
const STB_ADMIN_EMAIL = 'avaboremiracle@gmail.com';

// ---------------------------------------------
// Helpers shared by all pages
// ---------------------------------------------

// Money formatter: 1234.5 -> $1,234.50
function stbMoney(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Date formatter for Firestore timestamps
function stbDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

// 10-digit account number (looks like a real US account)
function stbGenAccountNumber() {
  let s = '';
  for (let i = 0; i < 10; i++) s += Math.floor(Math.random() * 10);
  return s;
}

// 9-digit routing number
function stbGenRoutingNumber() {
  let s = '';
  for (let i = 0; i < 9; i++) s += Math.floor(Math.random() * 10);
  return s;
}

// Transfer reference like STB-20261001-4821
function stbGenReference() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const r = Math.floor(1000 + Math.random() * 9000);
  return `STB-${y}${m}${day}-${r}`;
}

// Simple PIN hash (demo only — NOT production-grade)
function stbHashPin(pin) {
  return btoa('stb$' + pin + '$2026');
}

// Toast notifications
function stbToast(msg, type) {
  let el = document.getElementById('stb-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'stb-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'stb-toast show' + (type ? ' ' + type : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'stb-toast'; }, 2800);
}

// Redirect to login if not signed in (call at top of protected pages)
function stbRequireAuth() {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      if (!user) {
        window.location.href = 'login.html';
      } else {
        resolve(user);
      }
    });
  });
}