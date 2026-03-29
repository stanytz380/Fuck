import './styles.css';
import { auth } from './config/firebase';
import { loadMovies } from './modules/movies';
import { googleSignIn, logoutUser, skipLogin, updateProfileUI } from './modules/auth';
import { openShare } from './modules/share';
import { initPinLock } from './modules/pinlock';
import { initChat, loadChat } from './modules/chat';
import { initPlayer } from './modules/player';
import { showToast } from './utils/helpers';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader after a delay
  setTimeout(() => {
    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
  
  initPinLock();
  initChat();
  initPlayer();
  
  // Attach global UI event listeners
  document.getElementById('shareBtn')?.addEventListener('click', openShare);
  document.getElementById('shareSettingsBtn')?.addEventListener('click', openShare);
  document.getElementById('googleSignInBtn')?.addEventListener('click', googleSignIn);
  document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
  document.getElementById('skipButton')?.addEventListener('click', skipLogin);
  
  // Search overlay
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchBtn?.addEventListener('click', () => searchOverlay?.classList.add('show'));
  closeSearchBtn?.addEventListener('click', () => searchOverlay?.classList.remove('show'));
  searchInput?.addEventListener('input', handleSearch);
  
  // Settings page navigation
  const settingsBtn = document.getElementById('settingsBtn');
  settingsBtn?.addEventListener('click', () => openPage('settings'));
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = (item as HTMLElement).dataset.page;
      if (page) openPage(page);
    });
  });
  
  // Load movies data
  loadMovies();
  
  // Auth state observer
  auth.onAuthStateChanged(user => {
    updateProfileUI(user);
    if (user && !localStorage.getItem('skipLogin')) {
      // user is logged in
    }
    // update comment area
    updateCommentInput();
    if (document.getElementById('chatPage')?.classList.contains('show')) {
      loadChat();
    }
  });
});

function openPage(page: string) {
  const home = document.getElementById('homePage')!;
  const settings = document.getElementById('settingsPage')!;
  const chat = document.getElementById('chatPage')!;
  const seeAll = document.getElementById('seeAllPage')!;
  const details = document.getElementById('detailsPage')!;
  home.style.display = 'none';
  settings.classList.remove('show');
  chat.classList.remove('show');
  seeAll.classList.remove('show');
  details.classList.remove('show');
  
  if (page === 'home') home.style.display = 'block';
  else if (page === 'settings') settings.classList.add('show');
  else if (page === 'chat') {
    chat.classList.add('show');
    loadChat();
  }
  // update active nav
  document.querySelectorAll('.nav-item').forEach(nav => {
    nav.classList.toggle('active', (nav as HTMLElement).dataset.page === page);
  });
}

function handleSearch() {
  // implement search
}

function updateCommentInput() {
  // implement
}