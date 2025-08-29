export class CartManager {
    constructor() {
      this.cart = []
      this.isOpen = false
      this.setupCartSidebar()
    }
    
    setupCartSidebar() {
      const cartSidebar = document.getElementById('cart-sidebar')
      cartSidebar.innerHTML = this.getCartHTML()
    }
    
    getCartHTML() {
      return `
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-xl font-bold">Shopping Cart</h3>
            <button id="close-cart" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div id="cart-items" class="flex-1 overflow-y-auto p-6">
            <!-- Cart items will be rendered here -->
          </div>
          
          <div id="cart-footer" class="border-t p-6 bg-gray-50">
            <div class="space-y-4">
              <div class="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span id="cart-total" class="text-[var(--primary-color)]">₹0</span>
              </div>
              <button id="checkout-btn" class="w-full btn-primary justify-center py-4 text-lg font-bold" disabled>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      `
    }
    
    toggleCart() {
      const cartSidebar = document.getElementById('cart-sidebar')
      this.isOpen = !this.isOpen
      
      if (this.isOpen) {
        cartSidebar.classList.remove('hidden')
        cartSidebar.classList.add('cart-open')
        this.renderCartItems()
      } else {
        cartSidebar.classList.remove('cart-open')
        setTimeout(() => {
          cartSidebar.classList.add('hidden')
        }, 300)
      }
      
      this.setupCartListeners()
    }
    
    addToCart(eventId, ticketType, quantity = 1) {
      const existingItem = this.cart.find(item => 
        item.eventId === eventId && item.ticketType.name === ticketType.name
      )
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.cart.push({
          eventId,
          ticketType,
          quantity,
          addedAt: new Date()
        })
      }
      
      this.updateCartCount()
      this.updateCartTotal()
      
      if (this.isOpen) {
        this.renderCartItems()
      }
    }
    
    removeFromCart(eventId, ticketTypeName) {
      this.cart = this.cart.filter(item => 
        !(item.eventId === eventId && item.ticketType.name === ticketTypeName)
      )
      
      this.updateCartCount()
      this.updateCartTotal()
      this.renderCartItems()
    }
    
    updateQuantity(eventId, ticketTypeName, quantity) {
      const item = this.cart.find(item => 
        item.eventId === eventId && item.ticketType.name === ticketTypeName
      )
      
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          this.removeFromCart(eventId, ticketTypeName)
        } else {
          this.updateCartCount()
          this.updateCartTotal()
          this.renderCartItems()
        }
      }
    }
    
    updateCartCount() {
      const count = this.cart.reduce((sum, item) => sum + item.quantity, 0)
      const badge = document.querySelector('.cart-count')
      
      if (count > 0) {
        badge.textContent = count
        badge.classList.remove('hidden')
      } else {
        badge.classList.add('hidden')
      }
    }
    
    updateCartTotal() {
      const total = this.cart.reduce((sum, item) => 
        sum + (item.ticketType.price * item.quantity), 0
      )
      
      const totalElement = document.getElementById('cart-total')
      const checkoutBtn = document.getElementById('checkout-btn')
      
      if (totalElement) {
        totalElement.textContent = `₹${total.toLocaleString()}`
      }
      
      if (checkoutBtn) {
        checkoutBtn.disabled = total === 0
        checkoutBtn.classList.toggle('opacity-50', total === 0)
        checkoutBtn.classList.toggle('cursor-not-allowed', total === 0)
      }
    }
    
    renderCartItems() {
      const container = document.getElementById('cart-items')
      
      if (this.cart.length === 0) {
        container.innerHTML = `
          <div class="text-center py-16">
            <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="mt-4 text-gray-600">Your cart is empty</p>
            <p class="text-sm text-gray-500">Add some events to get started!</p>
          </div>
        `
      } else {
        container.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('')
      }
    }
    
    createCartItemHTML(item) {
      const event = window.app?.eventManager?.getEventById(item.eventId)
      if (!event) return ''
      
      return `
        <div class="cart-item border-b pb-4 mb-4 last:border-b-0">
          <div class="flex items-start gap-4">
            <img src="${event.image}" alt="${event.title}" class="w-16 h-16 rounded-lg object-cover">
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 truncate">${event.title}</h4>
              <p class="text-xs text-gray-600">${item.ticketType.name}</p>
              <p class="text-sm font-bold text-[var(--primary-color)]">₹${item.ticketType.price.toLocaleString()}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <button class="quantity-btn w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100" 
                      onclick="app.cartManager.updateQuantity(${item.eventId}, '${item.ticketType.name}', ${item.quantity - 1})">-</button>
              <span class="w-8 text-center font-semibold">${item.quantity}</span>
              <button class="quantity-btn w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100" 
                      onclick="app.cartManager.updateQuantity(${item.eventId}, '${item.ticketType.name}', ${item.quantity + 1})">+</button>
            </div>
            <button class="text-red-500 hover:text-red-700 text-sm font-semibold" 
                    onclick="app.cartManager.removeFromCart(${item.eventId}, '${item.ticketType.name}')">Remove</button>
          </div>
        </div>
      `
    }
    
    setupCartListeners() {
      const closeCartBtn = document.getElementById('close-cart')
      const checkoutBtn = document.getElementById('checkout-btn')
      
      closeCartBtn?.addEventListener('click', () => this.toggleCart())
      
      checkoutBtn?.addEventListener('click', () => {
        if (this.cart.length > 0) {
          this.proceedToCheckout()
        }
      })
    }
    
    proceedToCheckout() {
      // Simulate checkout process
      const total = this.cart.reduce((sum, item) => 
        sum + (item.ticketType.price * item.quantity), 0
      )
      
      const confirmMessage = `Proceed to checkout for ₹${total.toLocaleString()}?\n\nThis is a demo - no actual payment will be processed.`
      
      if (confirm(confirmMessage)) {
        // Simulate successful booking
        setTimeout(() => {
          alert('🎉 Booking Confirmed! You will receive an email confirmation shortly.')
          this.cart = []
          this.updateCartCount()
          this.updateCartTotal()
          this.renderCartItems()
          this.toggleCart()
        }, 1000)
      }
    }
    
    getCart() {
      return this.cart
    }
    
    getCartCount() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0)
    }
    
    getCartTotal() {
      return this.cart.reduce((sum, item) => sum + (item.ticketType.price * item.quantity), 0)
    }
  }