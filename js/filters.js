export class FilterManager {
    constructor() {
      this.activeFilters = {
        categories: [],
        location: '',
        date: '',
        maxPrice: null
      }
      this.eventManager = null
    }
    
    setEventManager(eventManager) {
      this.eventManager = eventManager
    }
    
    applyFilters() {
      this.collectFilterValues()
      return this.getFilteredEvents()
    }
    
    collectFilterValues() {
      // Category filters
      this.activeFilters.categories = Array.from(
        document.querySelectorAll('[data-filter="category"]:checked')
      ).map(input => input.dataset.value)
      
      // Location filter
      const locationSelect = document.getElementById('location-filter')
      this.activeFilters.location = locationSelect ? locationSelect.value : ''
      
      // Date filter
      const dateInput = document.getElementById('date-filter')
      this.activeFilters.date = dateInput ? dateInput.value : ''
      
      // Price filter
      const priceRange = document.getElementById('price-range')
      this.activeFilters.maxPrice = priceRange ? parseInt(priceRange.value) : null
    }
    
    getFilteredEvents() {
      if (!this.eventManager) return []
      return this.eventManager.filterEvents(this.activeFilters)
    }
    
    filterByCategory(category) {
      // Clear all category filters first
      document.querySelectorAll('[data-filter="category"]').forEach(input => {
        input.checked = false
      })
      
      // Check the specific category
      const categoryInput = document.querySelector(`[data-filter="category"][data-value="${category}"]`)
      if (categoryInput) {
        categoryInput.checked = true
      }
      
      return this.applyFilters()
    }
    
    clearAllFilters() {
      this.activeFilters = {
        categories: [],
        location: '',
        date: '',
        maxPrice: null
      }
    }
  }