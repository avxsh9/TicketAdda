export class SearchManager {
    constructor() {
      this.currentQuery = ''
      this.searchTimeout = null
      this.eventManager = null
    }
    
    setEventManager(eventManager) {
      this.eventManager = eventManager
    }
    
    search(query) {
      this.currentQuery = query
      
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      // Debounce search
      this.searchTimeout = setTimeout(() => {
        this.performSearch()
      }, 300)
    }
    
    performSearch() {
      if (!this.eventManager) return []
      
      const results = this.eventManager.searchEvents(this.currentQuery)
      this.updateSearchResults(results)
      return results
    }
    
    updateSearchResults(results) {
      const container = document.getElementById('events-container')
      const resultCount = document.getElementById('result-count')
      
      if (results.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-16">
            <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">No events found</h3>
            <p class="mt-2 text-gray-600">Try adjusting your search or filters</p>
            <button class="mt-4 btn-primary" onclick="app.clearAllFilters()">Clear Filters</button>
          </div>
        `
      }
    }
    
    getFilteredEvents() {
      return this.performSearch()
    }
    
    highlightSearchTerms(text, query) {
      if (!query) return text
      
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
    }
  }