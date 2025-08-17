// TicketAdda Sell Page JavaScript

// Global variables
let currentStep = 1;
const totalSteps = 4;

// Form data object
const formData = {
    eventName: '',
    eventCategory: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    ticketSection: '',
    ticketRow: '',
    seatNumbers: '',
    quantity: 1,
    ticketType: 'mobile',
    sellingPrice: 0,
    agreeTerms: false,
    agreeTransfer: false
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    initializeForm();
    initializePricingSuggestions();
    updatePreview();
});

// Calculator functionality
function initializeCalculator() {
    const priceInput = document.getElementById('ticketPrice');
    const quantitySelect = document.getElementById('ticketQuantity');
    
    // Update calculator when inputs change
    priceInput.addEventListener('input', updateCalculator);
    quantitySelect.addEventListener('change', updateCalculator);
    
    // Initial calculation
    updateCalculator();
}

function updateCalculator() {
    const price = parseInt(document.getElementById('ticketPrice').value) || 0;
    const quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    
    const totalSale = price * quantity;
    const platformFee = Math.round(totalSale * 0.03);
    const earnings = totalSale - platformFee;
    
    // Update display
    document.getElementById('totalSale').textContent = `₹${totalSale.toLocaleString()}`;
    document.getElementById('platformFee').textContent = `₹${platformFee.toLocaleString()}`;
    document.getElementById('youEarn').textContent = `₹${earnings.toLocaleString()}`;
}

// Form functionality
function initializeForm() {
    const form = document.getElementById('ticketListingForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Form navigation
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    form.addEventListener('submit', handleSubmit);
    
    // Form input listeners
    addFormInputListeners();
    
    // Initialize step display
    updateStepDisplay();
}

function addFormInputListeners() {
    // Add listeners to all form inputs
    const inputs = document.querySelectorAll('#ticketListingForm input, #ticketListingForm select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            formData[this.name] = this.type === 'checkbox' ? this.checked : this.value;
            updatePreview();
        });
        
        input.addEventListener('input', function() {
            if (this.type !== 'checkbox') {
                formData[this.name] = this.value;
                updatePreview();
            }
        });
    });
    
    // Special handling for radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                formData[this.name] = this.value;
                updatePreview();
            }
        });
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update progress indicator
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update form steps
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

function validateCurrentStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredInputs = currentFormStep.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
            
            // Remove error styling after user starts typing
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }
    
    return isValid;
}

function handleSubmit(e) {
    e.preventDefault();
    
    // Validate final step
    const termsCheckbox = document.getElementById('agreeTerms');
    const transferCheckbox = document.getElementById('agreeTransfer');
    
    if (!termsCheckbox.checked || !transferCheckbox.checked) {
        alert('Please agree to the terms and conditions to proceed.');
        return;
    }
    
    // Show success message
    alert('🎉 Tickets listed successfully!\n\nYou will receive a confirmation email shortly with your listing details. Your tickets are now live on TicketAdda!');
    
    // Reset form (optional)
    // resetForm();
}

// Pricing suggestions
function initializePricingSuggestions() {
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    const priceInput = document.getElementById('sellingPrice');
    
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const price = this.getAttribute('data-price');
            priceInput.value = price;
            formData.sellingPrice = price;
            updatePreview();
            
            // Visual feedback
            suggestionButtons.forEach(btn => btn.style.background = 'white');
            this.style.background = '#fff5f3';
            this.style.borderColor = '#ff6b35';
        });
    });
    
    // Update preview when price changes
    priceInput.addEventListener('input', updatePreview);
}

// Update preview sections
function updatePreview() {
    updateEarningsPreview();
    updateListingPreview();
}

function updateEarningsPreview() {
    const price = parseInt(formData.sellingPrice) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    
    const totalSale = price * quantity;
    const platformFee = Math.round(totalSale * 0.03);
    const earnings = totalSale - platformFee;
    
    // Update earnings preview
    document.getElementById('previewPrice').textContent = `₹${price.toLocaleString()}`;
    document.getElementById('previewQuantity').textContent = quantity;
    document.getElementById('previewTotal').textContent = `₹${totalSale.toLocaleString()}`;
    document.getElementById('previewFee').textContent = `₹${platformFee.toLocaleString()}`;
    document.getElementById('previewEarnings').textContent = `₹${earnings.toLocaleString()}`;
}

function updateListingPreview() {
    // Update listing preview
    document.getElementById('previewEventName').textContent = formData.eventName || 'Event Name';
    document.getElementById('previewCategory').textContent = formData.eventCategory || 'Category';
    
    // Format date
    if (formData.eventDate) {
        const date = new Date(formData.eventDate);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        let dateString = date.toLocaleDateString('en-IN', options);
        if (formData.eventTime) {
            dateString += ` at ${formData.eventTime}`;
        }
        document.getElementById('previewEventDate').textContent = dateString;
    } else {
        document.getElementById('previewEventDate').textContent = 'Date';
    }
    
    document.getElementById('previewVenue').textContent = formData.venue || 'Venue';
    
    // Ticket info
    let ticketInfo = '';
    if (formData.quantity) {
        ticketInfo += `${formData.quantity} ticket${formData.quantity > 1 ? 's' : ''}`;
    }
    if (formData.ticketSection) {
        ticketInfo += ` • ${formData.ticketSection}`;
    }
    if (formData.ticketRow) {
        ticketInfo += ` • Row ${formData.ticketRow}`;
    }
    if (formData.seatNumbers) {
        ticketInfo += ` • Seats ${formData.seatNumbers}`;
    }
    document.getElementById('previewTicketInfo').textContent = ticketInfo || 'Ticket info';
    
    // Price info
    const price = parseInt(formData.sellingPrice) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    const total = price * quantity;
    document.getElementById('previewPriceInfo').textContent = 
        `₹${price.toLocaleString()} per ticket • Total: ₹${total.toLocaleString()}`;
}

// Utility functions
function scrollToForm() {
    document.getElementById('sellForm').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Event suggestions (mock data)
function initializeEventSuggestions() {
    const eventInput = document.getElementById('eventName');
    const suggestionsDiv = document.getElementById('eventSuggestions');
    
    const mockEvents = [
        'Mumbai Indians vs Chennai Super Kings',
        'Coldplay Concert - Mumbai',
        'Arijit Singh Live in Concert',
        'India vs Australia ODI',
        'Sunburn Festival Goa',
        'Comedy Nights with Kapil'
    ];
    
    eventInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length > 2) {
            const matches = mockEvents.filter(event => 
                event.toLowerCase().includes(value)
            );
            
            if (matches.length > 0) {
                suggestionsDiv.innerHTML = matches.map(event => 
                    `<div class="suggestion-item" onclick="selectEvent('${event}')">${event}</div>`
                ).join('');
                suggestionsDiv.style.display = 'block';
            } else {
                suggestionsDiv.style.display = 'none';
            }
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!eventInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

function selectEvent(eventName) {
    document.getElementById('eventName').value = eventName;
    formData.eventName = eventName;
    document.getElementById('eventSuggestions').style.display = 'none';
    updatePreview();
}

// Initialize event suggestions
document.addEventListener('DOMContentLoaded', function() {
    initializeEventSuggestions();
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add loading states for form submission
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading-spinner"></div> Processing...';
    button.disabled = true;
    
    return function hideLoading() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Enhanced form submission with loading state
function handleSubmitWithLoading(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const hideLoading = showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        handleSubmit(e);
    }, 2000);
}

// Add animation classes for better UX
function addAnimationClasses() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });
    
    document.querySelectorAll('.step-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', addAnimationClasses);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
// Replace your existing sell.js with this updated code

document.addEventListener('DOMContentLoaded', function() {
    // --- Step Navigation ---
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.progress-indicator .step');
    let currentStep = 1;

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length) {
                currentStep++;
                updateFormSteps();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormSteps();
        }
    });

    function updateFormSteps() {
        steps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        stepIndicators.forEach(indicator => {
            indicator.classList.toggle('active', parseInt(indicator.dataset.step) <= currentStep);
        });

        prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
        nextBtn.style.display = currentStep < steps.length ? 'inline-flex' : 'none';
        submitBtn.style.display = currentStep === steps.length ? 'inline-flex' : 'none';

        if (currentStep === 4) {
            populateReview();
        }
    }

    function validateStep(step) {
        let isValid = true;
        const inputs = steps[step - 1].querySelectorAll('[required]');
        inputs.forEach(input => {
            if (!input.value && input.type !== 'file') {
                isValid = false;
                // Add error styling if needed
            }
             if (input.type === 'file' && !input.files[0]) {
                isValid = false;
                alert('Please upload all required files.');
            }
        });
        return isValid;
    }

    // --- Earnings Calculator in Hero ---
    // (Keep your existing code for the calculator here)

    // --- Pricing & Earnings Preview in Form ---
    // (Keep your existing code for pricing updates here)


    // --- NEW: File Upload Handling ---
    function setupFileUpload(inputId, labelId, previewId) {
        const fileInput = document.getElementById(inputId);
        const fileLabel = document.querySelector(`label[for="${inputId}"]`);
        const filePreview = document.getElementById(previewId);

        fileLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileLabel.classList.add('dragover');
        });

        fileLabel.addEventListener('dragleave', () => {
            fileLabel.classList.remove('dragover');
        });

        fileLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            fileLabel.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                updateFilePreview(fileInput, filePreview);
            }
        });

        fileInput.addEventListener('change', () => {
            updateFilePreview(fileInput, filePreview);
        });
    }

    function updateFilePreview(input, previewElement) {
        if (input.files && input.files[0]) {
            const fileName = input.files[0].name;
            previewElement.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName}`;
            previewElement.style.display = 'flex';
        } else {
            previewElement.style.display = 'none';
        }
    }

    // Initialize both file uploads
    setupFileUpload('ticketUpload', 'ticketUploadLabel', 'ticketUploadPreview');
    setupFileUpload('paymentProofUpload', 'paymentProofUploadLabel', 'paymentProofUploadPreview');


    // --- Review Step Population ---
    function populateReview() {
        // Event Details
        document.getElementById('previewEventName').textContent = document.getElementById('eventName').value || 'Not provided';
        document.getElementById('previewCategory').textContent = document.getElementById('eventCategory').selectedOptions[0].text || 'Not provided';
        document.getElementById('previewEventDate').textContent = `${document.getElementById('eventDate').value} at ${document.getElementById('eventTime').value}` || 'Not provided';
        document.getElementById('previewVenue').textContent = document.getElementById('venue').value || 'Not provided';
        
        // Ticket Info
        const ticketInfo = `${document.getElementById('quantity').value} tickets, Section: ${document.getElementById('ticketSection').value || 'N/A'}`;
        document.getElementById('previewTicketInfo').textContent = ticketInfo;
        
        // Pricing Info
        const priceInfo = `₹${document.getElementById('sellingPrice').value} per ticket, You earn: ${document.getElementById('previewEarnings').textContent}`;
        document.getElementById('previewPriceInfo').textContent = priceInfo;

        // NEW: File Upload Info
        const ticketFile = document.getElementById('ticketUpload').files[0];
        document.getElementById('previewTicketUpload').textContent = ticketFile ? ticketFile.name : 'No file provided';
        
        const proofFile = document.getElementById('paymentProofUpload').files[0];
        document.getElementById('previewPaymentProof').textContent = proofFile ? proofFile.name : 'No file provided';
    }
    
    // --- Final Form Submission ---
    document.getElementById('ticketListingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if(document.getElementById('agreeTerms').checked && document.getElementById('agreeTransfer').checked){
            alert('Your tickets have been listed successfully!');
            // Here you would send data to the server
            window.location.reload();
        } else {
            alert('Please agree to the terms to continue.');
        }
    });
    
    // --- Helper Functions (like scrollToForm, etc.) ---
    // (Keep your other existing functions here)
    function scrollToForm(){
        document.getElementById('sellForm').scrollIntoView({ behavior: 'smooth' });
    }
});