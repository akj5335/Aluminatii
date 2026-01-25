/* --- Global State & Utilities --- */

// API Base URL (Should match backend port)
const API_BASE_URL = 'http://localhost:5000';

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  // Using standard font awesome classes
  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const colorClass = type === 'success' ? 'text-green-500' : 'text-red-500';

  toast.innerHTML = `
        <i class="fa-solid ${iconClass} ${colorClass} text-xl"></i>
        <div>
            <h4 class="font-bold text-sm">${type === 'success' ? 'Success' : 'Error'}</h4>
            <p class="text-sm text-slate-500">${message}</p>
        </div>
    `;

  document.body.appendChild(toast);

  // Auto remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Navbar Injection (Dynamic)
function injectNavbar() {
  // Check if nav already exists to prevent duplicate
  if (document.getElementById('main-nav')) return;

  const user = getUser();
  const userPhoto = (user && user.photoURL) ? user.photoURL : `https://ui-avatars.com/api/?name=${(user && user.name) ? user.name : 'User'}`;
  const loggedIn = isLoggedIn();

  const navbarHTML = `
    <nav class="fixed w-full z-50 transition-all duration-300 glass-nav" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <!-- Logo -->
                <a href="index.html" class="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">A</div>
                    <span class="font-heading font-bold text-2xl tracking-tight text-slate-900 dark:text-white">Aluminati</span>
                </a>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="index.html#features" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Features</a>
                    ${isLoggedIn() ? `
                        <a href="dashboard.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Dashboard</a>
                        <a href="messages.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Messages</a>
                        <a href="posts.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Feed</a>
                        <a href="directory.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Directory</a>
                        <a href="mentorship.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Mentorship</a>
                        <a href="events.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Events</a>
                        <a href="jobs.html" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Jobs</a>
                    ` : `
                        <a href="index.html#community" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Community</a>
                    `}
                    
                    ${loggedIn ? `
                        <div class="relative">
                            <button onclick="toggleNotifications()" class="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <i class="fa-regular fa-bell"></i>
                                <span id="notif-badge" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">0</span>
                            </button>
                            <div id="notifications-panel" class="hidden absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                                <div class="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                                    <h3 class="font-bold text-slate-900 dark:text-white">Notifications</h3>
                                    <button onclick="markAllNotificationsRead()" class="text-xs text-primary hover:underline">Mark all read</button>
                                </div>
                                <div id="notifications-list" class="max-h-96 overflow-y-auto">
                                    <div class="p-8 text-center text-slate-500">Loading...</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <button onclick="toggleTheme()" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <i class="fa-solid fa-moon dark:hidden"></i>
                        <i class="fa-solid fa-sun hidden dark:block text-yellow-500"></i>
                    </button>

                    ${loggedIn ? `
                        <div class="relative group">
                            <button class="flex items-center gap-2 focus:outline-none">
                                <img src="${userPhoto}" class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover">
                            </button>
                            <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 hidden group-hover:block fade-in">
                                <a href="profile.html" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">My Profile</a>
                                <button onclick="logout()" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign Out</button>
                            </div>
                        </div>
                    ` : `
                        <button onclick="openModal('login')" class="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Log In</button>
                        <button onclick="openModal('signup')" class="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">Join Now</button>
                    `}
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden flex items-center gap-4">
                     <button onclick="toggleTheme()" class="text-slate-600 dark:text-slate-300 text-xl">
                        <i class="fa-solid fa-moon dark:hidden"></i>
                        <i class="fa-solid fa-sun hidden dark:block text-yellow-500"></i>
                    </button>
                    <button onclick="toggleMobileMenu()" class="text-slate-600 dark:text-slate-300 hover:text-primary focus:outline-none text-2xl">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 absolute w-full left-0 top-20 shadow-xl">
            <div class="px-4 pt-2 pb-6 space-y-2">
                 ${isLoggedIn() ? `
                    <a href="dashboard.html" class="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">Dashboard</a>
                    <a href="posts.html" class="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">Feed</a>
                    <a href="directory.html" class="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">Directory</a>
                    <a href="mentorship.html" class="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">Mentorship</a>
                    <a href="events.html" class="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">Events</a>
                    <a href="jobs.html" class="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">Jobs</a>
                    <button onclick="logout()" class="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign Out</button>
                ` : `
                     <button onclick="openModal('login')" class="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold mb-2">Log In</button>
                     <button onclick="openModal('signup')" class="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30">Get Started</button>
                `}
            </div>
        </div>
    </nav>
    <div class="h-20"></div>`;

  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}

// Auth Helpers
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Logged out successfully');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

function openModal(mode = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  // Update visible forms based on mode
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const title = document.getElementById('modal-title');

  if (loginForm && signupForm && title) {
    loginForm.classList.toggle('hidden', mode !== 'login');
    signupForm.classList.toggle('hidden', mode !== 'signup');
    title.textContent = mode === 'login' ? 'Welcome Back' : 'Create Account';
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    const backdrop = document.getElementById('modal-backdrop');
    const content = document.getElementById('modal-content');
    if (backdrop) backdrop.classList.remove('opacity-0');
    if (content) {
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }
  }, 10);
}

function closeModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  const backdrop = document.getElementById('modal-backdrop');
  const content = document.getElementById('modal-content');

  if (backdrop) backdrop.classList.add('opacity-0');
  if (content) {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
  }

  setTimeout(() => modal.classList.add('hidden'), 300);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  injectNavbar();
});

// Expose functions globally for HTML onclick
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.openModal = openModal;
window.closeModal = closeModal;
window.logout = logout;
window.showToast = showToast;

// Notification Functions
let notificationsLoaded = false;

window.toggleNotifications = async function () {
  const panel = document.getElementById('notifications-panel');
  if (!panel) return;

  panel.classList.toggle('hidden');

  if (!notificationsLoaded && !panel.classList.contains('hidden')) {
    await loadNotifications();
    notificationsLoaded = true;
  }
};

async function loadNotifications() {
  if (!isLoggedIn()) return;

  try {
    const data = await apiFetch('/api/notifications');
    const { notifications, unreadCount } = data;

    // Update badge
    const badge = document.getElementById('notif-badge');
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    // Render notifications
    const list = document.getElementById('notifications-list');
    if (!list) return;

    if (notifications.length === 0) {
      list.innerHTML = '<div class="p-8 text-center text-slate-500">No notifications yet</div>';
      return;
    }

    list.innerHTML = notifications.map(n => {
      const time = new Date(n.createdAt).toLocaleDateString();
      const icon = getNotificationIcon(n.type);
      return `
        <div class="p-4 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}" onclick="handleNotificationClick('${n._id}', '${n.link || '#'}')">
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary shrink-0">
              <i class="${icon}"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-900 dark:text-white">${n.title}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${n.message}</p>
              <p class="text-xs text-slate-400 mt-1">${time}</p>
            </div>
            ${!n.read ? '<div class="w-2 h-2 bg-primary rounded-full shrink-0"></div>' : ''}
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load notifications:', err);
  }
}

function getNotificationIcon(type) {
  const icons = {
    connection_request: 'fa-solid fa-user-plus',
    connection_accepted: 'fa-solid fa-handshake',
    event_reminder: 'fa-solid fa-calendar',
    job_match: 'fa-solid fa-briefcase',
    post_like: 'fa-solid fa-heart',
    post_comment: 'fa-solid fa-comment',
    mentorship_request: 'fa-solid fa-graduation-cap'
  };
  return icons[type] || 'fa-solid fa-bell';
}

window.handleNotificationClick = async function (id, link) {
  try {
    await apiFetch(`/api/notifications/${id}/read`, 'PATCH');
    if (link && link !== '#') {
      window.location.href = link;
    }
    notificationsLoaded = false; // Reload on next open
  } catch (err) {
    console.error(err);
  }
};

window.markAllNotificationsRead = async function () {
  try {
    await apiFetch('/api/notifications/read-all', 'PATCH');
    showToast('All notifications marked as read');
    notificationsLoaded = false;
    await loadNotifications();
  } catch (err) {
    showToast('Failed to mark notifications as read', 'error');
  }
};

// Auto-load notification count on page load
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    loadNotifications();
  }
});
