// events.js - TicketAdda Events page (fixed and robust)
// Usage: include after DOM. Depends on HTML IDs present in events.html.

(function () {
    'use strict';
  
    // ---------- helpers ----------
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const id = (n) => document.getElementById(n);
    const safeInt = (v, d = 0) => { const n = parseInt(v, 10); return Number.isNaN(n) ? d : n; };
  
    // ---------- state ----------
    let eventsLoaded = false;
  
    // ---------- init ----------
    document.addEventListener('DOMContentLoaded', () => {
      initializeFilters();
      initializeSearch();
      initializeSorting();
      initializeMobileFilters();
      loadEvents();
    });
  
    // ---------- Filters ----------
    function initializeFilters() {
      const filterCheckboxes = $$('.filter-checkbox input');
      const clearFiltersBtn = id('clearFilters');
  
      // change handlers
      filterCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          updateActiveFilters();
          filterEvents();
          updateResultsCount();
        });
      });
  
      // remove-filter buttons in active filters are added dynamically
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
          clearAllFilters();
        });
      }
  
      // price sliders
      const minPriceSlider = id('priceSliderMin');
      const maxPriceSlider = id('priceSliderMax');
      const minPriceInput = id('minPrice');
      const maxPriceInput = id('maxPrice');
  
      if (minPriceSlider && minPriceInput) {
        minPriceSlider.addEventListener('input', () => {
          minPriceInput.value = minPriceSlider.value;
          filterEvents();
          updateResultsCount();
        });
        minPriceInput.addEventListener('change', () => {
          minPriceSlider.value = minPriceInput.value || 0;
          filterEvents();
          updateResultsCount();
        });
      }
      if (maxPriceSlider && maxPriceInput) {
        maxPriceSlider.addEventListener('input', () => {
          maxPriceInput.value = maxPriceSlider.value;
          filterEvents();
          updateResultsCount();
        });
        maxPriceInput.addEventListener('change', () => {
          maxPriceSlider.value = maxPriceInput.value || maxPriceSlider.max;
          filterEvents();
          updateResultsCount();
        });
      }
    }
  
    // ---------- Search ----------
    function initializeSearch() {
      const searchInput = id('eventsSearch');
      if (!searchInput) return;
      let t;
      searchInput.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          filterEvents();
          updateResultsCount();
        }, 250);
      });
    }
  
    // ---------- Sorting ----------
    function initializeSorting() {
      const sortSelect = id('sortSelect');
      if (!sortSelect) return;
      sortSelect.addEventListener('change', () => {
        sortEvents(sortSelect.value);
      });
    }
  
    // ---------- Mobile Filters ----------
    function initializeMobileFilters() {
      const filterBtn = id('filterBtn');
      const filtersSidebar = id('filtersSidebar');
      if (!filterBtn || !filtersSidebar) return;
  
      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filtersSidebar.classList.toggle('mobile-open');
        filterBtn.classList.toggle('active');
      });
  
      // close filters when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          if (!filtersSidebar.contains(e.target) && !filterBtn.contains(e.target)) {
            filtersSidebar.classList.remove('mobile-open');
            filterBtn.classList.remove('active');
          }
        }
      });
  
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          filtersSidebar.classList.remove('mobile-open');
          filterBtn.classList.remove('active');
        }
      });
    }
  
    // ---------- Active filters display ----------
    function updateActiveFilters() {
      const activeFiltersContainer = id('activeFilters');
      if (!activeFiltersContainer) return;
      activeFiltersContainer.innerHTML = '';
  
      const checked = $$('.filter-checkbox input:checked');
  
      checked.forEach(chk => {
        const label = chk.parentNode.textContent.trim().split('(')[0].trim();
        const value = chk.value;
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `${escapeHtml(label)} <button class="remove-filter" data-filter="${escapeHtml(value)}">×</button>`;
        const btn = tag.querySelector('.remove-filter');
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          removeFilter(btn.dataset.filter);
        });
        activeFiltersContainer.appendChild(tag);
      });
    }
  
    // ---------- Remove filter ----------
    function removeFilter(filterValue) {
      const checkbox = document.querySelector(`.filter-checkbox input[value="${CSS.escape ? CSS.escape(filterValue) : filterValue}"]`);
      if (checkbox) {
        checkbox.checked = false;
        updateActiveFilters();
        filterEvents();
        updateResultsCount();
      }
    }
  
    // ---------- Clear all ----------
    function clearAllFilters() {
      $$('.filter-checkbox input').forEach(cb => cb.checked = false);
      const min = id('minPrice'), max = id('maxPrice'), minS = id('priceSliderMin'), maxS = id('priceSliderMax');
      if (min) min.value = '';
      if (max) max.value = '';
      if (minS) minS.value = 0;
      if (maxS) maxS.value = maxS.max || 10000;
      updateActiveFilters();
      filterEvents();
      updateResultsCount();
    }
  
    // ---------- Filter events ----------
    function filterEvents() {
      const eventCards = $$('.event-card');
      const searchTermEl = id('eventsSearch');
      const searchTerm = searchTermEl ? (searchTermEl.value || '').toLowerCase() : '';
      const minPrice = safeInt((id('minPrice') && id('minPrice').value) || id('priceSliderMin')?.value, 0);
      const maxPriceRaw = (id('maxPrice') && id('maxPrice').value) || id('priceSliderMax')?.value;
      const maxPrice = maxPriceRaw === '' ? Infinity : safeInt(maxPriceRaw, Infinity);
  
      // Gather selected filters by data-filter-type
      const checked = $$('.filter-checkbox input:checked');
      const selected = checked.reduce((acc, ch) => {
        const type = ch.dataset.filterType || getFilterType(ch.value);
        if (!acc[type]) acc[type] = [];
        acc[type].push(ch.value);
        return acc;
      }, {});
  
      let visibleCount = 0;
  
      eventCards.forEach(card => {
        const title = (card.querySelector('.event-title')?.textContent || '').toLowerCase();
        const venue = (card.querySelector('.event-venue')?.textContent || '').toLowerCase();
        const category = (card.dataset.category || card.querySelector('.event-category')?.textContent || '').toString().toLowerCase();
        const location = (card.dataset.location || '').toString().toLowerCase();
        const price = safeInt(card.dataset.price || (card.querySelector('.event-price')?.textContent || '').replace(/[^\d]/g, ''), 0);
  
        let visible = true;
  
        // search
        if (searchTerm) {
          if (!(title.includes(searchTerm) || venue.includes(searchTerm))) visible = false;
        }
  
        // category filter
        if (selected['category'] && selected['category'].length) {
          const match = selected['category'].some(c => category.includes(c));
          if (!match) visible = false;
        }
  
        // location filter
        if (selected['location'] && selected['location'].length) {
          const match = selected['location'].some(l => (location.includes(l) || venue.toLowerCase().includes(l)));
          if (!match) visible = false;
        }
  
        // date filter - for demo we don't have real dates, so skip (or you can implement by data attributes)
  
        // price filter
        if (price < minPrice || price > maxPrice) visible = false;
  
        // show/hide
        card.style.display = visible ? 'block' : 'none';
        if (visible) visibleCount++;
      });
  
      // update results count & empty state
      const resultsEl = id('resultsCount');
      if (resultsEl) resultsEl.textContent = visibleCount;
      showEmptyState(visibleCount === 0);
    }
  
    // ---------- get filter type fallback (if not using data-filter-type attr) ----------
    function getFilterType(value) {
      const categories = ['sports', 'concerts', 'theater', 'comedy', 'festivals'];
      const locations = ['mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai'];
      const dates = ['today', 'tomorrow', 'this-week', 'this-month', 'next-month'];
      if (categories.includes(value)) return 'category';
      if (locations.includes(value)) return 'location';
      if (dates.includes(value)) return 'date';
      return 'other';
    }
  
    // ---------- Sorting ----------
    function sortEvents(sortBy) {
      const eventsGrid = id('eventsGrid');
      if (!eventsGrid) return;
      const cards = Array.from(eventsGrid.querySelectorAll('.event-card'));
      cards.sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return getCardPrice(a) - getCardPrice(b);
          case 'price-high': return getCardPrice(b) - getCardPrice(a);
          case 'date': return new Date(getCardDate(a)) - new Date(getCardDate(b));
          case 'popularity': return getCardPopularity(b) - getCardPopularity(a);
          default: return 0;
        }
      });
      // re-append
      eventsGrid.innerHTML = '';
      cards.forEach(c => eventsGrid.appendChild(c));
    }
  
    function getCardPrice(card) {
      return safeInt(card.dataset.price || (card.querySelector('.event-price')?.textContent || '').replace(/[^\d]/g, ''), 0);
    }
    function getCardDate(card) {
      // demo: if you set data-date on card use it, else fallback to now
      return card.dataset.date || new Date().toISOString();
    }
    function getCardPopularity(card) {
      return safeInt((card.querySelector('.tickets-available')?.textContent || '').replace(/[^\d]/g, ''), 0);
    }
  
    // ---------- Results count ----------
    function updateResultsCount() {
      const visible = $$('.event-card').filter(c => c.style.display !== 'none').length;
      const el = id('resultsCount');
      if (el) el.textContent = visible;
      showEmptyState(visible === 0);
    }
  
    // ---------- Empty state ----------
    function showEmptyState(show) {
      const grid = id('eventsGrid');
      if (!grid) return;
      let empty = grid.querySelector('.empty-state');
      if (show) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'empty-state';
          empty.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No events found</h3>
            <p>Try adjusting your search or filters to find more events.</p>
            <button onclick="clearAllFilters()">Clear filters</button>
          `;
          grid.appendChild(empty);
        }
      } else {
        if (empty) empty.remove();
      }
    }
  
    // ---------- Load more ----------
    function loadMoreEvents() {
      const loadMoreBtn = id('loadMoreBtn');
      if (!loadMoreBtn) return;
      loadMoreBtn.addEventListener('click', function () {
        this.innerHTML = '<span class="spinner"></span> Loading...';
        this.disabled = true;
        setTimeout(() => {
          // demo: clone existing visible cards (or last card) to simulate loading
          const eventsGrid = id('eventsGrid');
          const sourceCards = $$('.event-card');
          if (!sourceCards.length) {
            this.innerHTML = 'No more events';
            return;
          }
          // append 3 clones
          for (let i = 0; i < 3; i++) {
            const clone = sourceCards[i % sourceCards.length].cloneNode(true);
            // small visual tweak
            clone.style.animationDelay = (0.05 * i) + 's';
            eventsGrid.appendChild(clone);
          }
          this.innerHTML = 'Load more events <i class="fas fa-chevron-down"></i>';
          this.disabled = false;
          // rebind click for new cards
          bindCardClicks();
          filterEvents(); // keep filtered state
          updateResultsCount();
        }, 900);
      });
    }
  
    // ---------- Load events initial ----------
    function loadEvents() {
      if (eventsLoaded) return;
      // bind clicks and animations
      bindCardClicks();
      loadMoreEvents();
      updateActiveFilters();
      filterEvents();
      updateResultsCount();
      eventsLoaded = true;
    }
  
    function bindCardClicks() {
      $$('.event-card').forEach((card, index) => {
        card.addEventListener('click', function (e) {
          // don't trigger link when clicking remove-filter etc
          const target = e.target;
          if (target.closest('.remove-filter')) return;
          const eventId = index + 1;
          // demo redirect - in production use proper route
          window.location.href = `event-detail.html?id=${eventId}`;
        });
        // animation delay for staggered look
        card.style.animationDelay = `${index * 0.05}s`;
      });
    }
  
    // ---------- URL params handling ----------
    function handleURLParams() {
      const url = new URL(window.location.href);
      const category = url.searchParams.get('category');
      const city = url.searchParams.get('city');
      if (category) {
        const el = document.querySelector(`.filter-checkbox input[value="${category}"]`);
        if (el) el.checked = true;
      }
      if (city) {
        const el = document.querySelector(`.filter-checkbox input[value="${city}"]`);
        if (el) el.checked = true;
      }
      if (category || city) {
        updateActiveFilters();
        filterEvents();
        updateResultsCount();
      }
    }
    window.addEventListener('load', handleURLParams);
  
    // ---------- small utility ----------
    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"'`=\/]/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;' }[s] || s));
    }
  
    // expose some functions for debug/global (optional)
    window.ticketAddaEvents = {
      filterEvents, clearAllFilters, updateActiveFilters
    };
  
  })();
  