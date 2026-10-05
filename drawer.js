/* ============================================================
   SwiftTrust Bank — shared drawer component
   Requires: firebase-config.js loaded before this file
   ============================================================ */

(function () {
  // Only run if there's a hamburger on the page
  const menuBtn = document.getElementById('menuBtn');
  if (!menuBtn) return;

  // ---- Navigation items ----
  const NAV_MAIN = [
    { href: 'dashboard.html', icon: 'fa-house', label: 'Home' },
    { href: 'transfer-internal.html', icon: 'fa-building-columns', label: 'To SwiftTrust' },
    { href: 'transfer-external.html', icon: 'fa-paper-plane', label: 'To Bank' },
    { href: 'save.html', icon: 'fa-lock', label: 'Save' },
    { href: 'stocks.html', icon: 'fa-chart-line', label: 'Stocks' },
  ];
  const NAV_OTHER = [
    { href: 'history.html', icon: 'fa-clock-rotate-left', label: 'Transaction History' },
    { href: 'notifications.html', icon: 'fa-bell', label: 'Notifications' },
    { href: 'profile.html', icon: 'fa-user', label: 'Profile' },
    { href: 'settings.html', icon: 'fa-gear', label: 'Settings' },
    { href: 'help.html', icon: 'fa-circle-question', label: 'Help & Support' },
  ];

  const currentPage = location.pathname.split('/').pop() || 'dashboard.html';

  function itemHTML(item) {
    const active = item.href === currentPage ? ' active' : '';
    return `<a class="drawer-link${active}" href="${item.href}">
      <i class="fas ${item.icon}"></i><span>${item.label}</span>
    </a>`;
  }

  // ---- Inject HTML ----
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'drawerOverlay';

  const drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.id = 'drawerPanel';
  drawer.innerHTML = `
    <div class="drawer-head">
      <div class="drawer-head-inner">
        <div class="drawer-avatar" id="drawerAvatar">—</div>
        <div class="drawer-user">
          <div class="drawer-user-name" id="drawerName">Loading…</div>
          <div class="drawer-user-email" id="drawerEmail">—</div>
          <div class="drawer-user-badge"><i class="fas fa-circle"></i> Active Account</div>
        </div>
      </div>
    </div>
    <nav class="drawer-nav">
      ${NAV_MAIN.map(itemHTML).join('')}
      <div class="drawer-section-label">More</div>
      ${NAV_OTHER.map(itemHTML).join('')}
    </nav>
    <div class="drawer-foot">
      <button class="drawer-signout" id="drawerSignOut">
        <i class="fas fa-arrow-right-from-bracket"></i><span>Sign out</span>
      </button>
      <div class="drawer-version">SwiftTrust Bank v1.0</div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  // ---- Open / close ----
  function openDrawer() {
    overlay.classList.add('show');
    drawer.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    overlay.classList.remove('show');
    drawer.classList.remove('show');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Bottom-nav "Menu" tab also opens drawer (id="bottomNavMenu")
  const bottomMenu = document.getElementById('bottomNavMenu');
  if (bottomMenu) {
    bottomMenu.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }

  // ---- Sign out ----
  document.getElementById('drawerSignOut').addEventListener('click', async () => {
    try { await auth.signOut(); } catch (e) {}
    window.location.href = 'login.html';
  });

  // ---- Fill user info ----
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    const snap = await db.collection('swifttrust_users').doc(user.uid).get();
    if (!snap.exists) return;
    const d = snap.data();
    const initials = (d.fullName || '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('drawerAvatar').textContent = initials;
    document.getElementById('drawerName').textContent = d.fullName || 'Customer';
    document.getElementById('drawerEmail').textContent = d.email || '';
  });
})();