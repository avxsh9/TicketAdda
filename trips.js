// Trek Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTrekPage();
  });
  
  // Global cart state
  let cart = {};
  
  // Pass data
  const passes = {
    solo: {
      name: 'Solo Traveler',
      price: 5000,
      capacity: 1,
      available: 20
    },
    couple: {
      name: 'Couple Package',
      price: 9500,
      capacity: 2,
      available: 10
    },
    group: {
      name: 'Group Package',
      price: 45000,
      capacity: 10,
      available: 3
    }
  };
  
  // Image data
  const images = [
    'https://images.pexels.com/photos/1562/italian-landscape-mountains-nature.jpg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1029610/pexels-photo-1029610.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];
  
  // Initialize page
  function initializeTrekPage() {
    updateAllQuantityButtons();
    updateCartDisplay();
    loadFromSessionStorage();
  }
  
  // Change main trek image
  function changeTrekImage(thumbnail, index) {
    const mainImage = document.getElementById('mainTrekImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
  
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
  
    // Update main image with fade effect
    mainImage.style.opacity = '0.5';
    setTimeout(() => {
      mainImage.src = images[index];
      mainImage.style.opacity = '1';
    }, 200);
  }
  
  // Update quantity
  function updateQuantity(passType, delta) {
    const currentQty = cart[passType] || 0;
    const pass = passes[passType];
    const newQty = Math.max(0, Math.min(currentQty + delta, pass.available));
  
    if (newQty === 0) {
      delete cart[passType];
    } else {
      cart[passType] = newQty;
    }
  
    // Update display
    const display = document.querySelector(`.qty-display[data-pass="${passType}"]`);
    if (display) {
      display.textContent = newQty;
    }
  
    updateQuantityButtons(passType);
    updateCartDisplay();
    saveToSessionStorage();
  }
  
  // Update quantity buttons state
  function updateQuantityButtons(passType) {
    const qty = cart[passType] || 0;
    const pass = passes[passType];
  
    const minusBtn = document.querySelector(`.qty-btn.minus[data-pass="${passType}"]`);
    const plusBtn = document.querySelector(`.qty-btn.plus[data-pass="${passType}"]`);
  
    if (minusBtn) {
      minusBtn.disabled = qty <= 0;
    }
  
    if (plusBtn) {
      plusBtn.disabled = qty >= pass.available;
    }
  }
  
  // Update all quantity buttons
  function updateAllQuantityButtons() {
    Object.keys(passes).forEach(passType => {
      updateQuantityButtons(passType);
    });
  }
  
  // Update cart display
  function updateCartDisplay() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
  
    const hasItems = Object.keys(cart).length > 0;
  
    if (hasItems) {
      cartEmpty.style.display = 'none';
      cartItems.style.display = 'block';
      cartTotal.style.display = 'block';
  
      renderCartItems();
      updateCartTotals();
    } else {
      cartEmpty.style.display = 'block';
      cartItems.style.display = 'none';
      cartTotal.style.display = 'none';
    }
  }
  
  // Render cart items
  function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
  
    Object.entries(cart).forEach(([passType, quantity]) => {
      const pass = passes[passType];
      const itemTotal = pass.price * quantity;
      const totalPeople = pass.capacity * quantity;
  
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <h4>${pass.name}</h4>
        <div class="cart-item-details">
          <div class="cart-item-info">
            ${quantity} pass${quantity > 1 ? 'es' : ''} • ${totalPeople} ${totalPeople > 1 ? 'people' : 'person'}
          </div>
          <div class="cart-item-price">
            <div class="price">₹${itemTotal.toLocaleString()}</div>
            <div class="unit">₹${pass.price.toLocaleString()} per pass</div>
          </div>
        </div>
      `;
  
      cartItems.appendChild(cartItem);
    });
  }
  
  // Update cart totals
  function updateCartTotals() {
    const subtotal = Object.entries(cart).reduce((sum, [passType, quantity]) => {
      return sum + (passes[passType].price * quantity);
    }, 0);
  
    const processingFee = 200;
    const gst = Math.round((subtotal + processingFee) * 0.05);
    const total = subtotal + processingFee + gst;
  
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('processingFee').textContent = `₹${processingFee.toLocaleString()}`;
    document.getElementById('gst').textContent = `₹${gst.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
  }
  
  // Calculate total people
  function getTotalPeople() {
    return Object.entries(cart).reduce((sum, [passType, quantity]) => {
      return sum + (passes[passType].capacity * quantity);
    }, 0);
  }
  
  // Proceed to checkout
  function proceedToCheckout() {
    if (Object.keys(cart).length === 0) {
      alert('Please select at least one pass before proceeding.');
      return;
    }
  
    const totalPeople = getTotalPeople();
  
    // Calculate totals
    const subtotal = Object.entries(cart).reduce((sum, [passType, quantity]) => {
      return sum + (passes[passType].price * quantity);
    }, 0);
  
    const processingFee = 200;
    const gst = Math.round((subtotal + processingFee) * 0.05);
    const total = subtotal + processingFee + gst;
  
    // Prepare booking data
    const bookingData = {
      type: 'trek',
      trek: 'Tungnath Temple & Chandrashila Trek',
      duration: '4 Days / 3 Nights',
      startDate: 'Next Batch: 15 Nov 2025',
      startPoint: 'Rishikesh, Uttarakhand',
      cart: cart,
      passes: passes,
      totalPeople: totalPeople,
      pricing: {
        subtotal: subtotal,
        processingFee: processingFee,
        gst: gst,
        total: total
      },
      timestamp: new Date().toISOString()
    };
  
    // Save to session storage
    sessionStorage.setItem('trekBooking', JSON.stringify(bookingData));
  
    // Show confirmation
    const confirmMessage = `You are booking for ${totalPeople} ${totalPeople > 1 ? 'people' : 'person'}.\nTotal amount: ₹${total.toLocaleString()}\n\nContinue to checkout?`;
  
    if (confirm(confirmMessage)) {
      // Redirect to checkout page
      window.location.href = 'checkout.html?type=trek';
    }
  }
  
  // Save cart to session storage
  function saveToSessionStorage() {
    try {
      sessionStorage.setItem('trekCart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to session storage:', e);
    }
  }
  
  // Load cart from session storage
  function loadFromSessionStorage() {
    try {
      const savedCart = sessionStorage.getItem('trekCart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
  
        // Update all displays
        Object.entries(cart).forEach(([passType, quantity]) => {
          const display = document.querySelector(`.qty-display[data-pass="${passType}"]`);
          if (display) {
            display.textContent = quantity;
          }
          updateQuantityButtons(passType);
        });
  
        updateCartDisplay();
      }
    } catch (e) {
      console.error('Failed to load cart from session storage:', e);
      cart = {};
    }
  }
  
  // Share trek
  function shareTrek() {
    const trekTitle = 'Tungnath Temple & Chandrashila Trek - 4 Days Adventure';
    const trekUrl = window.location.href;
  
    if (navigator.share) {
      navigator.share({
        title: trekTitle,
        text: 'Check out this amazing trek on TicketAdda!',
        url: trekUrl
      }).catch(err => {
        console.log('Error sharing:', err);
      });
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(trekUrl).then(() => {
        alert('Trek URL copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy URL:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = trekUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Trek URL copied to clipboard!');
        } catch (err) {
          alert('Failed to copy URL. Please copy manually: ' + trekUrl);
        }
        document.body.removeChild(textArea);
      });
    }
  }
  
  // Add to wishlist
  function addToWishlist() {
    try {
      let wishlist = JSON.parse(localStorage.getItem('trekWishlist') || '[]');
  
      const trekData = {
        title: 'Tungnath Temple & Chandrashila Trek',
        price: 5000,
        duration: '4 Days / 3 Nights',
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
  
      // Check if already in wishlist
      const exists = wishlist.some(item => item.url === trekData.url);
  
      if (exists) {
        alert('This trek is already in your wishlist!');
        return;
      }
  
      wishlist.push(trekData);
      localStorage.setItem('trekWishlist', JSON.stringify(wishlist));
      alert('Trek added to your wishlist!');
    } catch (e) {
      console.error('Failed to add to wishlist:', e);
      alert('Failed to add to wishlist. Please try again.');
    }
  }
  
  // Download itinerary
  function downloadItinerary() {
    alert('Itinerary PDF will be downloaded.\n\nThis feature will be available soon!\n\nFor now, you can contact us at trek@ticketadda.com to receive the detailed itinerary.');
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Track page view (analytics placeholder)
  function trackPageView() {
    console.log('Trek page viewed:', {
      trek: 'Tungnath',
      timestamp: new Date().toISOString()
    });
  }
  
  // Track booking action (analytics placeholder)
  function trackBookingAction(action, data) {
    console.log('Booking action:', action, data);
  }
  
  // Initialize page view tracking
  trackPageView();
  
  // Handle online/offline status
  window.addEventListener('online', function() {
    console.log('Connection restored');
    showNotification('Connection restored', 'success');
  });
  
  window.addEventListener('offline', function() {
    console.log('Connection lost');
    showNotification('You are offline. Some features may not work.', 'warning');
  });
  
  // Show notification (helper function)
  function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
  
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 24px;
      background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#3b82f6'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-size: 14px;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    `;
  
    notification.textContent = message;
    document.body.appendChild(notification);
  
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Add CSS for notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Emergency contacts
  const emergencyContacts = {
    trekLeader: '+91 98765 43210',
    basecamp: '+91 98765 43211',
    emergency: '112',
    nearestHospital: 'Gopeshwar: +91 1234 567890'
  };
  
  // Get emergency contacts
  function getEmergencyContacts() {
    return emergencyContacts;
  }
  
  // Print emergency contacts to console
  console.log('Emergency Contacts:', getEmergencyContacts());
  
  // Weather information (simulated)
  function getWeatherInfo() {
    return {
      current: '12°C',
      condition: 'Clear skies',
      humidity: '45%',
      windSpeed: '15 km/h',
      forecast: 'Good trekking weather expected'
    };
  }
  
  // Load weather info
  console.log('Current Weather:', getWeatherInfo());
  
  // Lazy load images
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
  
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });
  
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
  
  // Initialize lazy loading
  lazyLoadImages();
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      console.log('Window resized');
      // Add any resize-specific logic here
    }, 250);
  });
  
  // Prevent form submission on Enter key in search
  const searchInput = document.getElementById('mainSearch');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }
  
  // Search button click
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const searchInput = document.getElementById('mainSearch');
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  }
  
  // FAQ Toggle (if FAQ section is added)
  function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.faq-icon');
  
    if (answer && icon) {
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.textContent = '+';
      } else {
        answer.style.display = 'block';
        icon.textContent = '-';
      }
    }
  }
  
  // Export functions for global use
  window.changeTrekImage = changeTrekImage;
  window.updateQuantity = updateQuantity;
  window.proceedToCheckout = proceedToCheckout;
  window.shareTrek = shareTrek;
  window.addToWishlist = addToWishlist;
  window.downloadItinerary = downloadItinerary;
  window.toggleFAQ = toggleFAQ;
  
  console.log('Trek Detail Page Initialized Successfully');
  