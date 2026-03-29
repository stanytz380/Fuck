import { showToast } from './ui';

let enteredPin = '';
let pinLength = 4;

export function initPinLock() {
  const pinLock = document.getElementById('pinLock')!;
  const pinDots = document.getElementById('pinDots')!;
  const pinKeypad = document.getElementById('pinKeypad')!;
  
  const savedPin = localStorage.getItem('appPin');
  const enabled = localStorage.getItem('appLockEnabled') === 'true';
  if (enabled && savedPin) {
    pinLength = savedPin.length;
    renderPinDots(pinDots);
    pinLock.classList.remove('hidden');
    setupKeypad(pinKeypad);
  }
}

function renderPinDots(container: HTMLElement) {
  container.innerHTML = '';
  for (let i = 0; i < pinLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'pin-dot';
    if (i < enteredPin.length) dot.classList.add('filled');
    container.appendChild(dot);
  }
}

function setupKeypad(container: HTMLElement) {
  const digits = ['1','2','3','4','5','6','7','8','9','0'];
  container.innerHTML = '';
  digits.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'pin-key';
    btn.textContent = d;
    btn.onclick = () => pinInput(d);
    container.appendChild(btn);
  });
  const empty = document.createElement('button');
  empty.className = 'pin-key empty';
  container.appendChild(empty);
  const backspace = document.createElement('button');
  backspace.className = 'pin-key backspace';
  backspace.innerHTML = '<i class="fas fa-backspace"></i>';
  backspace.onclick = pinBackspace;
  container.appendChild(backspace);
}

function pinInput(digit: string) {
  const pinDots = document.getElementById('pinDots')!;
  const savedPin = localStorage.getItem('appPin')!;
  if (enteredPin.length >= pinLength) return;
  enteredPin += digit;
  renderPinDots(pinDots);
  if (enteredPin.length === pinLength) {
    if (enteredPin === savedPin) {
      document.getElementById('pinLock')!.classList.add('hidden');
      enteredPin = '';
    } else {
      document.querySelectorAll('#pinDots .pin-dot').forEach(d => d.classList.add('error'));
      setTimeout(() => {
        enteredPin = '';
        renderPinDots(pinDots);
      }, 500);
      showToast('Incorrect PIN', 'error');
    }
  }
}

function pinBackspace() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    renderPinDots(document.getElementById('pinDots')!);
  }
}