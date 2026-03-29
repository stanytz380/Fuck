export function showToast(message: string, type: 'success'|'error'|'info' = 'info') {
  const wrap = document.getElementById('toastWrap')!;
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}