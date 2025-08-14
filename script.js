// ===============================================
// TICKETRISE - MODERN THEME JAVASCRIPT
// Merged functionality from TicketRise & HealthTech Pro
// ===============================================

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

// 1. Navigation functionality (Merged Logic)
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('.nav-link');

    if (!navbar || !hamburger || !navMenu) return;

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for background change
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (from HealthTech theme)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateX(-50%) translateY(-120%)';
        } else {
            navbar.style.transform = 'translateX(-50%) translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Mobile menu toggle
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (hamburger.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });
}


// 2. Scroll-triggered animations (from HealthTech Theme)
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.category-card, .event-card, .step-card, .story-card, .safety-illustration-container, .about-image-content');
    
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

// 3. Counter animations (from TicketRise)
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200; // The lower the slower

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const updateCount = () => {
            const currentVal = +counter.innerText.replace(/,/g, '');
            const increment = target / speed;

            if (currentVal < target) {
                counter.innerText = Math.ceil(currentVal + increment).toLocaleString();
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target.toLocaleString() + (counter.hasAttribute('data-plus') ? '+' : '');
            }
        };
        updateCount();
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

// 4. Modal functionality (Core from TicketRise)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchModal(currentModalId, newModalId) {
    closeModal(currentModalId);
    // Use a small delay to allow smooth transition
    setTimeout(() => openModal(newModalId), 300);
}

function initModals() {
    // Add event listeners to close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });
}

// 5. Tab functionality (for "How It Works")
function initTabs() {
    const tabContainer = document.querySelector('.process-tabs');
    if (!tabContainer) return;

    tabContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-button')) {
            const targetTab = e.target.getAttribute('data-tab');
            
            // Update button states
            tabContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            
            // Update content visibility
            document.querySelector('.tab-content.active').classList.remove('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        }
    });
}

// 6. Contact & other Form handling
function initContactForm() {
    const allForms = ['contactForm', 'loginForm', 'signupForm', 'sellForm'];
    
    allForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    let successMessage = "Action completed successfully!";
                    if (formId === 'contactForm') successMessage = "Message sent! We'll be in touch.";
                    if (formId === 'loginForm') successMessage = "Login successful! Welcome back.";
                    if (formId === 'signupForm') successMessage = "Account created! Welcome to TicketRise.";
                    if (formId === 'sellForm') successMessage = "Your tickets are now listed!";
                    
                    showNotification(successMessage, 'success');
                    
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    if (form.closest('.modal')) {
                        closeModal(form.closest('.modal').id);
                    }
                    form.reset();
                }, 1500);
            });
        }
    });
}

// 7. Back to Top functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 8. Smooth Scrolling for all anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120; // Navbar height offset
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 9. Search functionality
function initSearch() {
    const searchInput = document.getElementById('heroSearch');
    const searchBtn = document.querySelector('.search-btn');

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Searching for "${query}"...`, 'info');
        } else {
            showNotification('Please enter something to search.', 'warning');
        }
    };
    
    if(searchBtn) searchBtn.addEventListener('click', performSearch);
    if(searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// 10. Notification system (from HealthTech Theme)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const iconClass = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    }[type];

    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;

    // Add styles dynamically
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-xl)',
        color: 'white',
        background: {info: 'var(--secondary-700)', success: 'var(--success-500)', warning: 'var(--warning-500)', error: 'var(--error-500)'}[type],
        boxShadow: 'var(--shadow-xl)',
        zIndex: '3000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        opacity: '0',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        transform: 'translate(-50%, 20px)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
}

// Make functions globally accessible for inline HTML calls
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;

// 3. Counter animations (Improved Version)
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || ''; // Gets the '%' symbol or nothing
        const duration = 2000; // Animation duration in milliseconds
        const isDecimal = target % 1 !== 0; // Checks if the number is a decimal
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            let currentValue = progress * target;

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