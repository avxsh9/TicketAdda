document.addEventListener('DOMContentLoaded', () => {

    const contactForm = document.getElementById('contactForm');
    
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const name = document.getElementById('contactName').value;
            
            // Show a success message
            alert(`Thanks, ${name}! Your message has been sent. We'll get back to you soon.`);
            
            // Reset the form
            contactForm.reset();
        });
    }

});