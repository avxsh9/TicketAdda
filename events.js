// TicketAdda Events Page - Complete Functionality
// State Management
let allEvents = [];
let filteredEvents = [];
let displayedEvents = [];
let currentFilters = {
    categories: [],
    locations: [],
    dates: [],
    priceMin: 0,
    priceMax: 10000,
    search: ''
};
let currentSort = 'date';
let eventsPerPage = 12;
let currentPage = 1;
let cart = [];
let selectedEvent = null;

// Mock Events Data with Diverse Images
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
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [1200, 2500, 4500, 8500],
        ticketsAvailable: 89,
        description: "Witness the ultimate cricket showdown between two powerhouse teams. An electrifying match with world-class players.",
        highlights: ["Premium seating available", "Food & beverages included", "Live commentary", "Parking facilities"]
    },
    {
        id: 2,
        title: "Arijit Singh Live in Concert",
        category: "concerts",
        subcategory: "bollywood",
        location: "mumbai",
        venue: "NSCI Dome, Mumbai",
        date: "2024-11-15",
        time: "19:00",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
        badge: "hot",
        prices: [2500, 4500, 7500, 12000],
        ticketsAvailable: 234,
        description: "Experience the magic of Arijit Singh's soulful voice live. An unforgettable evening of melodious Bollywood hits.",
        highlights: ["VIP meet & greet packages", "Professional sound system", "Limited edition merchandise", "Photo opportunities"]
    },
    {
        id: 3,
        title: "Mumbai City FC vs Bengaluru FC",
        category: "sports",
        subcategory: "football",
        location: "mumbai",
        venue: "Mumbai Football Arena, Mumbai",
        date: "2024-12-08",
        time: "19:30",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
        prices: [800, 1500, 2500, 3500],
        ticketsAvailable: 156,
        description: "Indian Super League action at its finest. Two top teams battling for supremacy in this crucial match.",
        highlights: ["Family-friendly atmosphere", "Stadium food courts", "Official merchandise stalls", "Easy metro connectivity"]
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
        image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=250&fit=crop",
        prices: [1500, 2500, 4000, 6000],
        ticketsAvailable: 67,
        description: "A grand musical adaptation of the classic Bollywood film. Spectacular costumes, sets, and performances.",
        highlights: ["Award-winning production", "Live orchestra", "Elaborate costumes", "Historic venue"]
    },
    {
        id: 5,
        title: "U Mumba vs Puneri Paltan",
        category: "sports",
        subcategory: "kabaddi",
        location: "mumbai",
        venue: "Sardar Vallabhbhai Patel Stadium, Mumbai",
        date: "2024-01-18",
        time: "20:00",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop",
        prices: [500, 800, 1200, 2000],
        ticketsAvailable: 298,
        description: "Pro Kabaddi League excitement with Maharashtra's finest teams. High-energy action and passionate crowd support.",
        highlights: ["Local team rivalry", "Traditional sport", "Affordable pricing", "Family packages available"]
    },
    {
        id: 6,
        title: "Bollywood Night Live",
        category: "concerts",
        subcategory: "bollywood",
        location: "mumbai",
        venue: "Jio Garden, Mumbai",
        date: "2024-12-08",
        time: "20:00",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
        badge: "new",
        prices: [1800, 3000, 5000, 7500],
        ticketsAvailable: 189,
        description: "A spectacular evening featuring the greatest Bollywood hits performed by top playback singers and live musicians.",
        highlights: ["Multiple playback singers", "Live band performance", "Classic and modern hits", "Open-air venue"]
    },
    {
        id: 7,
        title: "Coldplay - Music of the Spheres Tour",
        category: "concerts",
        subcategory: "international",
        location: "mumbai",
        venue: "DY Patil Stadium, Mumbai",
        date: "2024-01-21",
        time: "19:00",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [4500, 8500, 15000, 25000],
        ticketsAvailable: 423,
        description: "The legendary British band returns to India with their spectacular world tour featuring stunning visuals and hit songs.",
        highlights: ["International superstar", "LED wristbands included", "360-degree stage", "Eco-friendly production"]
    },
    {
        id: 8,
        title: "Royal Challengers Bangalore vs Delhi Capitals",
        category: "sports",
        subcategory: "cricket",
        location: "bangalore",
        venue: "M. Chinnaswamy Stadium, Bangalore",
        date: "2024-04-25",
        time: "19:30",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop",
        prices: [1000, 2200, 4000, 7500],
        ticketsAvailable: 178,
        description: "Home team RCB takes on Delhi Capitals in this high-stakes IPL encounter. Experience the roar of the crowd.",
        highlights: ["Home advantage for RCB", "Stadium atmosphere", "Celebrity sightings", "Local food vendors"]
    },
    {
        id: 9,
        title: "A.R. Rahman Live Symphony",
        category: "concerts",
        subcategory: "classical",
        location: "delhi",
        venue: "Pragati Maidan, Delhi",
        date: "2024-12-15",
        time: "18:00",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
        badge: "hot",
        prices: [3000, 5500, 8500, 15000],
        ticketsAvailable: 267,
        description: "The maestro A.R. Rahman presents a symphonic experience with live orchestra performing his greatest compositions.",
        highlights: ["Oscar-winning composer", "Full symphony orchestra", "Classic movie songs", "Digital light show"]
    },
    {
        id: 10,
        title: "India vs Australia ODI",
        category: "sports",
        subcategory: "cricket",
        location: "delhi",
        venue: "Arun Jaitley Stadium, Delhi",
        date: "2024-03-17",
        time: "14:30",
        image: "https://images.unsplash.com/photo-1578662015688-42d10aa6fcd8?w=400&h=250&fit=crop",
        prices: [1500, 3000, 5500, 9000],
        ticketsAvailable: 312,
        description: "International cricket at its finest. Watch Team India take on Australia in this crucial ODI match.",
        highlights: ["International cricket", "Top players", "Premium facilities", "Historic venue"]
    },
    {
        id: 11,
        title: "Sunburn Festival Goa",
        category: "festivals",
        subcategory: "music",
        location: "goa",
        venue: "Vagator Beach, Goa",
        date: "2024-12-28",
        time: "16:00",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [2000, 3500, 6000, 12000],
        ticketsAvailable: 456,
        description: "India's biggest electronic dance music festival featuring international DJs and stunning beach location.",
        highlights: ["International DJs", "Beach location", "3-day festival", "Camping options"]
    },
    {
        id: 12,
        title: "Kapil Sharma Comedy Show",
        category: "comedy",
        subcategory: "standup",
        location: "pune",
        venue: "Shaniwar Wada Grounds, Pune",
        date: "2024-11-22",
        time: "20:00",
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=250&fit=crop",
        prices: [800, 1200, 1800, 2500],
        ticketsAvailable: 145,
        description: "Laugh out loud with India's comedy king Kapil Sharma in his latest stand-up comedy special.",
        highlights: ["Family-friendly comedy", "Interactive segments", "Celebrity guests", "Photo sessions"]
    },
    {
        id: 13,
        title: "Chennai Super Kings vs Kolkata Knight Riders",
        category: "sports",
        subcategory: "cricket",
        location: "chennai",
        venue: "M.A. Chidambaram Stadium, Chennai",
        date: "2024-05-05",
        time: "15:30",
        image: "https://images.unsplash.com/photo-1602232716784-8b89c4ad82df?w=400&h=250&fit=crop",
        prices: [1100, 2300, 4200, 7800],
        ticketsAvailable: 203,
        description: "MS Dhoni's CSK faces off against KKR in this thrilling IPL encounter at the iconic Chepauk Stadium.",
        highlights: ["Captain Cool Dhoni", "Historic stadium", "Local delicacies", "Passionate fan base"]
    },
    {
        id: 14,
        title: "Ed Sheeran - Mathematics Tour",
        category: "concerts",
        subcategory: "international",
        location: "bangalore",
        venue: "Bangalore Palace Grounds",
        date: "2024-03-16",
        time: "18:30",
        image: "https://images.unsplash.com/photo-1471979484510-6caf0bfbb4c5?w=400&h=250&fit=crop",
        badge: "trending",
        prices: [5000, 9500, 18000, 35000],
        ticketsAvailable: 389,
        description: "Global superstar Ed Sheeran brings his Mathematics Tour to India with an intimate acoustic performance.",
        highlights: ["Grammy winner", "Acoustic performance", "Loop station magic", "Hit songs guaranteed"]
    },
    {
        id: 15,
        title: "Hamlet - Royal Shakespeare Company",
        category: "theater",
        subcategory: "drama",
        location: "delhi",
        venue: "Kamani Auditorium, Delhi",
        date: "2024-10-14",
        time: "19:00",
        image: "https://images.unsplash.com/photo-1578662018438-6d18a5e1f9e1?w=400&h=250&fit=crop",
        prices: [1200, 2000, 3500, 5000],
        ticketsAvailable: 89,
        description: "Shakespeare's timeless tragedy performed by the renowned Royal Shakespeare Company visiting India.",
        highlights: ["World-class actors", "Classic literature", "Period costumes", "English performance"]
    },
    {
        id: 16,
        title: "Zakir Khan Comedy Night",
        category: "comedy",
        subcategory: "standup",
        location: "hyderabad",
        venue: "Shilpakala Vedika, Hyderabad",
        date: "2024-12-01",
        time: "20:30",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=250&fit=crop",
        prices: [600, 1000, 1500, 2200],
        ticketsAvailable: 178,
        description: "Popular comedian Zakir Khan brings his unique storytelling style and hilarious observations to Hyderabad.",
        highlights: ["Relatable humor", "Hindi comedy", "Interactive show", "Popular comedian"]
    },
    {
        id: 17,
        title: "Bangalore FC vs Hyderabad FC",
        category: "sports",
        subcategory: "football",
        location: "bangalore",
        venue: "Sree Kanteerava Stadium, Bangalore",
        date: "2024-02-24",
        time: "19:30",
        image: "https://images.unsplash.com/photo-1614632537190-23e4225324c7?w=400&h=250&fit=crop",
        prices: [700, 1300, 2200, 3800],
        ticketsAvailable: 234,
        description: "ISL action featuring Bangalore FC at their home ground. Passionate local support and thrilling football.",
        highlights: ["Home team advantage", "Local support", "Stadium atmosphere", "Post-match celebrations"]
    },
    {
        id: 18,
        title: "Divine Hip Hop Concert",
        category: "concerts",
        subcategory: "hip-hop",
        location: "pune",
        venue: "Pune Arena, Pune",
        date: "2024-11-08",
        time: "20:00",
        image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&h=250&fit=crop",
        badge: "new",
        prices: [1200, 2000, 3500, 5500],
        ticketsAvailable: 167,
        description: "Mumbai's rap sensation Divine performs his biggest hits live. Raw energy and authentic Indian hip-hop.",
        highlights: ["Indian rap pioneer", "High-energy performance", "Street culture", "Young audience"]
    },
    {
        id: 19,
        title: "Romeo and Juliet Ballet",
        category: "theater",
        subcategory: "ballet",
        location: "chennai",
        venue: "Music Academy, Chennai",
        date: "2024-09-21",
        time: "18:30",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop",
        prices: [1800, 2800, 4200, 6500],
        ticketsAvailable: 92,
        description: "Classical ballet performance of Shakespeare's immortal love story by acclaimed international dancers.",
        highlights: ["International ballet company", "Classical music", "Elegant choreography", "Cultural experience"]
    },
    {
        id: 20,
        title: "Rajasthan Royals vs Punjab Kings",
        category: "sports",
        subcategory: "cricket",
        location: "jaipur",
        venue: "Sawai Mansingh Stadium, Jaipur",
        date: "2024-04-28",
        time: "15:30",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=250&fit=crop",
        prices: [900, 1800, 3200, 6000],
        ticketsAvailable: 278,
        description: "IPL cricket in the Pink City. Rajasthan Royals defend their home turf against Punjab Kings.",
        highlights: ["Pink City atmosphere", "Royal hospitality", "Historic stadium", "Local Rajasthani culture"]
    },
    {
        id: 21,
        title: "Lata Mangeshkar Tribute Concert",
        category: "concerts",
        subcategory: "classical",
        location: "mumbai",
        venue: "Shanmukhananda Hall, Mumbai",
        date: "2024-10-31",
        time: "18:00",
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=250&fit=crop",
        prices: [1500, 2500, 4000, 6500],
        ticketsAvailable: 134,
        description: "A tribute to the nightingale of India featuring renowned classical and playback singers.",
        highlights: ["Legendary songs", "Classical musicians", "Emotional tribute", "Cultural significance"]
    },
    {
        id: 22,
        title: "Pune Warriors vs Delhi Defenders",
        category: "sports",
        subcategory: "basketball",
        location: "pune",
        venue: "Shree Shiv Chhatrapati Sports Complex, Pune",
        date: "2024-02-14",
        time: "19:00",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop",
        prices: [600, 1100, 1800, 2800],
        ticketsAvailable: 145,
        description: "Professional basketball league action featuring India's top teams and international players.",
        highlights: ["Fast-paced action", "International players", "Modern arena", "Youth appeal"]
    },
    {
        id: 23,
        title: "Sunidhi Chauhan Live",
        category: "concerts",
        subcategory: "bollywood",
        location: "hyderabad",
        venue: "Gachibowli Stadium, Hyderabad",
        date: "2024-11-25",
        time: "19:30",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=250&fit=crop",
        prices: [2200, 3800, 6200, 9500],
        ticketsAvailable: 198,
        description: "Powerhouse vocalist Sunidhi Chauhan performs her greatest hits in an electrifying live concert.",
        highlights: ["Powerful vocals", "Hit Bollywood songs", "High energy", "Professional production"]
    },
    {
        id: 24,
        title: "Comedy Central Live - Bangalore",
        category: "comedy",
        subcategory: "standup",
        location: "bangalore",
        venue: "Forum Mall Amphitheater, Bangalore",
        date: "2024-10-19",
        time: "20:00",
        image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=250&fit=crop",
        prices: [800, 1200, 1800, 2500],
        ticketsAvailable: 156,
        description: "Multi-comedian show featuring India's funniest stand-up comedians in one spectacular evening.",
        highlights: ["Multiple comedians", "English comedy", "Urban humor", "Interactive segments"]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    allEvents = [...mockEvents];
    filteredEvents = [...allEvents];
    loadCart();
    setupEventListeners();
    applyFilters();
    updateCartDisplay();
    initializeDateFilters();
}

function setupEventListeners() {
    // Search functionality
    const eventsSearch = document.getElementById('eventsSearch');
    const mainSearch = document.getElementById('mainSearch');
    const sortSelect = document.getElementById('sortSelect');
    
    if (eventsSearch) {
        eventsSearch.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (mainSearch) {
        mainSearch.addEventListener('input', debounce(handleMainSearch, 300));
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Navigation menu
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterByCategory(category);
            setActiveNavLink(this);
        });
    });
    
    // Price range sliders
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    
    if (priceSliderMin && priceSliderMax) {
        priceSliderMin.addEventListener('input', updatePriceInputs);
        priceSliderMax.addEventListener('input', updatePriceInputs);
    }
    
    // Filter checkboxes
    document.querySelectorAll('input[data-filter]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeEventModal();
            closeCheckoutModal();
        }
    });
    
    // Payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentMethods);
    });
    
    // Card input formatting
    setupCardInputFormatting();
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

function handleSearch() {
    const query = document.getElementById('eventsSearch').value.toLowerCase();
    currentFilters.search = query;
    applyFilters();
}

function handleMainSearch() {
    const query = document.getElementById('mainSearch').value.toLowerCase();
    currentFilters.search = query;
    applyFilters();
    // Sync with events search
    const eventsSearch = document.getElementById('eventsSearch');
    if (eventsSearch) {
        eventsSearch.value = query;
    }
}

function performMainSearch() {
    handleMainSearch();
}

function handleSort() {
    currentSort = document.getElementById('sortSelect').value;
    applyFilters();
}

function setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function filterByCategory(category) {
    // Clear current category filters
    currentFilters.categories = [category];
    
    // Update checkboxes
    document.querySelectorAll('input[data-filter="category"]').forEach(checkbox => {
        checkbox.checked = checkbox.value === category;
    });
    
    applyFilters();
}

function applyFilters() {
    // Collect filter values
    currentFilters.categories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked')).map(cb => cb.value);
    currentFilters.locations = Array.from(document.querySelectorAll('input[data-filter="location"]:checked')).map(cb => cb.value);
    currentFilters.dates = Array.from(document.querySelectorAll('input[data-filter="date"]:checked')).map(cb => cb.value);
    
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (minPrice && maxPrice) {
        currentFilters.priceMin = parseInt(minPrice.value) || 0;
        currentFilters.priceMax = parseInt(maxPrice.value) || 10000;
    }
    
    // Filter events
    filteredEvents = allEvents.filter(event => {
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
            const eventDate = new Date(event.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            let matchesDate = false;
            
            currentFilters.dates.forEach(dateFilter => {
                switch (dateFilter) {
                    case 'today':
                        if (eventDate.toDateString() === today.toDateString()) matchesDate = true;
                        break;
                    case 'tomorrow':
                        if (eventDate.toDateString() === tomorrow.toDateString()) matchesDate = true;
                        break;
                    case 'this-week':
                        const weekFromNow = new Date(today);
                        weekFromNow.setDate(today.getDate() + 7);
                        if (eventDate >= today && eventDate <= weekFromNow) matchesDate = true;
                        break;
                    case 'this-month':
                        if (eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear()) matchesDate = true;
                        break;
                    case 'next-month':
                        const nextMonth = new Date(today);
                        nextMonth.setMonth(today.getMonth() + 1);
                        if (eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear()) matchesDate = true;
                        break;
                }
            });
            
            if (!matchesDate) return false;
        }
        
        return true;
    });
    
    // Sort events
    sortEvents();
    
    // Reset pagination
    currentPage = 1;
    displayEvents();
    updateActiveFilters();
    updateResultsCount();
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
                // Mock distance sorting
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });
}

function displayEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    const startIndex = 0;
    const endIndex = currentPage * eventsPerPage;
    displayedEvents = filteredEvents.slice(startIndex, endIndex);
    
    grid.innerHTML = displayedEvents.map(event => createEventCardHTML(event)).join('');
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex < filteredEvents.length ? 'block' : 'none';
    }
    
    // Add animation to new cards
    setTimeout(() => {
        grid.querySelectorAll('.event-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 50}ms`;
            card.classList.add('fade-in-up');
        });
    }, 100);
}

function createEventCardHTML(event) {
    const formattedDate = formatEventDate(event.date, event.time);
    const badgeHTML = event.badge ? `<div class="event-badge ${event.badge}">${event.badge}</div>` : '';
    const minPrice = Math.min(...event.prices);
    const maxPrice = Math.max(...event.prices);
    
    return `
        <div class="event-card" onclick="openEventDetail(${event.id})">
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
                    <i class="fas fa-calendar"></i>
                    ${formattedDate}
                </p>
                <div class="event-stats">
                    <span class="tickets-available">
                        <i class="fas fa-ticket-alt"></i>
                        ${event.ticketsAvailable} tickets available
                    </span>
                    <span class="price-range">₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

function formatEventDate(date, time) {
    const eventDate = new Date(date);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    let formattedDate = eventDate.toLocaleDateString('en-IN', options);
    
    if (time) {
        const [hours, minutes] = time.split(':');
        const timeObj = new Date();
        timeObj.setHours(parseInt(hours), parseInt(minutes));
        const timeString = timeObj.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        formattedDate += ` • ${timeString}`;
    }
    
    return formattedDate;
}

function loadMoreEvents() {
    currentPage++;
    displayEvents();
}

function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    const filters = [];
    
    // Add category filters
    currentFilters.categories.forEach(cat => {
        filters.push({
            type: 'category',
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1)
        });
    });
    
    // Add location filters
    currentFilters.locations.forEach(loc => {
        filters.push({
            type: 'location',
            value: loc,
            label: loc.charAt(0).toUpperCase() + loc.slice(1)
        });
    });
    
    // Add date filters
    currentFilters.dates.forEach(date => {
        filters.push({
            type: 'date',
            value: date,
            label: date.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        });
    });
    
    // Add search filter
    if (currentFilters.search) {
        filters.push({
            type: 'search',
            value: 'search',
            label: `"${currentFilters.search}"`
        });
    }
    
    container.innerHTML = filters.map(filter => `
        <span class="filter-tag">
            ${filter.label}
            <button class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')">×</button>
        </span>
    `).join('');
}

function removeFilter(type, value) {
    switch (type) {
        case 'category':
            currentFilters.categories = currentFilters.categories.filter(cat => cat !== value);
            document.querySelector(`input[data-filter="category"][value="${value}"]`).checked = false;
            break;
        case 'location':
            currentFilters.locations = currentFilters.locations.filter(loc => loc !== value);
            document.querySelector(`input[data-filter="location"][value="${value}"]`).checked = false;
            break;
        case 'date':
            currentFilters.dates = currentFilters.dates.filter(date => date !== value);
            document.querySelector(`input[data-filter="date"][value="${value}"]`).checked = false;
            break;
        case 'search':
            currentFilters.search = '';
            const eventsSearch = document.getElementById('eventsSearch');
            const mainSearch = document.getElementById('mainSearch');
            if (eventsSearch) eventsSearch.value = '';
            if (mainSearch) mainSearch.value = '';
            break;
    }
    
    applyFilters();
}

function clearAllFilters() {
    // Reset all filter states
    currentFilters = {
        categories: [],
        locations: [],
        dates: [],
        priceMin: 0,
        priceMax: 10000,
        search: ''
    };
    
    // Reset UI
    document.querySelectorAll('input[data-filter]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const eventsSearch = document.getElementById('eventsSearch');
    const mainSearch = document.getElementById('mainSearch');
    
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    if (priceSliderMin) priceSliderMin.value = 0;
    if (priceSliderMax) priceSliderMax.value = 10000;
    if (eventsSearch) eventsSearch.value = '';
    if (mainSearch) mainSearch.value = '';
    
    applyFilters();
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
    
    if (minValue >= maxValue) {
        if (minSlider === document.activeElement) {
            maxValue = minValue;
            maxSlider.value = maxValue;
        } else {
            minValue = maxValue;
            minSlider.value = minValue;
        }
    }
    
    if (minInput) minInput.value = minValue === 0 ? '' : minValue;
    if (maxInput) maxInput.value = maxValue === 10000 ? '' : maxValue;
    
    currentFilters.priceMin = minValue;
    currentFilters.priceMax = maxValue;
    
    applyFilters();
}

function initializeDateFilters() {
    // Set minimum date to today for date filters
    const today = new Date().toISOString().split('T')[0];
    
    // Update relative date filters based on current date
    updateDateFilterCounts();
}

function updateDateFilterCounts() {
    // This would normally update counts based on actual data
    // For demo purposes, we'll keep static counts
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
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.venue}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
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
            
            <div class="event-highlights" style="margin-top: 20px;">
                <h4 style="margin-bottom: 12px; font-weight: 600;">Event Highlights:</h4>
                <ul style="list-style: none; padding-left: 0;">
                    ${event.highlights.map(highlight => `
                        <li style="padding: 4px 0; color: var(--text-secondary);">
                            <i class="fas fa-check" style="color: var(--success-color); margin-right: 8px;"></i>
                            ${highlight}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="ticket-selection">
            <h3>Select tickets</h3>
            <div class="ticket-types" id="ticketTypes">
                ${createTicketTypesHTML(event)}
            </div>
        </div>
    `;
}

function createTicketTypesHTML(event) {
    const ticketCategories = [
        { name: 'General Admission', description: 'Standard seating with great views', price: event.prices[0] },
        { name: 'Premium', description: 'Enhanced seating with premium amenities', price: event.prices[1] },
        { name: 'VIP', description: 'VIP seating with exclusive access', price: event.prices[2] },
        { name: 'Platinum', description: 'Ultimate experience with all privileges', price: event.prices[3] }
    ];
    
    return ticketCategories.map((ticket, index) => `
        <div class="ticket-type" onclick="selectTicketType(${index})">
            <div class="ticket-info">
                <h4>${ticket.name}</h4>
                <p>${ticket.description}</p>
                <div class="ticket-meta">
                    <span><i class="fas fa-chair"></i> Premium seating</span>
                    <span><i class="fas fa-wifi"></i> Free WiFi</span>
                </div>
            </div>
            <div class="ticket-price-section">
                <div class="ticket-price">₹${ticket.price.toLocaleString()}</div>
                <div class="quantity-selector">
                    <button type="button" class="quantity-btn" onclick="event.stopPropagation(); decreaseQuantity(${index})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="0" min="0" max="8" id="quantity-${index}" onchange="event.stopPropagation(); updateQuantity(${index}, this.value)">
                    <button type="button" class="quantity-btn" onclick="event.stopPropagation(); increaseQuantity(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${event.id}, ${index}, '${ticket.name}', ${ticket.price})">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function initializeTicketSelection(event) {
    // Reset all quantities to 0
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
        id: Date.now(), // Unique cart item ID
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
    
    cart.push(cartItem);
    saveCart();
    updateCartDisplay();
    showNotification(`${quantity} ticket(s) added to cart!`);
    
    // Reset quantity
    quantityInput.value = 0;
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
    
    // Update cart count
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('show', totalItems > 0);
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
                <img src="${item.eventImage}" alt="${item.eventTitle}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.eventTitle}</div>
                <div class="cart-item-meta">${item.ticketType} • ${item.eventDate}</div>
                <div class="cart-item-controls">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-input">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div style="text-align: right;">
                        <div class="item-price">₹${item.total.toLocaleString()}</div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" style="background: none; border: none; color: var(--error-color); font-size: 12px; cursor: pointer;">
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
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const serviceFees = Math.round(subtotal * 0.02); // 2% service fee
    const total = subtotal + serviceFees;
    
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartFees = document.getElementById('cartFees');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
    if (cartFees) cartFees.textContent = `₹${serviceFees.toLocaleString()}`;
    if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString()}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
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
        toggleCart(); // Close cart
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function populateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutFees = document.getElementById('checkoutFees');
    const checkoutTaxes = document.getElementById('checkoutTaxes');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems) return;
    
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const serviceFees = Math.round(subtotal * 0.02);
    const taxes = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + serviceFees + taxes;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-details">
                <h4>${item.eventTitle}</h4>
                <p>${item.ticketType} × ${item.quantity}</p>
            </div>
            <div class="item-price">₹${item.total.toLocaleString()}</div>
        </div>
    `).join('');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
    if (checkoutFees) checkoutFees.textContent = `₹${serviceFees.toLocaleString()}`;
    if (checkoutTaxes) checkoutTaxes.textContent = `₹${taxes.toLocaleString()}`;
    if (checkoutTotal) checkoutTotal.textContent = `₹${total.toLocaleString()}`;
}

function togglePaymentMethods() {
    const cardDetails = document.getElementById('cardDetails');
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (cardDetails) {
        cardDetails.style.display = selectedMethod === 'card' ? 'block' : 'none';
    }
    
    // Update payment option styles
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const activeOption = document.querySelector('input[name="paymentMethod"]:checked')?.closest('.payment-option');
    if (activeOption) {
        activeOption.classList.add('active');
    }
}

function setupCardInputFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ');
            this.value = formattedValue;
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
    const buyerEmail = document.getElementById('buyerEmail')?.value;
    const buyerPhone = document.getElementById('buyerPhone')?.value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (!buyerEmail || !buyerPhone) {
        showNotification('Please fill in contact information', 'error');
        return;
    }
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value;
        const cardExpiry = document.getElementById('cardExpiry')?.value;
        const cardCvv = document.getElementById('cardCvv')?.value;
        const cardName = document.getElementById('cardName')?.value;
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            showNotification('Please fill in card details', 'error');
            return;
        }
    }
    
    // Show loading state
    const payBtn = document.querySelector('.pay-btn');
    const originalText = payBtn.innerHTML;
    payBtn.innerHTML = '<div class="loading-spinner"></div> Processing...';
    payBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Reset button
        payBtn.innerHTML = originalText;
        payBtn.disabled = false;
        
        // Show success
        showNotification('Payment successful! Check your email for tickets.', 'success');
        
        // Clear cart and close modal
        cart = [];
        saveCart();
        updateCartDisplay();
        closeCheckoutModal();
        
        // Optionally redirect to success page
        setTimeout(() => {
            // window.location.href = 'booking-success.html';
        }, 2000);
        
    }, 2000);
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    
    // Update notification style based on type
    notification.className = 'notification show';
    if (type === 'error') {
        notification.style.background = 'var(--error-color)';
    } else if (type === 'warning') {
        notification.style.background = 'var(--warning-color)';
    } else {
        notification.style.background = 'var(--success-color)';
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleFilters() {
    const sidebar = document.getElementById('filtersSidebar');
    const filterBtn = document.getElementById('filterBtn');
    
    if (sidebar && filterBtn) {
        sidebar.classList.toggle('mobile-open');
        filterBtn.classList.toggle('active');
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('open');
    }
}

// Scroll to top function for better UX
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top functionality on logo click
document.addEventListener('DOMContentLoaded', function() {
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToTop();
        });
    }
});

// Performance optimization - Lazy loading for images
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add some sample events for different locations
function addMoreMockEvents() {
    const additionalEvents = [
        {
            id: 25,
            title: "Delhi Capitals vs Rajasthan Royals",
            category: "sports",
            subcategory: "cricket",
            location: "delhi",
            venue: "Arun Jaitley Stadium, Delhi",
            date: "2024-05-12",
            time: "19:30",
            image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop",
            prices: [1300, 2600, 4800, 8200],
            ticketsAvailable: 167,
            description: "Capital clash as Delhi Capitals host Rajasthan Royals in this crucial IPL fixture.",
            highlights: ["Home team advantage", "Capital city energy", "Star players", "Modern facilities"]
        },
        {
            id: 26,
            title: "Shreya Ghoshal Live Concert",
            category: "concerts",
            subcategory: "classical",
            location: "chennai",
            venue: "Music Academy, Chennai",
            date: "2024-12-20",
            time: "18:30",
            image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=250&fit=crop",
            badge: "hot",
            prices: [2000, 3500, 5500, 8500],
            ticketsAvailable: 145,
            description: "The melodious voice of Shreya Ghoshal in a classical music concert featuring her timeless hits.",
            highlights: ["Classical music", "South Indian audience", "Traditional venue", "Acoustic excellence"]
        }
    ];
    
    allEvents.push(...additionalEvents);
}

// Initialize additional events
addMoreMockEvents();

// Export functions for global access
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

// Analytics and tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log('Track Event:', eventName, properties);
    // Integrate with analytics service like Google Analytics, Mixpanel, etc.
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send to error tracking service
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}