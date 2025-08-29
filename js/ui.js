export class UIManager {
    constructor() {
      this.setupScrollToTop()
    }
    
    showNotification(message, type = 'success') {
      const notification = document.getElementById('notification')
      const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
      }
      
      notification.className = `fixed top-24 right-4 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${colors[type]}`
      notification.textContent = message
      notification.classList.remove('hidden')
      notification.classList.add('notification-show')
      
      setTimeout(() => {
        notification.classList.remove('notification-show')
        setTimeout(() => {
          notification.classList.add('hidden')
        }, 300)
      }, 3000)
    }
    
    setupScrollToTop() {
      // Create scroll to top button
      const scrollBtn = document.createElement('button')
      scrollBtn.id = 'scroll-to-top'
      scrollBtn.innerHTML = `
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
        </svg>
      `
      scrollBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-[var(--primary-color)] text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 z-40 opacity-0 pointer-events-none'
      
      document.body.appendChild(scrollBtn)
      
      // Show/hide scroll button based on scroll position
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
          scrollBtn.style.opacity = '1'
          scrollBtn.style.pointerEvents = 'auto'
        } else {
          scrollBtn.style.opacity = '0'
          scrollBtn.style.pointerEvents = 'none'
        }
      })
      
      // Scroll to top functionality
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
    
    showLoading(show = true) {
      const loading = document.getElementById('loading')
      if (loading) {
        loading.classList.toggle('hidden', !show)
      }
    }
    
    animateValue(element, start, end, duration = 1000) {
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        const current = Math.floor(progress * (end - start) + start)
        element.textContent = current.toLocaleString()
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
    
    createLoadingSkeleton() {
      return `
        <div class="animate-pulse">
          <div class="bg-gray-300 rounded-2xl h-48 mb-4"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-6 bg-gray-300 rounded w-1/2"></div>
            <div class="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      `
    }
    
    setupSmoothScrolling() {
      // Add smooth scrolling to all anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault()
          const target = document.querySelector(this.getAttribute('href'))
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }
        })
      })
    }
    
    addRippleEffect(element) {
      element.addEventListener('click', function(e) {
        const ripple = document.createElement('span')
        const rect = this.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2
        
        ripple.style.width = ripple.style.height = size + 'px'
        ripple.style.left = x + 'px'
        ripple.style.top = y + 'px'
        ripple.classList.add('ripple')
        
        this.appendChild(ripple)
        
        setTimeout(() => {
          ripple.remove()
        }, 600)
      })
    }
  }
  
  // Add ripple effect styles
  const style = document.createElement('style')
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .nav-link {
      position: relative;
      text-base font-semibold text-gray-600 hover:text-[var(--primary-color)] transition-colors duration-300;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    .nav-link:hover::after {
      width: 100%;
    }
  `
  document.head.appendChild(style)