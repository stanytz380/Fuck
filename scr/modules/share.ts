import { showToast } from './ui';

export function openShare() {
  const shareData = {
    title: 'STANY MIN TV',
    text: 'Watch the best movies, live channels, and exclusive content on STANY MIN TV.',
    url: window.location.href
  };
  if (navigator.share) {
    navigator.share(shareData).catch(err => {
      if (err.name !== 'AbortError') copyLinkFallback();
    });
  } else {
    copyLinkFallback();
  }
}

function copyLinkFallback() {
  const dummy = document.createElement('textarea');
  dummy.value = window.location.href;
  document.body.appendChild(dummy);
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  showToast('Link copied to clipboard!', 'success');
}