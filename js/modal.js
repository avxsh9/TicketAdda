export class ModalManager {
    constructor() {
      this.setupModalOverlay()
    }
    
    setupModalOverlay() {
      const overlay = document.getElementById('modal-overlay')
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal()
        }
      })
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal()
        }
      })
    }
    
    showEventDetails(eventId) {
      const event = window.app?.eventManager?.getEventById(eventId)
      if (!event) return
      
      const modalContent = this.createEventDetailsHTML(event)
      this.showModal(modalContent)
    }
    
    createEventDetailsHTML(event) {
      return `
        <div class="modal bg-white rounded-2xl max-w-4xl w-full mx-4 relative">
          <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all" onclick="app.modalManager.closeModal()">
            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
          
          <div class="relative h-64 bg-cover bg-center rounded-t-2xl" style='background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("${event.image}");'>
            <div class="absolute bottom-6 left-6 text-white">
              <div class="category-tag mb-2">${event.category}</div>
              <h1 class="text-4xl font-bold mb-2">${event.title}</h1>
              <div class="flex items-center gap-4 text-lg">
                <div class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  ${event.venue}, ${event.city}
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                  </svg>
                  ${event.date}, ${event.time}
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-8">
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-2xl font-bold mb-4">About This Event</h3>
                <p class="text-gray-700 leading-relaxed mb-6">${event.description}</p>
                
                <div class="space-y-4">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-[var(--primary-color)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                    <span><strong>Organizer:</strong> ${event.organizer}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <div class="star-rating">
                      ${this.generateStarRating(event.rating)}
                    </div>
                    <span class="font-bold text-lg">${event.rating}</span>
                    <span class="text-gray-500">(${event.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-2xl font-bold mb-4">Select Tickets</h3>
                <div class="space-y-4">
                  ${event.ticketTypes.map(ticket => this.createTicketOptionHTML(event.id, ticket)).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
    
    createTicketOptionHTML(eventId, ticket) {
      return `
        <div class="ticket-option border border-gray-200 rounded-lg p-4 hover:border-[var(--primary-color)] transition-all">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-bold text-lg">${ticket.name}</h4>
              <p class="text-2xl font-bold text-[var(--primary-color)]">₹${ticket.price.toLocaleString()}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">${ticket.available} available</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium">Quantity:</label>
              <select class="ticket-quantity form-select rounded border-gray-300 text-sm py-1 px-2" data-event-id="${eventId}" data-ticket-name="${ticket.name}">
                ${Array.from({length: Math.min(10, ticket.available)}, (_, i) => 
                  `<option value="${i + 1}">${i + 1}</option>`
                ).join('')}
              </select>
            </div>
            <button class="btn-primary text-sm py-2 px-4 add-to-cart-btn" data-event-id="${eventId}" data-ticket-name="${ticket.name}">
              Add to Cart
            </button>
          </div>
        </div>
      `
    }
    
    showBookingModal(eventId) {
      this.showEventDetails(eventId)
      
      // Focus on ticket selection after modal opens
      setTimeout(() => {
        const firstTicketOption = document.querySelector('.ticket-option')
        if (firstTicketOption) {
          firstTicketOption.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
    
    showWishlistModal(wishlistEvents) {
      const modalContent = `
        <div class="modal bg-white rounded-2xl max-w-4xl w-full mx-4 p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold">My Wishlist</h2>
            <button onclick="app.modalManager.closeModal()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          ${wishlistEvents.length === 0 ? `
            <div class="text-center py-16">
              <svg class="mx-auto h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 256 256">
                <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
              </svg>
              <p class="mt-4 text-gray-600 text-lg">Your wishlist is empty</p>
              <p class="text-gray-500">Start adding events you love!</p>
            </div>
          ` : `
            <div class="grid gap-6 max-h-96 overflow-y-auto">
              ${wishlistEvents.map(event => `
                <div class="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <img src="${event.image}" alt="${event.title}" class="w-20 h-20 rounded-lg object-cover">
                  <div class="flex-1">
                    <h4 class="font-bold text-lg">${event.title}</h4>
                    <p class="text-gray-600">${event.venue}, ${event.city}</p>
                    <p class="text-gray-600">${event.date}, ${event.time}</p>
                    <p class="font-bold text-[var(--primary-color)] text-lg">₹${event.price.toLocaleString()} onwards</p>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn-primary text-sm py-2 px-4" onclick="app.modalManager.showBookingModal(${event.id})">
                      Book Now
                    </button>
                    <button class="text-red-500 hover:text-red-700 p-2" onclick="app.toggleWishlist(${event.id}, this)">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `
      
      this.showModal(modalContent)
    }
    
    showModal(content) {
      const overlay = document.getElementById('modal-overlay')
      overlay.innerHTML = content
      overlay.classList.remove('hidden')
      
      // Setup event listeners for new modal content
      this.setupModalListeners()
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }
    
    closeModal() {
      const overlay = document.getElementById('modal-overlay')
      overlay.classList.add('hidden')
      overlay.innerHTML = ''
      
      // Restore body scroll
      document.body.style.overflow = ''
    }
    
    setupModalListeners() {
      // Add to cart buttons
      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const eventId = parseInt(e.target.dataset.eventId)
          const ticketName = e.target.dataset.ticketName
          const quantitySelect = document.querySelector(
            `.ticket-quantity[data-event-id="${eventId}"][data-ticket-name="${ticketName}"]`
          )
          const quantity = parseInt(quantitySelect.value)
          
          const event = window.app?.eventManager?.getEventById(eventId)
          const ticketType = event.ticketTypes.find(t => t.name === ticketName)
          
          if (event && ticketType) {
            window.app.cartManager.addToCart(eventId, ticketType, quantity)
            window.app.showNotification(`Added ${quantity} ${ticketName} ticket(s) to cart!`)
          }
        })
      })
    }
    
    generateStarRating(rating) {
      const fullStars = Math.floor(rating)
      const hasHalfStar = rating % 1 >= 0.5
      let stars = ''
      
      for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>'
      }
      
      if (hasHalfStar) {
        stars += '<span class="star">☆</span>'
      }
      
      return stars
    }
  }