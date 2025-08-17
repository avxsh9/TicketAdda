// Event Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEventDetail();
});

// Global cart state
let cart = {};
let ticketPrices = {
    'general': 1200,
    'east-lower': 2800,
    'west-upper': 4200,
    'north': 3500,
    'south': 3500,
    'east-upper': 4200,
    'west-lower': 2800,
    'vip': 8500
};

let ticketAvailability = {
    'general': 12,
    'east-lower': 8,
    'west-upper': 15,
    'north': 20,
    'south': 18,
    'east-upper': 10,
    'west-lower': 12,
    'vip': 3
};

function initializeEventDetail() {
    initializeViewToggle();
    initializeQuantitySelectors();
    initializeSeatingChart();
    updateCartDisplay();
    
    // Load event data from URL parameters
    loadEventData();
}

// Initialize view toggle (List/Seating Chart)
function initializeViewToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const ticketViews = document.querySelectorAll('.tickets-view');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetView = this.dataset.view;
            
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active view
            ticketViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === targetView + 'View') {
                    view.classList.add('active');
                }
            });
        });
    });
}

// Initialize quantity selectors
function initializeQuantitySelectors() {
    const qtyBtns = document.querySelectorAll('.qty-btn');
    
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            const isPlus = this.classList.contains('plus');
            const display = document.querySelector(`.qty-display[data-section="${section}"]`);
            const currentQty = parseInt(display.textContent);
            const maxAvailable = ticketAvailability[section] || 0;
            
            let newQty;
            if (isPlus) {
                newQty = Math.min(currentQty + 1, Math.min(8, maxAvailable)); // Max 8 tickets per order
            } else {
                newQty = Math.max(currentQty - 1, 0);
            }
            
            display.textContent = newQty;
            updateCart(section, newQty);
            updateQuantityButtons(section, newQty, maxAvailable);
        });
    });
    
    // Initialize button states
    Object.keys(ticketPrices).forEach(section => {
        updateQuantityButtons(section, 0, ticketAvailability[section] || 0);
    });
}

// Update quantity button states
function updateQuantityButtons(section, qty, maxAvailable) {
    const plusBtn = document.querySelector(`.qty-btn.plus[data-section="${section}"]`);
    const minusBtn = document.querySelector(`.qty-btn.minus[data-section="${section}"]`);
    
    if (plusBtn) {
        plusBtn.disabled = qty >= Math.min(8, maxAvailable);
    }
    
    if (minusBtn) {
        minusBtn.disabled = qty <= 0;
    }
}

// Initialize seating chart
function initializeSeatingChart() {
    const sections = document.querySelectorAll('.seating-sections .section');
    
    sections.forEach(section => {
        const sectionName = section.dataset.section;
        const available = ticketAvailability[sectionName] || 0;
        
        // Set section availability class
        if (available === 0) {
            section.classList.add('sold-out');
        } else if (available <= 5) {
            section.classList.add('limited');
        }
        
        // Add click handler for seating chart sections
        if (!section.classList.contains('sold-out')) {
            section.addEventListener('click', function() {
                const currentQty = cart[sectionName] || 0;
                const newQty = currentQty > 0 ? 0 : 1; // Toggle between 0 and 1
                
                updateCart(sectionName, newQty);
                updateSeatingChart();
                
                // Update list view quantity as well
                const display = document.querySelector(`.qty-display[data-section="${sectionName}"]`);
                if (display) {
                    display.textContent = newQty;
                    updateQuantityButtons(sectionName, newQty, available);
                }
            });
        }
    });
}

// Update seating chart visual state
function updateSeatingChart() {
    const sections = document.querySelectorAll('.seating-sections .section');
    
    sections.forEach(section => {
        const sectionName = section.dataset.section;
        const qty = cart[sectionName] || 0;
        
        if (qty > 0) {
            section.classList.add('selected');
        } else {
            section.classList.remove('selected');
        }
    });
}

// Update cart
function updateCart(section, quantity) {
    if (quantity <= 0) {
        delete cart[section];
    } else {
        cart[section] = quantity;
    }
    
    updateCartDisplay();
    updateSeatingChart();
}

// Update cart display
function updateCartDisplay() {
    const cartEmpty = document.querySelector('.cart-empty');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const hasItems = Object.keys(cart).length > 0;
    
    if (hasItems) {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartTotal.style.display = 'block';
        
        updateCartItems();
        updateCartTotals();
    } else {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartTotal.style.display = 'none';
    }
}

// Update cart items
function updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    Object.entries(cart).forEach(([section, quantity]) => {
        const price = ticketPrices[section];
        const total = price * quantity;
        const sectionName = getSectionDisplayName(section);
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${sectionName}</h4>
                <span>${quantity} ticket${quantity > 1 ? 's' : ''}</span>
            </div>
            <div class="cart-item-price">
                <div class="price">₹${total.toLocaleString()}</div>
                <div class="qty">₹${price.toLocaleString()} each</div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
}

// Update cart totals
function updateCartTotals() {
    const subtotal = Object.entries(cart).reduce((sum, [section, quantity]) => {
        return sum + (ticketPrices[section] * quantity);
    }, 0);
    
    const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
    const total = subtotal + serviceFee;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('serviceFee').textContent = `₹${serviceFee.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
}

// Get display name for section
function getSectionDisplayName(section) {
    const displayNames = {
        'general': 'General Admission',
        'east-lower': 'East Stand Lower',
        'west-upper': 'West Stand Upper',
        'north': 'North Stand',
        'south': 'South Stand',
        'east-upper': 'East Stand Upper',
        'west-lower': 'West Stand Lower',
        'vip': 'VIP Hospitality Box'
    };
    
    return displayNames[section] || section;
}

// Load event data from URL parameters
function loadEventData() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        // In a real app, this would fetch event data from an API
        // For now, we'll simulate loading data
        console.log('Loading event data for ID:', eventId);
        
        // Update page title based on event
        updateEventData(eventId);
    }
}

// Update event data based on ID
function updateEventData(eventId) {
    const eventData = {
        '1': {
            title: 'Mumbai Indians vs Chennai Super Kings',
            category: 'Cricket',
            venue: 'Wankhede Stadium, Mumbai',
            date: 'Sunday, April 20, 2025',
            time: '3:30 PM IST',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop'
        },
        '2': {
            title: 'Arijit Singh Live in Concert',
            category: 'Concert',
            venue: 'NSCI Dome, Mumbai',
            date: 'Saturday, November 15, 2025',
            time: '7:00 PM IST',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop'
        }
    };
    
    const event = eventData[eventId];
    if (event) {
        document.title = `${event.title} - TicketAdda`;
        
        // Update page content (in a real app, this would be more comprehensive)
        const titleElement = document.querySelector('.event-title');
        if (titleElement) {
            titleElement.textContent = event.title;
        }
    }
}

// Checkout functionality
function proceedToCheckout() {
    if (Object.keys(cart).length === 0) {
        alert('Please select tickets before proceeding to checkout.');
        return;
    }
    
    // Store cart data in sessionStorage for checkout page
    sessionStorage.setItem('ticketCart', JSON.stringify({
        cart: cart,
        prices: ticketPrices,
        eventData: {
            title: document.querySelector('.event-title').textContent,
            date: document.querySelector('.meta-item strong').textContent,
            venue: document.querySelectorAll('.meta-item strong')[1].textContent
        }
    }));
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

// Add checkout button functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('checkout-btn')) {
        proceedToCheckout();
    }
});

// Share event functionality
function shareEvent() {
    if (navigator.share) {
        navigator.share({
            title: document.querySelector('.event-title').textContent,
            text: 'Check out this event on TicketAdda!',
            url: window.location.href
        });
    } else {
        // Fallback - copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Event URL copied to clipboard!');
        });
    }
}

// Favorite event functionality
function toggleFavorite() {
    const favBtn = document.querySelector('.favorite-btn');
    if (favBtn) {
        favBtn.classList.toggle('active');
        const isFavorited = favBtn.classList.contains('active');
        
        // In a real app, this would save to user's favorites
        console.log('Event favorited:', isFavorited);
    }
}

// Add event to calendar functionality
function addToCalendar() {
    const eventTitle = document.querySelector('.event-title').textContent;
    const eventDate = document.querySelector('.meta-item strong').textContent;
    const eventVenue = document.querySelectorAll('.meta-item strong')[1].textContent;
    
    // Create calendar event URL (Google Calendar)
    const startDate = new Date('2025-04-20T15:30:00').toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date('2025-04-20T22:30:00').toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(eventVenue)}&details=${encodeURIComponent('Tickets purchased via TicketAdda')}`;
    
    window.open(calendarUrl, '_blank');
}

// Mobile quantity adjustment
function adjustQuantityMobile(section, change) {
    const display = document.querySelector(`.qty-display[data-section="${section}"]`);
    if (!display) return;
    
    const currentQty = parseInt(display.textContent);
    const maxAvailable = ticketAvailability[section] || 0;
    
    let newQty;
    if (change > 0) {
        newQty = Math.min(currentQty + change, Math.min(8, maxAvailable));
    } else {
        newQty = Math.max(currentQty + change, 0);
    }
    
    display.textContent = newQty;
    updateCart(section, newQty);
    updateQuantityButtons(section, newQty, maxAvailable);
}

// Keyboard navigation for seating chart
document.addEventListener('keydown', function(e) {
    if (document.querySelector('.tickets-view#seatingView.active')) {
        const sections = Array.from(document.querySelectorAll('.seating-sections .section:not(.sold-out)'));
        const focusedSection = document.activeElement;
        const currentIndex = sections.indexOf(focusedSection);
        
        let nextIndex;
        switch(e.key) {
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % sections.length;
                sections[nextIndex].focus();
                e.preventDefault();
                break;
            case 'ArrowLeft':
                nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
                sections[nextIndex].focus();
                e.preventDefault();
                break;
            case 'Enter':
            case ' ':
                if (focusedSection.classList.contains('section')) {
                    focusedSection.click();
                    e.preventDefault();
                }
                break;
        }
    }
});

// Make sections focusable for keyboard navigation
document.querySelectorAll('.seating-sections .section:not(.sold-out)').forEach(section => {
    section.setAttribute('tabindex', '0');
});

// Analytics tracking (placeholder)
function trackEventView(eventId) {
    console.log('Event view tracked:', eventId);
    // In a real app, this would send analytics data
}

function trackTicketSelection(section, quantity) {
    console.log('Ticket selection tracked:', { section, quantity });
    // In a real app, this would send analytics data
}

// Initialize analytics
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');
if (eventId) {
    trackEventView(eventId);
}

// Performance optimization: Lazy load similar events
function loadSimilarEvents() {
    const similarEvents = document.querySelector('.similar-events');
    if (similarEvents) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Load similar events (in a real app, this would be an API call)
                    console.log('Loading similar events...');
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(similarEvents);
    }
}

// Initialize similar events loading
loadSimilarEvents();

// Error handling for network requests
window.addEventListener('online', function() {
    console.log('Connection restored');
    // Retry any failed requests
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // Show offline message
});
