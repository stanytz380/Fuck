import { db } from '../config/firebase';
import { ref, push, onValue, off, query, limitToLast } from 'firebase/database';
import { auth } from '../config/firebase';
import { showToast } from './ui';

let chatListener: any = null;

export function initChat() {
  const sendBtn = document.getElementById('chatSendBtn');
  const input = document.getElementById('chatInput') as HTMLInputElement;
  sendBtn?.addEventListener('click', sendChat);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
  });
}

function sendChat() {
  const input = document.getElementById('chatInput') as HTMLInputElement;
  const text = input.value.trim();
  if (!text) return;
  if (!auth.currentUser) {
    showToast('Sign in to chat', 'error');
    return;
  }
  const msgRef = ref(db, 'global_chat');
  push(msgRef, {
    user_id: auth.currentUser.uid,
    username: auth.currentUser.displayName || 'User',
    user_photo: auth.currentUser.photoURL || '',
    text: text,
    timestamp: Date.now()
  });
  input.value = '';
}

export function loadChat() {
  const container = document.getElementById('chatMessages') as HTMLElement;
  if (chatListener) off(ref(db, 'global_chat'), 'value', chatListener);
  const chatRef = query(ref(db, 'global_chat'), limitToLast(50));
  chatListener = onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>No messages yet!</p></div>';
      return;
    }
    const messages = Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp);
    const uid = auth.currentUser?.uid;
    container.innerHTML = messages.map((m: any) => {
      const mine = uid && m.user_id === uid;
      return `<div class="chat-msg ${mine ? 'sent' : 'received'}">
        <div>${escapeHtml(m.text)}</div>
        <div class="msg-meta"><span>${mine ? 'You' : (m.username || 'Anonymous')}</span><span>${formatTimeShort(m.timestamp)}</span></div>
      </div>`;
    }).join('');
    container.scrollTop = container.scrollHeight;
  });
}

function escapeHtml(s: string) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function formatTimeShort(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}