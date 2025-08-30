// TicketAdda Events - Modern Professional Implementation
// Enhanced with smooth animations and better UX

// State Management
let allEvents = [];
let filteredEvents = [];
let displayedEvents = [];
let currentFilters = {
    categories: [],
    locations: [],
    dates: [],
    priceMin: 0,
    priceMax: 50000,
    search: ''
};
let currentSort = 'date';
let eventsPerPage = 12;
let currentPage = 1;
let cart = [];
let selectedEvent = null;
let filterCount = 0;

// Enhanced Mock Events Data
const mockEvents = [
    {
        id: 1,
        title: "Mumbai Indians vs Chennai Super Kings",
        category: "sports",
        subcategory: "cricket",
        location: "mumbai",
        venue: "Wankhede Stadium, Mumbai",
        date: "2024-04-20",
        time: "15:30",
        image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [1200, 2500, 4500, 8500],
        ticketsAvailable: 89,
        description: "Witness the ultimate cricket showdown between two powerhouse teams in the electrifying atmosphere of Wankhede Stadium. Experience world-class cricket with passionate fans.",
        highlights: ["Premium seating with excellent views", "Complimentary refreshments", "Live commentary access", "Secure parking facilities", "Celebrity player interactions"]
    },
    {
        id: 2,
        title: "Arijit Singh Live Symphony",
        category: "concerts",
        subcategory: "bollywood",
        location: "mumbai",
        venue: "NSCI Dome, Mumbai",
        date: "2024-11-15",
        time: "19:00",
        image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=400&h=250&fit=crop",
        badge: "hot",
        prices: [2500, 4500, 7500, 12000],
        ticketsAvailable: 234,
        description: "Experience the magic of Arijit Singh's soulful voice live with a full symphony orchestra. An unforgettable evening of melodious Bollywood hits and acoustic masterpieces.",
        highlights: ["Live symphony orchestra", "Acoustic arrangements", "Limited edition merchandise", "VIP meet & greet packages", "Professional recording quality"]
    },
    {
        id: 3,
        title: "Ed Sheeran - Mathematics Tour",
        category: "concerts",
        subcategory: "international",
        location: "bangalore",
        venue: "Bangalore Palace Grounds",
        date: "2024-03-16",
        time: "18:30",
        image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [5000, 9500, 18000, 35000],
        ticketsAvailable: 389,
        description: "Global superstar Ed Sheeran brings his Mathematics Tour to India featuring intimate acoustic performances and loop station magic with all your favorite hits.",
        highlights: ["Grammy-winning artist", "Loop station performances", "Acoustic arrangements", "Hit songs from all albums", "Interactive fan moments"]
    },
    {
        id: 4,
        title: "Mughal-E-Azam - The Musical",
        category: "theater",
        subcategory: "musical",
        location: "mumbai",
        venue: "NCPA, Mumbai",
        date: "2024-11-30",
        time: "19:30",
        image: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?w=400&h=250&fit=crop",
        prices: [1500, 2500, 4000, 6000],
        ticketsAvailable: 67,
        description: "A spectacular musical adaptation of the classic Bollywood film featuring elaborate costumes, stunning sets, and powerful performances.",
        highlights: ["Award-winning production", "Live orchestra", "Elaborate period costumes", "Historic NCPA venue", "Cultural masterpiece"]
    },
    {
        id: 5,
        title: "Sunburn Festival 2024",
        category: "festivals",
        subcategory: "electronic",
        location: "goa",
        venue: "Vagator Beach, Goa",
        date: "2024-12-28",
        time: "16:00",
        image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [2000, 3500, 6000, 12000],
        ticketsAvailable: 456,
        description: "India's biggest electronic dance music festival featuring world-renowned DJs, stunning beach location, and three days of non-stop music.",
        highlights: ["International DJ lineup", "Beach location", "3-day festival pass", "Camping accommodation", "Food & beverage stalls"]
    },
    {
        id: 6,
        title: "Royal Challengers Bangalore vs Delhi Capitals",
        category: "sports",
        subcategory: "cricket",
        location: "bangalore",
        venue: "M. Chinnaswamy Stadium, Bangalore",
        date: "2024-04-25",
        time: "19:30",
        image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?w=400&h=250&fit=crop",
        prices: [1000, 2200, 4000, 7500],
        ticketsAvailable: 178,
        description: "Home team RCB takes on Delhi Capitals in this high-stakes IPL encounter. Experience the roar of the crowd in Bangalore's cricket fortress.",
        highlights: ["Home advantage for RCB", "Electric stadium atmosphere", "Celebrity sightings", "Local food specialties", "Fan engagement activities"]
    },
    {
        id: 7,
        title: "A.R. Rahman Live in Concert",
        category: "concerts",
        subcategory: "classical",
        location: "delhi",
        venue: "Pragati Maidan, Delhi",
        date: "2024-12-15",
        time: "18:00",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?w=400&h=250&fit=crop",
        badge: "hot",
        prices: [3000, 5500, 8500, 15000],
        ticketsAvailable: 267,
        description: "The maestro A.R. Rahman presents a symphonic experience featuring his Oscar-winning compositions and greatest hits with a live orchestra.",
        highlights: ["Oscar-winning composer", "Full symphony orchestra", "Movie soundtrack classics", "Digital light show", "Exclusive behind-the-scenes content"]
    },
    {
        id: 8,
        title: "Kapil Sharma Comedy Show",
        category: "comedy",
        subcategory: "standup",
        location: "pune",
        venue: "Shaniwar Wada Grounds, Pune",
        date: "2024-11-22",
        time: "20:00",
        image: "https://images.pexels.com/photos/1643496/pexels-photo-1643496.jpeg?w=400&h=250&fit=crop",
        prices: [800, 1200, 1800, 2500],
        ticketsAvailable: 145,
        description: "India's comedy king Kapil Sharma brings his hilarious stand-up special with interactive segments and surprise celebrity guests.",
        highlights: ["Family-friendly comedy", "Interactive audience segments", "Surprise celebrity guests", "Photo opportunities", "Merchandise available"]
    },
    {
        id: 9,
        title: "Coldplay - Music of the Spheres Tour",
        category: "concerts",
        subcategory: "international",
        location: "mumbai",
        venue: "DY Patil Stadium, Mumbai",
        date: "2024-01-21",
        time: "19:00",
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [4500, 8500, 15000, 25000],
        ticketsAvailable: 423,
        description: "The legendary British band Coldplay returns to India with their spectacular Music of the Spheres tour featuring stunning visuals and all their hit songs.",
        highlights: ["LED wristbands included", "360-degree stage setup", "Eco-friendly production", "Special effects show", "Exclusive merchandise"]
    },
    {
        id: 10,
        title: "Chennai Super Kings vs Kolkata Knight Riders",
        category: "sports",
        subcategory: "cricket",
        location: "chennai",
        venue: "M.A. Chidambaram Stadium, Chennai",
        date: "2024-05-05",
        time: "15:30",
        image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?w=400&h=250&fit=crop",
        prices: [1100, 2300, 4200, 7800],
        ticketsAvailable: 203,
        description: "MS Dhoni's CSK faces off against KKR in this thrilling IPL encounter at the iconic Chepauk Stadium with passionate Tamil Nadu cricket fans.",
        highlights: ["Captain Cool MS Dhoni", "Historic Chepauk Stadium", "Local Tamil delicacies", "Passionate fan support", "Traditional stadium atmosphere"]
    },
    {
        id: 11,
        title: "Zakir Khan Comedy Night",
        category: "comedy",
        subcategory: "standup",
        location: "hyderabad",
        venue: "Shilpakala Vedika, Hyderabad",
        date: "2024-12-01",
        time: "20:30",
        image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?w=400&h=250&fit=crop",
        prices: [600, 1000, 1500, 2200],
        ticketsAvailable: 178,
        description: "Popular comedian Zakir Khan brings his unique storytelling style and relatable humor to Hyderabad with his latest comedy special.",
        highlights: ["Relatable storytelling", "Hindi comedy", "Interactive show format", "Audience participation", "Social media moments"]
    },
    {
        id: 12,
        title: "Hamlet - Royal Shakespeare Company",
        category: "theater",
        subcategory: "drama",
        location: "delhi",
        venue: "Kamani Auditorium, Delhi",
        date: "2024-10-14",
        time: "19:00",
        image: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?w=400&h=250&fit=crop",
        prices: [1200, 2000, 3500, 5000],
        ticketsAvailable: 89,
        description: "Shakespeare's timeless tragedy performed by the world-renowned Royal Shakespeare Company in their exclusive India tour.",
        highlights: ["World-class British actors", "Classic Shakespearean drama", "Period authentic costumes", "Historic Delhi venue", "Limited India tour"]
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupAdvancedInteractions();
});

function initializeApp() {
    allEvents = [...mockEvents];
    filteredEvents = [...allEvents];
    loadCart();
    setupEventListeners();
    applyFilters();
    updateCartDisplay();
    initializeBackToTop();
    preloadImages();
}

function setupAdvancedInteractions() {
    // Enhanced scroll animations
    setupScrollAnimations();
    
    // Smart search suggestions
    setupSearchSuggestions();
    
    // Keyboard navigation
    setupKeyboardNavigation();
    
    // Progressive image loading
    setupProgressiveImageLoading();
    
    // Performance optimizations
    setupPerformanceOptimizations();
}

function setupEventListeners() {
    // Search functionality with debouncing
    const eventsSearch = document.getElementById('eventsSearch');
    const mainSearch = document.getElementById('mainSearch');
    const sortSelect = document.getElementById('sortSelect');
    
    if (eventsSearch) {
        eventsSearch.addEventListener('input', debounce(handleSearch, 300));
        eventsSearch.addEventListener('focus', showSearchSuggestions);
    }
    
    if (mainSearch) {
        mainSearch.addEventListener('input', debounce(handleMainSearch, 300));
        mainSearch.addEventListener('focus', showSearchSuggestions);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Navigation menu with smooth transitions
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterByCategory(category);
            setActiveNavLink(this);
        });
    });
    
    // Enhanced price range with real-time updates
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    
    if (priceSliderMin && priceSliderMax) {
        priceSliderMin.addEventListener('input', updatePriceInputs);
        priceSliderMax.addEventListener('input', updatePriceInputs);
    }
    
    // Filter checkboxes with animation
    document.querySelectorAll('input[data-filter]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            animateFilterChange(this);
            applyFilters();
        });
    });
    
    // Modal management
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeEventModal();
            closeCheckoutModal();
        }
    });
    
    // Enhanced keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEventModal();
            closeCheckoutModal();
            toggleCart(false);
            toggleMobileMenu(false);
        }
    });
    
    // Payment method selection with animations
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            animatePaymentMethodChange();
            togglePaymentMethods();
        });
    });
    
    // Card input formatting and validation
    setupAdvancedCardInputs();
    
    // Search clear functionality
    setupSearchClear();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function animateFilterChange(checkbox) {
    const filterLabel = checkbox.closest('.filter-checkbox');
    if (filterLabel) {
        filterLabel.style.transform = 'scale(0.95)';
        setTimeout(() => {
            filterLabel.style.transform = 'scale(1)';
        }, 150);
    }
}

function setupSearchClear() {
    const searchInputs = ['eventsSearch', 'mainSearch'];
    
    searchInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const clearBtn = input?.parentElement.querySelector('.search-clear');
        
        if (input && clearBtn) {
            input.addEventListener('input', function() {
                clearBtn.classList.toggle('show', this.value.length > 0);
            });
        }
    });
}

function clearSearch() {
    const eventsSearch = document.getElementById('eventsSearch');
    const mainSearch = document.getElementById('mainSearch');
    
    if (eventsSearch) {
        eventsSearch.value = '';
        eventsSearch.parentElement.querySelector('.search-clear')?.classList.remove('show');
    }
    if (mainSearch) {
        mainSearch.value = '';
        mainSearch.parentElement.querySelector('.search-clear')?.classList.remove('show');
    }
    
    currentFilters.search = '';
    applyFilters();
}

function handleSearch() {
    const query = document.getElementById('eventsSearch')?.value.toLowerCase() || '';
    currentFilters.search = query;
    applyFilters();
    
    // Sync with main search
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch && mainSearch.value !== query) {
        mainSearch.value = query;
    }
}

function handleMainSearch() {
    const query = document.getElementById('mainSearch')?.value.toLowerCase() || '';
    currentFilters.search = query;
    applyFilters();
    
    // Sync with events search
    const eventsSearch = document.getElementById('eventsSearch');
    if (eventsSearch && eventsSearch.value !== query) {
        eventsSearch.value = query;
    }
}

function performMainSearch() {
    handleMainSearch();
}

function handleSort() {
    currentSort = document.getElementById('sortSelect')?.value || 'date';
    applyFilters();
    
    // Add visual feedback
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.style.transform = 'scale(0.95)';
        setTimeout(() => {
            sortSelect.style.transform = 'scale(1)';
        }, 150);
    }
}

function setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function filterByCategory(category) {
    currentFilters.categories = [category];
    
    // Update checkboxes with animation
    document.querySelectorAll('input[data-filter="category"]').forEach(checkbox => {
        const wasChecked = checkbox.checked;
        checkbox.checked = checkbox.value === category;
        
        if (wasChecked !== checkbox.checked) {
            animateFilterChange(checkbox);
        }
    });
    
    applyFilters();
}

function applyFilters() {
    // Show loading state
    showLoadingState();
    
    // Collect filter values
    currentFilters.categories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked')).map(cb => cb.value);
    currentFilters.locations = Array.from(document.querySelectorAll('input[data-filter="location"]:checked')).map(cb => cb.value);
    currentFilters.dates = Array.from(document.querySelectorAll('input[data-filter="date"]:checked')).map(cb => cb.value);
    
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (minPrice && maxPrice) {
        currentFilters.priceMin = parseInt(minPrice.value) || 0;
        currentFilters.priceMax = parseInt(maxPrice.value) || 50000;
    }
    
    // Apply filters with animation delay
    setTimeout(() => {
        filteredEvents = allEvents.filter(event => {
            return passesAllFilters(event);
        });
        
        sortEvents();
        currentPage = 1;
        displayEvents();
        updateActiveFilters();
        updateResultsCount();
        updateFilterCount();
        hideLoadingState();
    }, 300);
}

function passesAllFilters(event) {
    // Category filter
    if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(event.category)) {
        return false;
    }
    
    // Location filter
    if (currentFilters.locations.length > 0 && !currentFilters.locations.includes(event.location)) {
        return false;
    }
    
    // Search filter
    if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const searchableText = `${event.title} ${event.venue} ${event.category} ${event.subcategory}`.toLowerCase();
        if (!searchableText.includes(searchLower)) {
            return false;
        }
    }
    
    // Price filter
    const minEventPrice = Math.min(...event.prices);
    if (minEventPrice < currentFilters.priceMin || minEventPrice > currentFilters.priceMax) {
        return false;
    }
    
    // Date filter
    if (currentFilters.dates.length > 0) {
        if (!passesDateFilter(event)) {
            return false;
        }
    }
    
    return true;
}

function passesDateFilter(event) {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return currentFilters.dates.some(dateFilter => {
        switch (dateFilter) {
            case 'today':
                const todayCheck = new Date(today);
                return eventDate.toDateString() === todayCheck.toDateString();
            case 'tomorrow':
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                return eventDate.toDateString() === tomorrow.toDateString();
            case 'this-week':
                const weekFromNow = new Date(today);
                weekFromNow.setDate(today.getDate() + 7);
                return eventDate >= today && eventDate <= weekFromNow;
            case 'this-month':
                return eventDate.getMonth() === today.getMonth() && 
                       eventDate.getFullYear() === today.getFullYear() &&
                       eventDate >= today;
            case 'next-month':
                const nextMonth = new Date(today);
                nextMonth.setMonth(today.getMonth() + 1);
                return eventDate.getMonth() === nextMonth.getMonth() && 
                       eventDate.getFullYear() === nextMonth.getFullYear();
            default:
                return false;
        }
    });
}

function sortEvents() {
    filteredEvents.sort((a, b) => {
        switch (currentSort) {
            case 'date':
                return new Date(a.date) - new Date(b.date);
            case 'price-low':
                return Math.min(...a.prices) - Math.min(...b.prices);
            case 'price-high':
                return Math.min(...b.prices) - Math.min(...a.prices);
            case 'popularity':
                return b.ticketsAvailable - a.ticketsAvailable;
            case 'distance':
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });
}

function showLoadingState() {
    const grid = document.getElementById('eventsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Finding perfect events for you...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // Loading state is automatically hidden when displayEvents() runs
}

function displayEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    const startIndex = 0;
    const endIndex = currentPage * eventsPerPage;
    displayedEvents = filteredEvents.slice(startIndex, endIndex);
    
    if (displayedEvents.length === 0) {
        grid.innerHTML = createNoResultsHTML();
        return;
    }
    
    grid.innerHTML = displayedEvents.map(event => createEventCardHTML(event)).join('');
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex < filteredEvents.length ? 'flex' : 'none';
    }
    
    // Add staggered animation to cards
    setTimeout(() => {
        grid.querySelectorAll('.event-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('fade-in-up');
        });
    }, 50);
}

function createNoResultsHTML() {
    return `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: var(--secondary-500);">
            <div style="font-size: 64px; margin-bottom: 24px; opacity: 0.3;">
                <i class="fas fa-search"></i>
            </div>
            <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: var(--secondary-700);">No events found</h3>
            <p style="margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button onclick="clearAllFilters()" style="background: var(--primary-500); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                <i class="fas fa-refresh"></i>
                Clear Filters
            </button>
        </div>
    `;
}

function createEventCardHTML(event) {
    const formattedDate = formatEventDate(event.date, event.time);
    const badgeHTML = event.badge ? `<div class="event-badge ${event.badge}">${event.badge}</div>` : '';
    const minPrice = Math.min(...event.prices);
    const maxPrice = Math.max(...event.prices);
    
    return `
        <div class="event-card" onclick="openEventDetail(${event.id})" tabindex="0" role="button" aria-label="View ${event.title} details">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}" loading="lazy">
                ${badgeHTML}
                <div class="event-price">From ₹${minPrice.toLocaleString()}</div>
            </div>
            <div class="event-details">
                <div class="event-category">${event.subcategory || event.category}</div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-venue">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.venue}
                </p>
                <p class="event-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formattedDate}
                </p>
                <div class="event-stats">
                    <span class="tickets-available">
                        <i class="fas fa-ticket-alt"></i>
                        ${event.ticketsAvailable} available
                    </span>
                    <span class="price-range">₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

function formatEventDate(date, time) {
    const eventDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dateString;
    
    if (eventDate.toDateString() === today.toDateString()) {
        dateString = 'Today';
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        dateString = 'Tomorrow';
    } else {
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        };
        dateString = eventDate.toLocaleDateString('en-IN', options);
    }
    
    if (time) {
        const [hours, minutes] = time.split(':');
        const timeObj = new Date();
        timeObj.setHours(parseInt(hours), parseInt(minutes));
        const timeString = timeObj.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        dateString += ` • ${timeString}`;
    }
    
    return dateString;
}

function loadMoreEvents() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            <span>Loading more...</span>
        `;
    }
    
    setTimeout(() => {
        currentPage++;
        displayEvents();
        
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = `
                <span>Load more events</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }
    }, 800);
}

function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    const filters = [];
    
    // Collect all active filters
    currentFilters.categories.forEach(cat => {
        filters.push({
            type: 'category',
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1)
        });
    });
    
    currentFilters.locations.forEach(loc => {
        filters.push({
            type: 'location',
            value: loc,
            label: loc.charAt(0).toUpperCase() + loc.slice(1)
        });
    });
    
    currentFilters.dates.forEach(date => {
        filters.push({
            type: 'date',
            value: date,
            label: date.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
    });
    
    if (currentFilters.search) {
        filters.push({
            type: 'search',
            value: 'search',
            label: `"${currentFilters.search}"`
        });
    }
    
    // Price range filter
    if (currentFilters.priceMin > 0 || currentFilters.priceMax < 50000) {
        filters.push({
            type: 'price',
            value: 'price',
            label: `₹${currentFilters.priceMin.toLocaleString()} - ₹${currentFilters.priceMax.toLocaleString()}`
        });
    }
    
    container.innerHTML = filters.map(filter => `
        <span class="filter-tag">
            ${filter.label}
            <button class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')" aria-label="Remove ${filter.label} filter">×</button>
        </span>
    `).join('');
}

function removeFilter(type, value) {
    switch (type) {
        case 'category':
            currentFilters.categories = currentFilters.categories.filter(cat => cat !== value);
            const categoryCheckbox = document.querySelector(`input[data-filter="category"][value="${value}"]`);
            if (categoryCheckbox) categoryCheckbox.checked = false;
            break;
        case 'location':
            currentFilters.locations = currentFilters.locations.filter(loc => loc !== value);
            const locationCheckbox = document.querySelector(`input[data-filter="location"][value="${value}"]`);
            if (locationCheckbox) locationCheckbox.checked = false;
            break;
        case 'date':
            currentFilters.dates = currentFilters.dates.filter(date => date !== value);
            const dateCheckbox = document.querySelector(`input[data-filter="date"][value="${value}"]`);
            if (dateCheckbox) dateCheckbox.checked = false;
            break;
        case 'search':
            currentFilters.search = '';
            clearSearch();
            return; // Early return to avoid double applyFilters call
        case 'price':
            currentFilters.priceMin = 0;
            currentFilters.priceMax = 50000;
            const minPrice = document.getElementById('minPrice');
            const maxPrice = document.getElementById('maxPrice');
            const priceSliderMin = document.getElementById('priceSliderMin');
            const priceSliderMax = document.getElementById('priceSliderMax');
            
            if (minPrice) minPrice.value = '';
            if (maxPrice) maxPrice.value = '';
            if (priceSliderMin) priceSliderMin.value = 0;
            if (priceSliderMax) priceSliderMax.value = 50000;
            break;
    }
    
    applyFilters();
}

function clearAllFilters() {
    // Reset all filter states with animation
    currentFilters = {
        categories: [],
        locations: [],
        dates: [],
        priceMin: 0,
        priceMax: 50000,
        search: ''
    };
    
    // Reset UI elements
    document.querySelectorAll('input[data-filter]').forEach(checkbox => {
        checkbox.checked = false;
        animateFilterChange(checkbox);
    });
    
    const inputs = ['minPrice', 'maxPrice', 'eventsSearch', 'mainSearch', 'priceSliderMin', 'priceSliderMax'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            if (inputId.includes('priceSlider')) {
                input.value = inputId === 'priceSliderMin' ? 0 : 50000;
            } else {
                input.value = '';
            }
        }
    });
    
    // Clear nav links
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.classList.remove('active');
    });
    
    applyFilters();
}

function updateFilterCount() {
    const totalFilters = currentFilters.categories.length + 
                        currentFilters.locations.length + 
                        currentFilters.dates.length + 
                        (currentFilters.search ? 1 : 0) +
                        ((currentFilters.priceMin > 0 || currentFilters.priceMax < 50000) ? 1 : 0);
    
    const filterCountElement = document.getElementById('filterCount');
    if (filterCountElement) {
        filterCountElement.textContent = totalFilters;
        filterCountElement.classList.toggle('show', totalFilters > 0);
    }
}

function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = filteredEvents.length.toLocaleString();
    }
}

function updatePriceInputs() {
    const minSlider = document.getElementById('priceSliderMin');
    const maxSlider = document.getElementById('priceSliderMax');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');
    
    if (!minSlider || !maxSlider) return;
    
    let minValue = parseInt(minSlider.value);
    let maxValue = parseInt(maxSlider.value);
    
    // Ensure min doesn't exceed max
    if (minValue >= maxValue) {
        if (minSlider === document.activeElement) {
            maxValue = minValue + 100;
            maxSlider.value = maxValue;
        } else {
            minValue = maxValue - 100;
            minSlider.value = minValue;
        }
    }
    
    if (minInput) minInput.value = minValue === 0 ? '' : minValue;
    if (maxInput) maxInput.value = maxValue === 50000 ? '' : maxValue;
    
    currentFilters.priceMin = minValue;
    currentFilters.priceMax = maxValue;
    
    // Debounced filter application
    clearTimeout(window.priceFilterTimeout);
    window.priceFilterTimeout = setTimeout(applyFilters, 300);
}

// Event Detail Modal Functions
function openEventDetail(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;
    
    selectedEvent = event;
    const modal = document.getElementById('eventModal');
    const detailContainer = document.getElementById('eventDetail');
    
    if (!modal || !detailContainer) return;
    
    detailContainer.innerHTML = createEventDetailHTML(event);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Initialize ticket selection
    initializeTicketSelection(event);
    
    // Track event view
    trackEvent('event_viewed', { eventId, eventTitle: event.title });
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        selectedEvent = null;
    }
}

function createEventDetailHTML(event) {
    const formattedDate = formatEventDate(event.date, event.time);
    const badgeHTML = event.badge ? `<div class="event-badge ${event.badge}">${event.badge}</div>` : '';
    
    return `
        <div class="event-detail-header">
            <div class="event-detail-image">
                <img src="${event.image}" alt="${event.title}">
                ${badgeHTML}
            </div>
            <div class="event-detail-info">
                <h1>${event.title}</h1>
                <div class="event-detail-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.venue}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-layer-group"></i>
                        <span>${event.subcategory || event.category}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-ticket-alt"></i>
                        <span>${event.ticketsAvailable} tickets available</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="event-detail-description">
            <h3>About this event</h3>
            <p>${event.description}</p>
            
            <div class="event-highlights">
                <h4>Event Highlights</h4>
                <ul>
                    ${event.highlights.map(highlight => `
                        <li>
                            <i class="fas fa-check"></i>
                            ${highlight}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="ticket-selection">
            <h3>Select your tickets</h3>
            <div class="ticket-types" id="ticketTypes">
                ${createTicketTypesHTML(event)}
            </div>
        </div>
    `;
}

function createTicketTypesHTML(event) {
    const ticketCategories = [
        { name: 'General Admission', description: 'Standard seating with great views of the action', price: event.prices[0] },
        { name: 'Premium', description: 'Enhanced seating with premium amenities and services', price: event.prices[1] },
        { name: 'VIP', description: 'VIP seating with exclusive access and complimentary refreshments', price: event.prices[2] },
        { name: 'Platinum', description: 'Ultimate experience with all privileges and backstage access', price: event.prices[3] }
    ];
    
    return ticketCategories.map((ticket, index) => `
        <div class="ticket-type" onclick="selectTicketType(${index})" tabindex="0" role="button">
            <div class="ticket-info">
                <h4>${ticket.name}</h4>
                <p>${ticket.description}</p>
                <div class="ticket-meta">
                    <span><i class="fas fa-chair"></i> Premium seating</span>
                    <span><i class="fas fa-wifi"></i> Free WiFi</span>
                    <span><i class="fas fa-parking"></i> Parking included</span>
                </div>
            </div>
            <div class="ticket-price-section">
                <div class="ticket-price">₹${ticket.price.toLocaleString()}</div>
                <div class="quantity-selector">
                    <button type="button" class="quantity-btn" onclick="event.stopPropagation(); decreaseQuantity(${index})" aria-label="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="0" min="0" max="8" id="quantity-${index}" onchange="event.stopPropagation(); updateQuantity(${index}, this.value)" aria-label="Ticket quantity">
                    <button type="button" class="quantity-btn" onclick="event.stopPropagation(); increaseQuantity(${index})" aria-label="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${event.id}, ${index}, '${ticket.name}', ${ticket.price})" aria-label="Add to cart">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function initializeTicketSelection(event) {
    // Reset all quantities
    for (let i = 0; i < 4; i++) {
        const quantityInput = document.getElementById(`quantity-${i}`);
        if (quantityInput) {
            quantityInput.value = 0;
        }
    }
}

function selectTicketType(index) {
    document.querySelectorAll('.ticket-type').forEach(type => {
        type.classList.remove('selected');
    });
    
    const selectedType = document.querySelectorAll('.ticket-type')[index];
    if (selectedType) {
        selectedType.classList.add('selected');
    }
}

function increaseQuantity(ticketIndex) {
    const input = document.getElementById(`quantity-${ticketIndex}`);
    if (input) {
        const currentValue = parseInt(input.value) || 0;
        if (currentValue < 8) {
            input.value = currentValue + 1;
            updateQuantity(ticketIndex, input.value);
            animateQuantityChange(input);
        }
    }
}

function decreaseQuantity(ticketIndex) {
    const input = document.getElementById(`quantity-${ticketIndex}`);
    if (input) {
        const currentValue = parseInt(input.value) || 0;
        if (currentValue > 0) {
            input.value = currentValue - 1;
            updateQuantity(ticketIndex, input.value);
            animateQuantityChange(input);
        }
    }
}

function updateQuantity(ticketIndex, quantity) {
    const qty = Math.max(0, Math.min(8, parseInt(quantity) || 0));
    const input = document.getElementById(`quantity-${ticketIndex}`);
    if (input) {
        input.value = qty;
    }
}

function animateQuantityChange(input) {
    input.style.transform = 'scale(1.2)';
    input.style.background = 'var(--primary-50)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
        input.style.background = 'none';
    }, 200);
}

function addToCart(eventId, ticketIndex, ticketName, price) {
    const quantityInput = document.getElementById(`quantity-${ticketIndex}`);
    const quantity = parseInt(quantityInput.value) || 0;
    
    if (quantity === 0) {
        showNotification('Please select quantity first', 'error');
        return;
    }
    
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const cartItem = {
        id: Date.now(),
        eventId: eventId,
        eventTitle: event.title,
        eventImage: event.image,
        eventDate: formatEventDate(event.date, event.time),
        eventVenue: event.venue,
        ticketType: ticketName,
        price: price,
        quantity: quantity,
        total: price * quantity
    };
    
    // Add with animation
    const addBtn = document.querySelector(`.ticket-type:nth-child(${ticketIndex + 1}) .add-to-cart-btn`);
    if (addBtn) {
        const originalContent = addBtn.innerHTML;
        addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
        addBtn.style.background = 'var(--success-500)';
        
        setTimeout(() => {
            addBtn.innerHTML = originalContent;
            addBtn.style.background = 'var(--primary-500)';
        }, 1500);
    }
    
    cart.push(cartItem);
    saveCart();
    updateCartDisplay();
    showNotification(`${quantity} ${ticketName} ticket(s) added to cart!`, 'success');
    
    // Reset quantity
    quantityInput.value = 0;
    
    // Track add to cart
    trackEvent('add_to_cart', { 
        eventId, 
        ticketType: ticketName, 
        quantity, 
        price 
    });
}

// Cart Management
function loadCart() {
    try {
        const savedCart = localStorage.getItem('ticketadda_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('ticketadda_cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartContent = document.getElementById('cartContent');
    const cartFooter = document.getElementById('cartFooter');
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count with animation
    if (cartCount) {
        const oldCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('show', totalItems > 0);
        
        if (totalItems > oldCount) {
            cartCount.style.animation = 'none';
            setTimeout(() => {
                cartCount.style.animation = 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 10);
        }
    }
    
    // Update cart content
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItems) {
            cartItems.style.display = 'block';
            cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
        }
        if (cartFooter) cartFooter.style.display = 'block';
        
        updateCartTotals();
    }
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.eventImage}" alt="${item.eventTitle}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.eventTitle}</div>
                <div class="cart-item-meta">${item.ticketType} • ${item.eventDate}</div>
                <div class="cart-item-controls">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})" aria-label="Decrease quantity">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-input">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})" aria-label="Increase quantity">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div style="text-align: right;">
                        <div class="item-price">₹${item.total.toLocaleString()}</div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item from cart">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateCartItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    if (newQuantity > 8) {
        showNotification('Maximum 8 tickets per item', 'error');
        return;
    }
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        item.total = item.price * newQuantity;
        saveCart();
        updateCartDisplay();
        updateCartTotals();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart', 'success');
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const serviceFees = Math.round(subtotal * 0.02);
    const total = subtotal + serviceFees;
    
    const elements = {
        cartSubtotal: document.getElementById('cartSubtotal'),
        cartFees: document.getElementById('cartFees'),
        cartTotal: document.getElementById('cartTotal')
    };
    
    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
    if (elements.cartFees) elements.cartFees.textContent = `₹${serviceFees.toLocaleString()}`;
    if (elements.cartTotal) elements.cartTotal.textContent = `₹${total.toLocaleString()}`;
}

function toggleCart(forceState) {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        if (forceState !== undefined) {
            cartSidebar.classList.toggle('open', forceState);
        } else {
            cartSidebar.classList.toggle('open');
        }
    }
}

// Checkout Functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        populateCheckoutSummary();
        checkoutModal.classList.add('show');
        toggleCart(false);
        
        // Track checkout start
        trackEvent('checkout_started', { 
            cartValue: cart.reduce((sum, item) => sum + item.total, 0),
            itemCount: cart.length 
        });
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function populateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const serviceFees = Math.round(subtotal * 0.02);
    const taxes = Math.round(subtotal * 0.18);
    const total = subtotal + serviceFees + taxes;
    
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <div class="item-details">
                    <h4>${item.eventTitle}</h4>
                    <p>${item.ticketType} × ${item.quantity}</p>
                </div>
                <div class="item-price">₹${item.total.toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    const elements = {
        checkoutSubtotal: document.getElementById('checkoutSubtotal'),
        checkoutFees: document.getElementById('checkoutFees'),
        checkoutTaxes: document.getElementById('checkoutTaxes'),
        checkoutTotal: document.getElementById('checkoutTotal'),
        payAmount: document.getElementById('payAmount')
    };
    
    if (elements.checkoutSubtotal) elements.checkoutSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
    if (elements.checkoutFees) elements.checkoutFees.textContent = `₹${serviceFees.toLocaleString()}`;
    if (elements.checkoutTaxes) elements.checkoutTaxes.textContent = `₹${taxes.toLocaleString()}`;
    if (elements.checkoutTotal) elements.checkoutTotal.textContent = `₹${total.toLocaleString()}`;
    if (elements.payAmount) elements.payAmount.textContent = total.toLocaleString();
}

function togglePaymentMethods() {
    const cardDetails = document.getElementById('cardDetails');
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (cardDetails) {
        cardDetails.style.display = selectedMethod === 'card' ? 'block' : 'none';
    }
}

function animatePaymentMethodChange() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const activeOption = document.querySelector('input[name="paymentMethod"]:checked')?.closest('.payment-option');
    if (activeOption) {
        activeOption.classList.add('active');
        activeOption.style.transform = 'scale(0.98)';
        setTimeout(() => {
            activeOption.style.transform = 'scale(1)';
        }, 150);
    }
}

function setupAdvancedCardInputs() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            value = value.substring(0, 16);
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue;
            
            // Card type detection animation
            if (value.length >= 4) {
                this.style.borderColor = 'var(--success-500)';
                setTimeout(() => {
                    this.style.borderColor = 'var(--primary-500)';
                }, 300);
            }
        });
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
    
    if (cardCvv) {
        cardCvv.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 3);
        });
    }
}

function processPayment() {
    const requiredFields = ['buyerEmail', 'buyerPhone'];
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    // Validate contact information
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field?.value.trim()) {
            showNotification('Please fill in all contact information', 'error');
            field?.focus();
            return;
        }
    }
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Validate card details if card payment
    if (paymentMethod === 'card') {
        const cardFields = ['cardNumber', 'cardExpiry', 'cardCvv', 'cardName'];
        for (let fieldId of cardFields) {
            const field = document.getElementById(fieldId);
            if (!field?.value.trim()) {
                showNotification('Please fill in all card details', 'error');
                field?.focus();
                return;
            }
        }
    }
    
    // Enhanced loading state
    const payBtn = document.querySelector('.pay-btn');
    const originalContent = payBtn.innerHTML;
    payBtn.innerHTML = `
        <div class="loading-spinner" style="width: 24px; height: 24px; border-width: 3px;"></div>
        Processing payment...
    `;
    payBtn.disabled = true;
    payBtn.style.background = 'var(--secondary-400)';
    
    // Simulate payment processing with realistic delay
    setTimeout(() => {
        // Reset button
        payBtn.innerHTML = originalContent;
        payBtn.disabled = false;
        payBtn.style.background = 'var(--primary-500)';
        
        // Show success
        showNotification('Payment successful! Check your email for tickets.', 'success');
        
        // Track successful purchase
        trackEvent('purchase_completed', {
            cartValue: cart.reduce((sum, item) => sum + item.total, 0),
            paymentMethod,
            itemCount: cart.length
        });
        
        // Clear cart and close modal
        cart = [];
        saveCart();
        updateCartDisplay();
        closeCheckoutModal();
        
        // Show success animation
        celebrateSuccess();
        
    }, 2500);
}

function celebrateSuccess() {
    // Add confetti or celebration animation
    const celebration = document.createElement('div');
    celebration.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2000; text-align: center; animation: bounceIn 0.6s ease;">
            <div style="background: var(--success-500); color: white; padding: 24px 32px; border-radius: 20px; box-shadow: var(--shadow-2xl);">
                <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 16px;"></i>
                <h3 style="margin: 0; font-size: 24px; font-weight: 700;">Payment Successful!</h3>
                <p style="margin: 8px 0 0; opacity: 0.9;">Your tickets will be emailed shortly</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 3000);
}

// Advanced UI Functions
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements as they're added
    const observeNewElements = () => {
        document.querySelectorAll('.event-card:not(.fade-in-up)').forEach(card => {
            observer.observe(card);
        });
    };
    
    // Run initially and after DOM updates
    observeNewElements();
    
    // Re-observe after new elements are added
    const originalDisplayEvents = displayEvents;
    displayEvents = function() {
        originalDisplayEvents();
        setTimeout(observeNewElements, 100);
    };
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide back to top button
        if (scrollTop > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // Navbar hide/show effect
        const navbar = document.querySelector('.header');
        if (navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleFilters() {
    const sidebar = document.getElementById('filtersSidebar');
    const filterBtn = document.getElementById('filterBtn');
    
    if (sidebar && filterBtn) {
        sidebar.classList.toggle('mobile-open');
        filterBtn.classList.toggle('active');
    }
}

function toggleMobileMenu(forceState) {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        if (forceState !== undefined) {
            mobileMenu.classList.toggle('open', forceState);
        } else {
            mobileMenu.classList.toggle('open');
        }
    }
}

// Enhanced Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const notificationIcon = notification?.querySelector('.notification-icon i');
    
    if (!notification || !notificationText) return;
    
    // Update content
    notificationText.textContent = message;
    
    // Update icon and colors based on type
    if (notificationIcon) {
        const iconClasses = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notificationIcon.className = `fas ${iconClasses[type] || iconClasses.success}`;
    }
    
    const colors = {
        success: 'var(--success-500)',
        error: 'var(--error-500)',
        warning: 'var(--warning-500)',
        info: 'var(--primary-500)'
    };
    
    const iconContainer = notification.querySelector('.notification-icon');
    if (iconContainer) {
        iconContainer.style.background = colors[type] || colors.success;
    }
    
    notification.style.borderLeftColor = colors[type] || colors.success;
    
    // Show notification
    notification.classList.add('show');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        hideNotification();
    }, 4000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Performance and UX Enhancements
function preloadImages() {
    // Preload critical images
    const criticalImages = allEvents.slice(0, 6).map(event => event.image);
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function setupProgressiveImageLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { rootMargin: '50px' });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

function setupKeyboardNavigation() {
    // Enhanced keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // Tab navigation for event cards
        if (e.key === 'Enter' && e.target.classList.contains('event-card')) {
            e.target.click();
        }
        
        // Arrow key navigation in cart
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('event-card')) {
                e.preventDefault();
                const cards = Array.from(document.querySelectorAll('.event-card'));
                const currentIndex = cards.indexOf(focusedElement);
                const nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
                
                if (cards[nextIndex]) {
                    cards[nextIndex].focus();
                }
            }
        }
    });
}

function setupPerformanceOptimizations() {
    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate layout if needed
            updateCartDisplay();
        }, 150);
    });
    
    // Optimized scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                ticking = false;
            });
            ticking = true;
        }
    });
}

function setupSearchSuggestions() {
    // Could implement search suggestions here
    // For now, just focus styling
    const searchInputs = document.querySelectorAll('#eventsSearch, #mainSearch');
    
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// Analytics and Tracking
function trackEvent(eventName, properties = {}) {
    console.log('Track Event:', eventName, properties);
    // Integration point for analytics services
    
    // Example: Google Analytics 4
    // gtag('event', eventName, properties);
    
    // Example: Mixpanel
    // mixpanel.track(eventName, properties);
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Global function exports
window.openEventDetail = openEventDetail;
window.closeEventModal = closeEventModal;
window.toggleCart = toggleCart;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckoutModal = closeCheckoutModal;
window.processPayment = processPayment;
window.removeFilter = removeFilter;
window.clearAllFilters = clearAllFilters;
window.loadMoreEvents = loadMoreEvents;
window.toggleFilters = toggleFilters;
window.toggleMobileMenu = toggleMobileMenu;
window.filterByCategory = filterByCategory;
window.performMainSearch = performMainSearch;
window.updatePriceInputs = updatePriceInputs;
window.selectTicketType = selectTicketType;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;
window.scrollToTop = scrollToTop;
window.clearSearch = clearSearch;
window.hideNotification = hideNotification;

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});