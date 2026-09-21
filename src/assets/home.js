/**
 * Gaming Wiki - Home Hub Logic
 * Search, Filter, Sort, Bookmarks, and View Modes
 */

(function () {
  let guides = window.GUIDES_DATA || [];
  let currentFilter = 'all';
  let searchQuery = '';
  let currentSort = 'newest';
  let viewMode = localStorage.getItem('wiki_view_mode') || 'grid';
  let favorites = JSON.parse(localStorage.getItem('wiki_favorites') || '[]');

  const searchInput = document.getElementById('searchInput');
  const tagsScroll = document.getElementById('tagsScroll');
  const guidesContainer = document.getElementById('guidesContainer');
  const emptyState = document.getElementById('emptyState');
  const sortSelect = document.getElementById('sortSelect');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const statTotalGuides = document.getElementById('statTotalGuides');
  const statTotalGames = document.getElementById('statTotalGames');
  const statFavCount = document.getElementById('statFavCount');
  const helpModal = document.getElementById('helpModal');
  const openHelpBtn = document.getElementById('openHelpBtn');
  const closeHelpBtn = document.getElementById('closeHelpBtn');

  function init() {
    updateStats();
    buildGameFilters();
    applyViewMode(viewMode);
    bindEvents();
    render();
  }

  function updateStats() {
    if (statTotalGuides) statTotalGuides.textContent = guides.length;
    const uniqueGames = new Set(guides.map(g => g.game));
    if (statTotalGames) statTotalGames.textContent = uniqueGames.size;
    if (statFavCount) statFavCount.textContent = favorites.length;
  }

  function buildGameFilters() {
    if (!tagsScroll) return;

    // Count guides per game
    const gameCounts = {};
    guides.forEach(g => {
      gameCounts[g.game] = (gameCounts[g.game] || 0) + 1;
    });

    const games = Object.keys(gameCounts).sort();

    let html = `
      <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
        🎮 Tất cả (${guides.length})
      </button>
      <button class="filter-btn ${currentFilter === 'fav' ? 'active' : ''}" data-filter="fav">
        ⭐ Đã ghim (${favorites.length})
      </button>
    `;

    games.forEach(game => {
      html += `
        <button class="filter-btn ${currentFilter === game ? 'active' : ''}" data-filter="${escapeAttr(game)}">
          ${escapeHtml(game)} (${gameCounts[game]})
        </button>
      `;
    });

    tagsScroll.innerHTML = html;

    tagsScroll.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tagsScroll.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });
  }

  function getFilteredAndSortedGuides() {
    let result = guides.slice();

    // 1. Filter by Game or Favorite
    if (currentFilter === 'fav') {
      result = result.filter(g => favorites.includes(g.url));
    } else if (currentFilter !== 'all') {
      result = result.filter(g => g.game === currentFilter);
    }

    // 2. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(g => {
        return (
          g.title.toLowerCase().includes(q) ||
          g.game.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q)) ||
          g.fileName.toLowerCase().includes(q)
        );
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      if (currentSort === 'newest') {
        return new Date(b.mtime) - new Date(a.mtime);
      } else if (currentSort === 'oldest') {
        return new Date(a.mtime) - new Date(b.mtime);
      } else if (currentSort === 'alpha') {
        return a.title.localeCompare(b.title, 'vi');
      } else if (currentSort === 'readTime') {
        return (b.readTimeMinutes || 1) - (a.readTimeMinutes || 1);
      }
      return 0;
    });

    return result;
  }

  function render() {
    const list = getFilteredAndSortedGuides();

    if (list.length === 0) {
      guidesContainer.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    guidesContainer.innerHTML = list.map(g => {
      const isFav = favorites.includes(g.url);
      const formattedDate = formatDate(g.mtime);

      return `
        <a href="${escapeAttr(g.url)}" class="guide-card" data-url="${escapeAttr(g.url)}">
          <div class="card-top">
            <span class="game-tag">${escapeHtml(g.game)}</span>
            <button class="btn-star ${isFav ? 'starred' : ''}" data-url="${escapeAttr(g.url)}" title="${isFav ? 'Bỏ ghim' : 'Ghim yêu thích'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#fbbf24' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          </div>

          <div class="card-body-wrapper">
            <h2 class="card-title">${escapeHtml(g.title)}</h2>
            <p class="card-desc">${escapeHtml(g.description || 'Chưa có mô tả ngắn.')}</p>
          </div>

          <div class="card-footer">
            <div class="footer-meta">
              <span class="meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ~${g.readTimeMinutes || 2} phút
              </span>
              <span class="meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${formattedDate}
              </span>
            </div>
            <span class="read-arrow">
              Đọc ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </a>
      `;
    }).join('');

    // Attach star events
    guidesContainer.querySelectorAll('.btn-star').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(btn.dataset.url);
      });
    });
  }

  function toggleFavorite(url) {
    if (favorites.includes(url)) {
      favorites = favorites.filter(u => u !== url);
    } else {
      favorites.push(url);
    }
    localStorage.setItem('wiki_favorites', JSON.stringify(favorites));
    updateStats();
    buildGameFilters();
    render();
  }

  function applyViewMode(mode) {
    viewMode = mode;
    localStorage.setItem('wiki_view_mode', mode);
    if (mode === 'grid') {
      guidesContainer.classList.remove('guides-list');
      guidesContainer.classList.add('guides-grid');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    } else {
      guidesContainer.classList.remove('guides-grid');
      guidesContainer.classList.add('guides-list');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    }
  }

  function bindEvents() {
    // Search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
      });
    }

    // Sort
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        render();
      });
    }

    // View toggles
    if (gridViewBtn) {
      gridViewBtn.addEventListener('click', () => applyViewMode('grid'));
    }
    if (listViewBtn) {
      listViewBtn.addEventListener('click', () => applyViewMode('list'));
    }

    // Hotkey / and Esc
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === 'Escape') {
        if (helpModal && helpModal.classList.contains('open')) {
          helpModal.classList.remove('open');
        } else if (document.activeElement === searchInput) {
          searchInput.value = '';
          searchQuery = '';
          searchInput.blur();
          render();
        }
      }
    });

    // Help Modal
    if (openHelpBtn && helpModal) {
      openHelpBtn.addEventListener('click', () => helpModal.classList.add('open'));
    }
    if (closeHelpBtn && helpModal) {
      closeHelpBtn.addEventListener('click', () => helpModal.classList.remove('open'));
    }
    if (helpModal) {
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.remove('open');
      });
    }
  }

  function formatDate(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    return String(str || '')
      .replace(/"/g, '&quot;');
  }

  init();
})();
