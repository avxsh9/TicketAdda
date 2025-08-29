export class EventManager {
    constructor() {
      this.events = this.generateSampleEvents()
      this.currentPage = 1
      this.eventsPerPage = 9
    }
    
    generateSampleEvents() {
      const categories = ['concerts', 'sports', 'arts', 'family', 'conference']
      const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata']
      const venues = {
        'Delhi': ['JLN Stadium', 'Red Fort', 'Pragati Maidan', 'Thyagaraj Stadium'],
        'Mumbai': ['Mahalaxmi Racecourse', 'NSCI Dome', 'Brabourne Stadium', 'Phoenix Mills'],
        'Bangalore': ['M. Chinnaswamy Stadium', 'Bangalore Palace', 'UB City Mall', 'Kanteerava Stadium'],
        'Chennai': ['Nehru Indoor Stadium', 'MA Chidambaram Stadium', 'Music Academy', 'Express Avenue'],
        'Pune': ['SSPMS Ground', 'Shree Shiv Chhatrapati Stadium', 'Fergusson College', 'Seasons Mall'],
        'Hyderabad': ['HICC', 'Gachibowli Stadium', 'Hitex Exhibition Centre', 'Forum Sujana Mall'],
        'Kolkata': ['Salt Lake Stadium', 'Rabindra Sadan', 'Science City', 'South City Mall']
      }
      
      const artists = {
        'concerts': ['Arijit Singh', 'Neha Kakkar', 'AR Rahman', 'Shreya Ghoshal', 'Divine', 'Nucleya', 'Sunburn DJ', 'Armaan Malik'],
        'sports': ['India vs Australia Cricket', 'ISL Football', 'Pro Kabaddi', 'IPL Match', 'Tennis Championship'],
        'arts': ['Kapil Sharma Comedy', 'Theater Play', 'Dance Performance', 'Stand-up Comedy', 'Musical Concert'],
        'family': ['Kids Carnival', 'Magic Show', 'Puppet Show', 'Science Exhibition', 'Food Festival'],
        'conference': ['Tech Conference', 'Business Summit', 'Startup Meet', 'Digital Marketing', 'AI Conference']
      }
      
      const images = [
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
        'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
        'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
        'https://images.pexels.com/photos/2148222/pexels-photo-2148222.jpeg',
        'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg',
        'https://images.pexels.com/photos/1709819/pexels-photo-1709819.jpeg',
        'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg'
      ]
      
      const tags = ['SPONSORED', 'TRENDING', 'HOT', 'NEW']
      
      const events = []
      
      for (let i = 1; i <= 50; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)]
        const city = cities[Math.floor(Math.random() * cities.length)]
        const venue = venues[city][Math.floor(Math.random() * venues[city].length)]
        const artist = artists[category][Math.floor(Math.random() * artists[category].length)]
        
        // Generate future dates
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90) + 1)
        
        const event = {
          id: i,
          title: artist,
          category: category === 'arts' ? 'Arts & Theater' : category.charAt(0).toUpperCase() + category.slice(1),
          venue: venue,
          city: city,
          date: futureDate.toLocaleDateString('en-IN', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: this.generateRandomTime(),
          price: Math.floor(Math.random() * 8000) + 500,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviews: Math.floor(Math.random() * 2000) + 100,
          image: images[Math.floor(Math.random() * images.length)],
          tag: i <= 6 ? tags[Math.floor(Math.random() * tags.length)] : '',
          isFeatured: i <= 6,
          isWishlisted: Math.random() > 0.8,
          description: this.generateEventDescription(category, artist),
          ticketTypes: this.generateTicketTypes(category),
          organizer: this.generateOrganizer(),
          dateObject: futureDate
        }
        
        events.push(event)
      }
      
      return events
    }
    
    generateRandomTime() {
      const times = ['6:00 PM', '7:00 PM', '8:00 PM', '2:00 PM', '5:00 PM', '9:00 AM', '4:00 PM', '6:30 PM']
      return times[Math.floor(Math.random() * times.length)]
    }
    
    generateEventDescription(category, title) {
      const descriptions = {
        'concerts': `Join us for an unforgettable musical evening with ${title}. Experience live music like never before with state-of-the-art sound and lighting.`,
        'sports': `Don't miss this thrilling ${title} match! Witness world-class athletes compete in an electric atmosphere.`,
        'arts': `An entertaining ${title} show that promises laughter, drama, and artistic excellence. Perfect for all ages.`,
        'family': `A fun-filled ${title} event designed for the whole family. Create memories that will last a lifetime.`,
        'conference': `${title} brings together industry leaders, innovators, and professionals for inspiring talks and networking.`
      }
      return descriptions[category] || `Experience the amazing ${title} event with friends and family.`
    }
    
    generateTicketTypes(category) {
      const basePrice = Math.floor(Math.random() * 3000) + 500
      
      if (category === 'concerts') {
        return [
          { name: 'General Admission', price: basePrice, available: Math.floor(Math.random() * 500) + 50 },
          { name: 'VIP', price: Math.floor(basePrice * 2.5), available: Math.floor(Math.random() * 100) + 10 },
          { name: 'Premium', price: Math.floor(basePrice * 4), available: Math.floor(Math.random() * 50) + 5 }
        ]
      } else if (category === 'sports') {
        return [
          { name: 'Upper Tier', price: basePrice, available: Math.floor(Math.random() * 800) + 100 },
          { name: 'Lower Tier', price: Math.floor(basePrice * 1.8), available: Math.floor(Math.random() * 400) + 50 },
          { name: 'Premium Box', price: Math.floor(basePrice * 3.5), available: Math.floor(Math.random() * 20) + 2 }
        ]
      } else {
        return [
          { name: 'Standard', price: basePrice, available: Math.floor(Math.random() * 300) + 30 },
          { name: 'Premium', price: Math.floor(basePrice * 2), available: Math.floor(Math.random() * 100) + 10 }
        ]
      }
    }
    
    generateOrganizer() {
      const organizers = [
        'EventPro India', 'Live Nation', 'BookMyShow', 'Insider.in', 'Explara', 
        'Townscript', 'Meraevents', 'SkillboxEvents', 'Eventbrite India'
      ]
      return organizers[Math.floor(Math.random() * organizers.length)]
    }
    
    getAllEvents() {
      return this.events
    }
    
    getFeaturedEvents() {
      return this.events.filter(event => event.isFeatured)
    }
    
    getEventById(id) {
      return this.events.find(event => event.id === id)
    }
    
    getWishlistEvents() {
      return this.events.filter(event => event.isWishlisted)
    }
    
    getWishlistCount() {
      return this.events.filter(event => event.isWishlisted).length
    }
    
    sortEvents(sortBy) {
      const sortedEvents = [...this.events]
      
      switch (sortBy) {
        case 'date':
          return sortedEvents.sort((a, b) => a.dateObject - b.dateObject)
        case 'price-low':
          return sortedEvents.sort((a, b) => a.price - b.price)
        case 'price-high':
          return sortedEvents.sort((a, b) => b.price - a.price)
        case 'rating':
          return sortedEvents.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        default:
          return sortedEvents
      }
    }
    
    searchEvents(query) {
      if (!query.trim()) return this.events
      
      const searchTerm = query.toLowerCase()
      return this.events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.venue.toLowerCase().includes(searchTerm) ||
        event.city.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
      )
    }
    
    filterEvents(filters) {
      let filteredEvents = [...this.events]
      
      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filters.categories.some(cat => event.category.toLowerCase().includes(cat))
        )
      }
      
      // Location filter
      if (filters.location) {
        filteredEvents = filteredEvents.filter(event => 
          event.city.toLowerCase().includes(filters.location.toLowerCase())
        )
      }
      
      // Date filter
      if (filters.date) {
        const filterDate = new Date(filters.date)
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = event.dateObject
          return eventDate.toDateString() === filterDate.toDateString()
        })
      }
      
      // Price filter
      if (filters.maxPrice) {
        filteredEvents = filteredEvents.filter(event => event.price <= filters.maxPrice)
      }
      
      return filteredEvents
    }
  }