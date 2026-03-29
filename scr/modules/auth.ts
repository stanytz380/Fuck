import { auth, db } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { showToast } from './ui';

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await update(ref(db, `users/${result.user.uid}`), {
      email: result.user.email,
      display_name: result.user.displayName,
      photo_url: result.user.photoURL,
      last_login: Date.now(),
      status: 'active'
    });
    showToast(`Signed in as ${result.user.displayName}`, 'success');
  } catch (e: any) {
    if (e.code !== 'auth/popup-closed-by-user') showToast('Sign in failed', 'error');
  }
}

export function logoutUser() {
  signOut(auth).then(() => showToast('Logged out', 'success'));
}

export function skipLogin() {
  localStorage.setItem('skipLogin', 'true');
  const skipBtn = document.getElementById('skipButton');
  if (skipBtn) skipBtn.classList.add('hidden');
  showToast('Continuing as guest', 'success');
}

export function updateProfileUI(user: User | null) {
  const sUserPhoto = document.getElementById('sUserPhoto') as HTMLImageElement;
  const sUserName = document.getElementById('sUserName') as HTMLElement;
  const sUserEmail = document.getElementById('sUserEmail') as HTMLElement;
  const googleBtn = document.getElementById('googleSignInBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (user) {
    sUserPhoto.src = user.photoURL || 'https://via.placeholder.com/55/1a1a1a/666?text=?';
    sUserName.textContent = user.displayName || 'User';
    sUserEmail.textContent = user.email || '';
    googleBtn?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
  } else {
    sUserPhoto.src = 'https://via.placeholder.com/55/1a1a1a/666?text=?';
    sUserName.textContent = 'Guest User';
    sUserEmail.textContent = 'Not logged in';
    googleBtn?.classList.remove('hidden');
    logoutBtn?.classList.add('hidden');
  }
}