// Events Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize events page functionality
    initializeFilters();
    initializeSearch();
    initializeSorting();
    initializeMobileFilters();
    
    // Load initial events data
    loadEvents();
});

// Filter functionality
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const removeFilterBtns = document.querySelectorAll('.remove-filter');
    
    // Handle filter checkbox changes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateActiveFilters();
            filterEvents();
            updateResultsCount();
        });
    });
    
    // Handle clear all filters
    clearFiltersBtn.addEventListener('click', function() {
        clearAllFilters();
    });
    
    // Handle remove individual filters
    removeFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
            removeFilter(filterValue);
        });
    });
    
    // Price range sliders
    const minPriceSlider = document.getElementById('priceSliderMin');
    const maxPriceSlider = document.getElementById('priceSliderMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (minPriceSlider && maxPriceSlider) {
        minPriceSlider.addEventListener('input', function() {
            minPriceInput.value = this.value;
            filterEvents();
        });
        
        maxPriceSlider.addEventListener('input', function() {
            maxPriceInput.value = this.value;
            filterEvents();
        });
    }
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.addEventListener('change', function() {
            minPriceSlider.value = this.value;
            filterEvents();
        });
        
        maxPriceInput.addEventListener('change', function() {
            maxPriceSlider.value = this.value;
            filterEvents();
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('eventsSearch');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterEvents();
                updateResultsCount();
            }, 300);
        });
    }
}

// Sorting functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortEvents(this.value);
        });
    }
}

// Mobile filters
function initializeMobileFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    
    if (filterBtn && filtersSidebar) {
        filterBtn.addEventListener('click', function() {
            filtersSidebar.classList.toggle('mobile-open');
            this.classList.toggle('active');
        });
        
        // Close filters when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!filtersSidebar.contains(e.target) && !filterBtn.contains(e.target)) {
                    filtersSidebar.classList.remove('mobile-open');
                    filterBtn.classList.remove('active');
                }
            }
        });
    }
}

// Update active filters display
function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    const checkedFilters = document.querySelectorAll('.filter-checkbox input:checked');
    
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    checkedFilters.forEach(filter => {
        const filterLabel = filter.parentNode.textContent.trim().split('(')[0].trim();
        const filterTag = document.createElement('span');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = `
            ${filterLabel}
            <button class="remove-filter" data-filter="${filter.value}">×</button>
        `;
        
        // Add click event to remove button
        filterTag.querySelector('.remove-filter').addEventListener('click', function() {
            removeFilter(this.dataset.filter);
        });
        
        activeFiltersContainer.appendChild(filterTag);
    });
}

// Remove specific filter
function removeFilter(filterValue) {
    const checkbox = document.querySelector(`input[value="${filterValue}"]`);
    if (checkbox) {
        checkbox.checked = false;
        updateActiveFilters();
        filterEvents();
        updateResultsCount();
    }
}

// Clear all filters
function clearAllFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const priceInputs = document.querySelectorAll('#minPrice, #maxPrice');
    const priceSliders = document.querySelectorAll('#priceSliderMin, #priceSliderMax');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    priceInputs.forEach(input => {
        input.value = '';
    });
    
    priceSliders.forEach(slider => {
        if (slider.id === 'priceSliderMin') {
            slider.value = 0;
        } else {
            slider.value = 10000;
        }
    });
    
    updateActiveFilters();
    filterEvents();
    updateResultsCount();
}

// Filter events based on current filters
function filterEvents() {
    const eventCards = document.querySelectorAll('.event-card');
    const searchTerm = document.getElementById('eventsSearch').value.toLowerCase();
    const selectedCategories = getSelectedFilterValues('category');
    const selectedLocations = getSelectedFilterValues('location');
    const selectedDates = getSelectedFilterValues('date');
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
    
    let visibleCount = 0;
    
    eventCards.forEach(card => {
        const title = card.querySelector('.event-title').textContent.toLowerCase();
        const category = card.querySelector('.event-category').textContent.toLowerCase();
        const venue = card.querySelector('.event-venue').textContent.toLowerCase();
        const priceText = card.querySelector('.event-price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        
        let isVisible = true;
        
        // Search filter
        if (searchTerm && !title.includes(searchTerm) && !venue.includes(searchTerm)) {
            isVisible = false;
        }
        
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.some(cat => category.includes(cat))) {
            isVisible = false;
        }
        
        // Location filter (simplified - in real app, would need proper location data)
        if (selectedLocations.length > 0 && !selectedLocations.some(loc => venue.includes(loc))) {
            isVisible = false;
        }
        
        // Price filter
        if (price < minPrice || price > maxPrice) {
            isVisible = false;
        }
        
        // Show/hide card
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    // Update results count
    document.getElementById('resultsCount').textContent = visibleCount;
    
    // Show empty state if no results
    showEmptyState(visibleCount === 0);
}

// Get selected filter values
function getSelectedFilterValues(section) {
    const checkboxes = document.querySelectorAll(`.filter-checkbox input:checked`);
    const values = [];
    
    checkboxes.forEach(checkbox => {
        const filterType = getFilterType(checkbox.value);
        if (filterType === section) {
            values.push(checkbox.value);
        }
    });
    
    return values;
}

// Determine filter type (category, location, date)
function getFilterType(value) {
    const categories = ['sports', 'concerts', 'theater', 'comedy', 'festivals'];
    const locations = ['mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai'];
    const dates = ['today', 'tomorrow', 'this-week', 'this-month', 'next-month'];
    
    if (categories.includes(value)) return 'category';
    if (locations.includes(value)) return 'location';
    if (dates.includes(value)) return 'date';
    return 'other';
}

// Sort events
function sortEvents(sortBy) {
    const eventsGrid = document.getElementById('eventsGrid');
    const eventCards = Array.from(eventsGrid.querySelectorAll('.event-card'));
    
    eventCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return getCardPrice(a) - getCardPrice(b);
            case 'price-high':
                return getCardPrice(b) - getCardPrice(a);
            case 'date':
                return new Date(getCardDate(a)) - new Date(getCardDate(b));
            case 'popularity':
                return getCardPopularity(b) - getCardPopularity(a);
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted cards
    eventsGrid.innerHTML = '';
    eventCards.forEach(card => eventsGrid.appendChild(card));
}

// Helper functions for sorting
function getCardPrice(card) {
    const priceText = card.querySelector('.event-price').textContent;
    return parseInt(priceText.replace(/[^\d]/g, ''));
}

function getCardDate(card) {
    // In a real app, this would parse the actual date
    // For demo, return random date
    return new Date();
}

function getCardPopularity(card) {
    const ticketsText = card.querySelector('.tickets-available').textContent;
    return parseInt(ticketsText.replace(/[^\d]/g, ''));
}

// Update results count
function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.event-card:not([style*="display: none"])');
    document.getElementById('resultsCount').textContent = visibleCards.length;
}

// Show/hide empty state
function showEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No events found</h3>
            <p>Try adjusting your search or filters to find more events.</p>
            <button onclick="clearAllFilters()">Clear filters</button>
        `;
        document.getElementById('eventsGrid').appendChild(emptyState);
    } else if (!show && emptyState) {
        emptyState.remove();
    }
}

// Load more events
function loadMoreEvents() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<span class="spinner"></span> Loading...';
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // In a real app, this would load more events from API
                console.log('Loading more events...');
                
                this.innerHTML = 'Load more events <i class="fas fa-chevron-down"></i>';
                this.disabled = false;
            }, 1000);
        });
    }
}

// Load initial events data
function loadEvents() {
    // In a real app, this would fetch events from an API
    // For now, we'll just ensure the existing cards are properly initialized
    
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        // Add click handlers
        card.addEventListener('click', function() {
            const eventId = index + 1;
            window.location.href = `event-detail.html?id=${eventId}`;
        });
        
        // Add loading animation delay
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize load more functionality
    loadMoreEvents();
    
    // Set initial results count
    updateResultsCount();
}

// Handle URL parameters
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const city = urlParams.get('city');
    
    if (category) {
        const categoryCheckbox = document.querySelector(`input[value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    if (city) {
        const cityCheckbox = document.querySelector(`input[value="${city}"]`);
        if (cityCheckbox) {
            cityCheckbox.checked = true;
        }
    }
    
    if (category || city) {
        updateActiveFilters();
        filterEvents();
    }
}

// Mobile responsive adjustments
function handleResize() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    
    if (window.innerWidth > 768) {
        filtersSidebar.classList.remove('mobile-open');
        document.getElementById('filterBtn').classList.remove('active');
    }
}

// Event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('load', handleURLParams);

// Add mobile filter styles for JavaScript toggle
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .filters-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 280px;
            height: 100vh;
            background: white;
            z-index: 1001;
            transition: left 0.3s ease;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }
        
        .filters-sidebar.mobile-open {
            left: 0;
        }
        
        .filters-sidebar.mobile-open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 280px;
            width: calc(100vw - 280px);
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: -1;
        }
    }
`;
document.head.appendChild(style);
