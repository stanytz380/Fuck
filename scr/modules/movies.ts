import { db } from '../config/firebase';
import { ref, get, onValue } from 'firebase/database';
import { Movie } from '../types';
import { showToast } from './ui';
import { openMovieDetails } from './player'; // will be defined later

export let allMovies: Movie[] = [];

export async function loadMovies() {
  try {
    const snapshot = await get(ref(db, 'movies'));
    const data = snapshot.val();
    if (!data) {
      allMovies = [];
      renderEmptyHome();
      return;
    }
    allMovies = Object.keys(data).map(key => ({ id: key, ...data[key] } as Movie));
    renderSlider();
    renderRecentMovies();
    renderTopRated();
    loadDynamicCategories();
  } catch (e) {
    showToast('Failed to load movies', 'error');
  }
}

function renderMoviePoster(movie: Movie): string {
  const poster = movie.poster_url || 'https://via.placeholder.com/120x180/111/555?text=No+Poster';
  return `<div class="movie-poster-card" data-movie-id="${movie.id}">
    <img src="${poster}" alt="${movie.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/120x180/111/555?text=Error'">
    <div class="poster-rating">⭐ ${movie.rating?.toFixed(1) || '0'}</div>
    <div class="poster-title">${movie.title || 'Untitled'}</div>
  </div>`;
}

function renderRecentMovies() {
  const container = document.getElementById('recentMovies') as HTMLElement;
  const recent = [...allMovies].sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 12);
  container.innerHTML = recent.length ? recent.map(renderMoviePoster).join('') : '<div class="empty-state" style="min-width:100%;"><p>No recent movies</p></div>';
  attachMovieClickEvents(container);
}

function renderTopRated() {
  const container = document.getElementById('topRatedMovies') as HTMLElement;
  const top = [...allMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12);
  container.innerHTML = top.length ? top.map(renderMoviePoster).join('') : '<div class="empty-state" style="min-width:100%;"><p>No movies yet</p></div>';
  attachMovieClickEvents(container);
}

async function loadDynamicCategories() {
  const snapshot = await get(ref(db, 'categories'));
  const categories = snapshot.val();
  const container = document.getElementById('dynamicCategories') as HTMLElement;
  if (!categories) {
    container.innerHTML = '';
    return;
  }
  let html = '';
  for (const key in categories) {
    const catName = categories[key].name;
    const moviesInCat = allMovies.filter(m => m.categories && m.categories.includes(catName));
    if (moviesInCat.length === 0) continue;
    html += `<div class="category-section">
      <div class="category-header">
        <h2>📂 ${catName}</h2>
        <button class="see-all" data-seeall="category_${catName}">See All</button>
      </div>
      <div class="movie-row" data-category="${catName}">${moviesInCat.slice(0, 12).map(renderMoviePoster).join('')}</div>
    </div>`;
  }
  container.innerHTML = html;
  document.querySelectorAll('.movie-row[data-category]').forEach(row => attachMovieClickEvents(row as HTMLElement));
  attachSeeAllEvents();
}

function attachMovieClickEvents(container: HTMLElement) {
  container.querySelectorAll('.movie-poster-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const movieId = (card as HTMLElement).dataset.movieId;
      if (movieId) openMovieDetails(movieId);
    });
  });
}

function attachSeeAllEvents() {
  document.querySelectorAll('.see-all').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = (btn as HTMLElement).dataset.seeall;
      if (type) openSeeAll(type);
    });
  });
}

function renderSlider() {
  const movies = allMovies.filter(m => m.backdrop_url).slice(0, 6);
  const wrapper = document.getElementById('sliderWrapper') as HTMLElement;
  const dots = document.getElementById('sliderDots') as HTMLElement;
  if (movies.length === 0) {
    wrapper.innerHTML = '<div class="slide" style="display:flex;align-items:center;justify-content:center;background:#111;"><p style="color:#555;">No movies</p></div>';
    dots.innerHTML = '';
    return;
  }
  wrapper.innerHTML = movies.map((m, idx) => `
    <div class="slide" data-movie-id="${m.id}">
      <img src="${m.backdrop_url}" alt="${m.title}" loading="lazy">
      <div class="slide-overlay">
        <div class="slide-info">
          <h3>${m.title}</h3>
          <p>⭐ ${m.rating?.toFixed(1) || '0'} · ${m.release_year || ''}</p>
        </div>
      </div>
    </div>
  `).join('');
  dots.innerHTML = movies.map((_, i) => `<div class="s-dot ${i === 0 ? 'active' : ''}" data-slide-index="${i}"></div>`).join('');
  let currentSlide = 0;
  let slideInterval: number;
  function updateSlider() {
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.s-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }
  function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = window.setInterval(() => {
      currentSlide = (currentSlide + 1) % movies.length;
      updateSlider();
    }, 4000);
  }
  startAutoSlide();
  wrapper.addEventListener('touchstart', (e) => {
    const startX = e.touches[0].clientX;
    const onEnd = (endEvent: TouchEvent) => {
      const diff = startX - endEvent.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) currentSlide = (currentSlide + 1) % movies.length;
        else currentSlide = (currentSlide - 1 + movies.length) % movies.length;
        updateSlider();
        clearInterval(slideInterval);
        startAutoSlide();
      }
      wrapper.removeEventListener('touchend', onEnd);
    };
    wrapper.addEventListener('touchend', onEnd, { once: true });
  });
  document.querySelectorAll('.s-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateSlider();
      clearInterval(slideInterval);
      startAutoSlide();
    });
  });
  wrapper.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const movieId = (slide as HTMLElement).dataset.movieId;
      if (movieId) openMovieDetails(movieId);
    });
  });
}

function renderEmptyHome() {
  document.getElementById('recentMovies')!.innerHTML = '<div class="empty-state"><p>No movies yet</p></div>';
  document.getElementById('topRatedMovies')!.innerHTML = '<div class="empty-state"><p>No movies yet</p></div>';
}

function openSeeAll(type: string) {
  // will be implemented later
}

export function getMovieById(id: string): Movie | undefined {
  return allMovies.find(m => m.id === id);
}