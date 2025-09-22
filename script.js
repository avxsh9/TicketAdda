/* ==================================================================
  index-auth.js  (module) - Put this file as `index-auth.js` and include in
  index.html as: <script type="module" src="index-auth.js"></script>

  Purpose: watches Firebase auth state, updates header UI, exposes logout.
  ================================================================== */

// index-auth.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* ---------- Firebase config (same as other pages) ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyDSPYXYwrxaVTna2CfFI2EktEysXb7z5iE",
  authDomain: "ticketaddda.firebaseapp.com",
  projectId: "ticketaddda",
  storageBucket: "ticketaddda.firebasestorage.app",
  messagingSenderId: "987839286443",
  appId: "1:987839286443:web:235ed8857cd8cc8477fbee",
  measurementId: "G-EDDVKVVXHS"
};

/* init app safely */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* helper to get DOM element safely */
function $id(id) { return document.getElementById(id); }

// Wait for DOM so elements exist
document.addEventListener('DOMContentLoaded', () => {
  const authActions = $id('authActions');
  const userMenu = $id('userMenu');
  const userNameElm = $id('userNameElm');
  const userAvatar = $id('userAvatar');

  // Keep UI in sync with auth state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // user is signed in -> show user menu
      let displayName = (user.displayName || '').trim();

      // fallback: try Firestore users/{uid}.fullName (we write this on signup)
      if (!displayName) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const data = snap.data();
            displayName = (data && data.fullName) ? data.fullName : '';
          }
        } catch (err) {
          console.warn('Failed to read user doc:', err);
        }
      }

      // fallback to email prefix
      if (!displayName) displayName = (user.email || 'User').split('@')[0];

      if (authActions) authActions.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'flex';
        if (userNameElm) userNameElm.textContent = `Hi, ${displayName}`;
        if (user.photoURL && userAvatar) userAvatar.src = user.photoURL;
      }
    } else {
      // not signed-in -> show auth actions
      if (authActions) authActions.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  });
});

/* logout function (global so inline onclick works) */
window.logoutUser = async function() {
  try {
    await signOut(auth);
    // after sign-out, show login page or home — choose behaviour
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout failed:', err);
    alert('Logout failed. Try again.');
  }
};


/* ==================================================================
  script.js (theme + UI helpers)
  Put this file as `script.js` and include after index-auth.js in index.html
  <script type="module" src="index-auth.js"></script>
  <script src="script.js"></script>
  ================================================================== */

// script.js - Non-module

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initScrollAnimations();
    initCounters();
    initModals();
    initTabs();
    initContactForm();
    initBackToTop();
    initSmoothScrolling();
    initSearch();
});

/* -----------------------------
   NAVBAR & MOBILE MENU
   ----------------------------- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = navMenu ? navMenu.querySelectorAll('.nav-link') : [];

    // if navbar absent, nothing to do
    if (!navbar) return;

    // Navbar scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');

        if (scrollTop > lastScrollTop && scrollTop > 200) navbar.style.transform = 'translateY(-120%)';
        else navbar.style.transform = 'translateY(0)';
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Mobile menu toggle
    function toggleMenu() {
        if (!hamburger || !navMenu) return;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    if (hamburger) {
        hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    }

    navLinks.forEach(link => link.addEventListener('click', () => { if (hamburger && hamburger.classList.contains('active')) toggleMenu(); }));

    document.addEventListener('click', (e) => {
        if (hamburger && hamburger.classList.contains('active') && navMenu && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });
}

/* -----------------------------
   SCROLL ANIMATIONS
   ----------------------------- */
function initScrollAnimations() {
    const selectors = ['.category-card', '.event-card', '.step-card', '.story-card', '.safety-illustration-container', '.about-image-content'];
    const animatedElements = Array.from(document.querySelectorAll(selectors.join(', ')));
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* -----------------------------
   COUNTERS
   ----------------------------- */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const duration = 2000;
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count')) || 0;
        const suffix = counter.getAttribute('data-suffix') || '';
        let started = false;

        const animate = () => {
            if (started) return; started = true;
            const start = 0; let startTime = null;
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const value = Math.floor(progress * (target - start) + start);
                counter.innerText = value.toLocaleString() + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else counter.innerText = target.toLocaleString() + suffix;
            }
            requestAnimationFrame(step);
        };

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => { if (entry.isIntersecting) { animate(); observer.unobserve(entry.target); } });
        }, { threshold: 0.6 });
        obs.observe(counter);
    });
}

/* -----------------------------
   MODALS
   ----------------------------- */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
}
function switchModal(currentModalId, newModalId) { closeModal(currentModalId); setTimeout(() => openModal(newModalId), 300); }
function initModals() {
    window.addEventListener('click', (e) => { if (e.target.classList && e.target.classList.contains('modal')) { e.target.style.display = 'none'; document.body.style.overflow = 'auto'; } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => { if (m.style.display === 'block') closeModal(m.id); }); });
}

/* -----------------------------
   TABS
   ----------------------------- */
function initTabs() {
    const tabContainer = document.querySelector('.process-tabs');
    if (!tabContainer) return;
    tabContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-button')) {
            const targetTab = e.target.getAttribute('data-tab');
            const prevBtn = tabContainer.querySelector('.active'); if (prevBtn) prevBtn.classList.remove('active');
            e.target.classList.add('active');
            const prevContent = document.querySelector('.tab-content.active'); if (prevContent) prevContent.classList.remove('active');
            const newContent = document.getElementById(targetTab + '-tab'); if (newContent) newContent.classList.add('active');
        }
    });
}

/* -----------------------------
   FORM HANDLING (lightweight)
   ----------------------------- */
function initContactForm() {
    const allForms = ['contactForm', 'loginForm', 'signupForm', 'sellForm'];
    allForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            // If your page uses Firebase auth handlers, those scripts should handle the event.
            // This generic handler provides UI feedback for plain forms (themes/demo).
            e.preventDefault();
            const submitBtn = form.querySelector('.btn-submit') || form.querySelector('button[type="submit"], .btn-primary');
            const originalText = submitBtn ? submitBtn.innerHTML : null;
            if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; submitBtn.disabled = true; }

            setTimeout(() => {
                let successMessage = "Action completed successfully!";
                if (formId === 'contactForm') successMessage = "Message sent! We'll be in touch.";
                if (formId === 'loginForm') successMessage = "Login successful! Welcome back.";
                if (formId === 'signupForm') successMessage = "Account created! Welcome to TicketRise.";
                if (formId === 'sellForm') successMessage = "Your tickets are now listed!";

                showNotification(successMessage, 'success');
                if (submitBtn) { submitBtn.innerHTML = originalText; submitBtn.disabled = false; }
                if (form.closest('.modal')) closeModal(form.closest('.modal').id);
                try { form.reset(); } catch (err) {}
            }, 1200);
        });
    });
}

/* -----------------------------
   BACK TO TOP
   ----------------------------- */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top'); if (!backToTopButton) return;
    window.addEventListener('scroll', () => { if (window.scrollY > 300) backToTopButton.classList.add('show'); else backToTopButton.classList.remove('show'); });
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* -----------------------------
   SMOOTH SCROLLING
   ----------------------------- */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            if (!href.startsWith('#')) return; // external links not handled
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

/* -----------------------------
   SEARCH
   ----------------------------- */
function initSearch() {
    const searchInput = document.querySelector('.hero-search-input');
    const searchBtn = document.querySelector('.hero-search-btn');
    const performSearch = () => {
        if (!searchInput) return showNotification('Search not available', 'warning');
        const query = searchInput.value.trim();
        if (query) showNotification(`Searching for "${query}"...`, 'info');
        else showNotification('Please enter something to search.', 'warning');
    };
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
}

/* -----------------------------
   NOTIFICATIONS
   ----------------------------- */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const iconClass = {info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle'}[type] || 'fa-info-circle';
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;

    Object.assign(notification.style, {
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '1rem 1.5rem',
        borderRadius: '10px', color: 'white', background: (type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#2563eb'),
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: '3000', display: 'flex', alignItems: 'center', gap: '0.75rem',
        opacity: '0', transition: 'opacity 0.3s ease, transform 0.3s ease'
    });

    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
    setTimeout(() => { notification.style.opacity = '0'; setTimeout(() => { try { document.body.removeChild(notification); } catch(e){} }, 300); }, 5000);
}

/* -----------------------------
   GLOBAL EXPOSES
   ----------------------------- */
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;

/* -----------------------------
   Additional helpers you might like
   ----------------------------- */
// small debounce util
function debounce(fn, wait = 200) {
    let t;
    return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
}

// safe query helper
function q(sel) { try { return document.querySelector(sel); } catch(e) { return null; } }

<<<<<<< Updated upstream
/* ==================================================================
   End of script.js
   ================================================================== */
=======
            if (isDecimal) {
                // Format to one decimal place
                counter.innerText = currentValue.toFixed(1);
            } else {
                // Format for whole numbers
                counter.innerText = Math.floor(currentValue).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Set the final precise value with the suffix
                counter.innerText = target.toLocaleString() + suffix;
            }
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

>>>>>>> Stashed changes
