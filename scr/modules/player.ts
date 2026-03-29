import { db } from '../config/firebase';
import { ref, get } from 'firebase/database';
import { Movie } from '../types';
import { showToast } from './ui';
import { allMovies, getMovieById } from './movies';

let currentMovieId: string | null = null;
let currentMovieData: Movie | null = null;
let videoPlayer: HTMLVideoElement | null = null;
let trailerFloat: HTMLElement;
let videoPlayerFloat: HTMLElement;

export function initPlayer() {
  trailerFloat = document.getElementById('trailerFloat')!;
  videoPlayerFloat = document.getElementById('videoPlayerFloat')!;
  videoPlayer = document.getElementById('vpVideo') as HTMLVideoElement;
  // attach event listeners
  document.getElementById('openTrailerBtn')?.addEventListener('click', openTrailerFloat);
  document.getElementById('playMovieBtn')?.addEventListener('click', openVideoPlayer);
  document.getElementById('downloadBtn')?.addEventListener('click', showQualityModal);
  document.getElementById('trailerCloseBtn')?.addEventListener('click', closeTrailerFloat);
  document.getElementById('vpCloseBtn')?.addEventListener('click', closeVideoPlayer);
  document.getElementById('trailerFullscreenBtn')?.addEventListener('click', toggleTrailerFullscreen);
  document.getElementById('vpFullscreenBtn')?.addEventListener('click', toggleVPFullscreen);
  document.getElementById('trailerMinimizeBtn')?.addEventListener('click', minimizeTrailer);
  document.getElementById('vpMinimizeBtn')?.addEventListener('click', minimizeVP);
  document.querySelectorAll('.vp-quality-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const quality = (btn as HTMLElement).dataset.quality;
      if (quality) playMovieQuality(quality);
    });
  });
}

export async function openMovieDetails(movieId: string) {
  currentMovieId = movieId;
  // push state later
  try {
    const snapshot = await get(ref(db, `movies/${movieId}`));
    currentMovieData = snapshot.val() as Movie;
    if (!currentMovieData) {
      showToast('Movie not found', 'error');
      return;
    }
    hideAllPages();
    document.getElementById('detailsPage')!.classList.add('show');
    window.scrollTo(0, 0);
    populateMovieDetails(currentMovieData);
  } catch (e) {
    showToast('Error loading movie', 'error');
  }
}

function populateMovieDetails(movie: Movie) {
  // populate all fields
  (document.getElementById('dBackdrop') as HTMLImageElement).src = movie.backdrop_url || '';
  const posterSrc = movie.poster_url || 'https://via.placeholder.com/180x270/111/555?text=No+Poster';
  (document.getElementById('dPoster') as HTMLImageElement).src = posterSrc;
  (document.getElementById('dPosterReflection') as HTMLImageElement).src = posterSrc;
  const logoWrap = document.getElementById('dLogoWrap')!;
  const dLogo = document.getElementById('dLogo') as HTMLImageElement;
  if (movie.logo_url) {
    dLogo.src = movie.logo_url;
    logoWrap.style.display = 'block';
    dLogo.onerror = () => { logoWrap.style.display = 'none'; };
  } else logoWrap.style.display = 'none';
  startTypewriter(movie.title || 'Untitled');
  // info grid
  const infoGrid = document.getElementById('infoDetailGrid')!;
  const infoItems = [
    { icon: 'fa-star', label: 'Rating', value: `⭐ ${movie.rating?.toFixed(1) || '0'}` },
    { icon: 'fa-calendar-alt', label: 'Year', value: movie.release_year || '-' },
    { icon: 'fa-clock', label: 'Runtime', value: movie.runtime ? `${movie.runtime} min` : '-' },
    { icon: 'fa-masks-theater', label: 'Genre', value: movie.genres?.join(', ') || '-' },
    { icon: 'fa-globe', label: 'Language', value: movie.language?.join(', ') || '-' },
    { icon: 'fa-folder-open', label: 'Category', value: movie.categories?.join(', ') || '-' }
  ];
  infoGrid.innerHTML = infoItems.map(it => `
    <div class="info-d-card">
      <div class="info-d-icon"><i class="fas ${it.icon}"></i></div>
      <div class="info-d-label">${it.label}</div>
      <div class="info-d-value">${it.value}</div>
    </div>
  `).join('');
  renderCast(movie.cast);
  const storyEl = document.getElementById('dStoryline')!;
  storyEl.textContent = movie.storyline || 'No storyline available.';
  storyEl.classList.remove('expanded');
  const readMoreBtn = document.getElementById('readMoreBtn')!;
  readMoreBtn.style.display = (movie.storyline && movie.storyline.length > 200) ? 'block' : 'none';
  loadSimilarMovies(movie.genres, movie.categories);
  loadComments(currentMovieId!);
  const vpTitle = document.getElementById('vpTitle')!;
  vpTitle.textContent = movie.title || 'Movie Player';
}

function startTypewriter(text: string) {
  // same as before
}

function renderCast(cast?: any[]) {
  // same
}

function loadSimilarMovies(genres?: string[], categories?: string[]) {
  // same
}

function loadComments(movieId: string) {
  // will be implemented in chat module
}

function hideAllPages() {
  document.getElementById('homePage')!.style.display = 'none';
  document.getElementById('detailsPage')!.classList.remove('show');
  document.getElementById('settingsPage')!.classList.remove('show');
  document.getElementById('seeAllPage')!.classList.remove('show');
  document.getElementById('chatPage')!.classList.remove('show');
}

function openTrailerFloat() {
  // open trailer
}

function openVideoPlayer() {
  // open video player
}

function showQualityModal() {
  // show modal
}

function closeTrailerFloat() {}
function closeVideoPlayer() {}
function toggleTrailerFullscreen() {}
function toggleVPFullscreen() {}
function minimizeTrailer() {}
function minimizeVP() {}
function playMovieQuality(quality: string) {}