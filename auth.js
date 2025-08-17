// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    initializePasswordToggle();
    initializePasswordStrength();
    initializeFormValidation();
    initializeSocialLogin();
    
    // Check if user is already logged in
    checkAuthStatus();
}

// Password toggle functionality
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        const strengthFill = strengthIndicator.querySelector('.strength-fill');
        const strengthText = strengthIndicator.querySelector('.strength-text');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update visual indicator
            strengthFill.className = 'strength-fill';
            
            if (password.length === 0) {
                strengthFill.style.width = '0%';
                strengthText.textContent = 'Password strength';
                return;
            }
            
            switch (strength.level) {
                case 'weak':
                    strengthFill.classList.add('weak');
                    strengthText.textContent = 'Weak password';
                    break;
                case 'medium':
                    strengthFill.classList.add('medium');
                    strengthText.textContent = 'Medium strength';
                    break;
                case 'strong':
                    strengthFill.classList.add('strong');
                    strengthText.textContent = 'Strong password';
                    break;
            }
        });
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength level
    if (score < 3) {
        return { level: 'weak', score };
    } else if (score < 5) {
        return { level: 'medium', score };
    } else {
        return { level: 'strong', score };
    }
}

// Form validation
function initializeFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Real-time validation for login
        const emailInput = loginForm.querySelector('#email');
        const passwordInput = loginForm.querySelector('#password');
        
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        passwordInput.addEventListener('blur', () => validatePassword(passwordInput));
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        
        // Real-time validation for signup
        const inputs = signupForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
        });
        
        // Password confirmation validation
        const passwordInput = signupForm.querySelector('#password');
        const confirmPasswordInput = signupForm.querySelector('#confirmPassword');
        
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                validatePasswordConfirmation(passwordInput, confirmPasswordInput);
            });
        }
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateLoginForm(form)) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
        // Simulate API call
        await simulateLogin({
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        });
        
        // Success - redirect to dashboard or return page
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
        window.location.href = returnUrl;
        
    } catch (error) {
        showFormError(form, error.message);
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateSignupForm(form)) {
        return;
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
        // Simulate API call
        await simulateSignup({
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            newsletter: formData.get('newsletter') === 'on'
        });
        
        // Success - redirect to verification or dashboard
        window.location.href = 'index.html?welcome=true';
        
    } catch (error) {
        showFormError(form, error.message);
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Validate login form
function validateLoginForm(form) {
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    
    let isValid = true;
    
    if (!validateEmail(email)) isValid = false;
    if (!validatePassword(password)) isValid = false;
    
    return isValid;
}

// Validate signup form
function validateSignupForm(form) {
    const fullName = form.querySelector('#fullName');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    const terms = form.querySelector('#terms');
    
    let isValid = true;
    
    if (!validateRequired(fullName)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validatePhone(phone)) isValid = false;
    if (!validatePassword(password, true)) isValid = false;
    if (!validatePasswordConfirmation(password, confirmPassword)) isValid = false;
    if (!validateRequired(terms)) isValid = false;
    
    return isValid;
}

// Field validation functions
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number
    
    if (email === '') {
        showFieldError(input, 'Email or phone is required');
        return false;
    }
    
    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
        showFieldError(input, 'Please enter a valid email or phone number');
        return false;
    }
    
    showFieldSuccess(input);
    return true;
}

function validatePhone(input) {
    const phone = input.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    
    if (phone === '') {
        showFieldError(input, 'Phone number is required');
        return false;
    }
    
    if (!phoneRegex.test(phone)) {
        showFieldError(input, 'Please enter a valid Indian mobile number');
        return false;
    }
    
    showFieldSuccess(input);
    return true;
}

function validatePassword(input, isSignup = false) {
    const password = input.value;
    
    if (password === '') {
        showFieldError(input, 'Password is required');
        return false;
    }
    
    if (isSignup) {
        if (password.length < 8) {
            showFieldError(input, 'Password must be at least 8 characters long');
            return false;
        }
        
        const strength = calculatePasswordStrength(password);
        if (strength.level === 'weak') {
            showFieldError(input, 'Please choose a stronger password');
            return false;
        }
    }
    
    showFieldSuccess(input);
    return true;
}

function validatePasswordConfirmation(passwordInput, confirmInput) {
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    if (confirm === '') {
        showFieldError(confirmInput, 'Please confirm your password');
        return false;
    }
    
    if (password !== confirm) {
        showFieldError(confirmInput, 'Passwords do not match');
        return false;
    }
    
    showFieldSuccess(confirmInput);
    return true;
}

function validateRequired(input) {
    if (input.type === 'checkbox') {
        if (!input.checked) {
            showFieldError(input, 'This field is required');
            return false;
        }
    } else {
        if (input.value.trim() === '') {
            showFieldError(input, 'This field is required');
            return false;
        }
    }
    
    showFieldSuccess(input);
    return true;
}

function validateField(input) {
    switch (input.type) {
        case 'email':
            return validateEmail(input);
        case 'tel':
            return validatePhone(input);
        case 'password':
            return validatePassword(input, input.form.id === 'signupForm');
        case 'checkbox':
            return validateRequired(input);
        default:
            return validateRequired(input);
    }
}

// Show field error
function showFieldError(input, message) {
    const wrapper = input.closest('.form-group') || input.closest('.checkbox-wrapper').parentNode;
    
    // Remove existing error
    const existingError = wrapper.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class to input
    if (input.type === 'checkbox') {
        input.closest('.checkbox-wrapper').classList.add('error');
    } else {
        input.classList.add('error');
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    wrapper.appendChild(errorDiv);
}

// Show field success
function showFieldSuccess(input) {
    const wrapper = input.closest('.form-group') || input.closest('.checkbox-wrapper').parentNode;
    
    // Remove existing error
    const existingError = wrapper.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Remove error class and add success class
    if (input.type === 'checkbox') {
        const checkboxWrapper = input.closest('.checkbox-wrapper');
        checkboxWrapper.classList.remove('error');
        checkboxWrapper.classList.add('success');
    } else {
        input.classList.remove('error');
        input.classList.add('success');
    }
}

// Show form error
function showFormError(form, message) {
    // Remove existing error
    const existingError = form.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message form-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginBottom = '20px';
    
    const submitButton = form.querySelector('button[type="submit"]');
    form.insertBefore(errorDiv, submitButton);
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = '<span class="spinner"></span> Please wait...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        
        // Restore original text
        if (button.form.id === 'loginForm') {
            button.textContent = 'Sign in';
        } else {
            button.textContent = 'Create account';
        }
    }
}

// Social login initialization
function initializeSocialLogin() {
    const googleButtons = document.querySelectorAll('.btn-google');
    const facebookButtons = document.querySelectorAll('.btn-facebook');
    
    googleButtons.forEach(button => {
        button.addEventListener('click', () => handleSocialLogin('google'));
    });
    
    facebookButtons.forEach(button => {
        button.addEventListener('click', () => handleSocialLogin('facebook'));
    });
}

// Handle social login
function handleSocialLogin(provider) {
    console.log(`Initiating ${provider} login...`);
    
    // In a real app, this would integrate with OAuth providers
    // For demo purposes, we'll simulate success
    setTimeout(() => {
        alert(`${provider} login successful! (Demo)`);
        window.location.href = 'index.html';
    }, 1000);
}

// Simulate login API call
async function simulateLogin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate different responses
            if (credentials.email === 'demo@error.com') {
                reject(new Error('Invalid email or password'));
            } else {
                // Store auth token (in real app, this would be secure)
                localStorage.setItem('authToken', 'demo-token-123');
                localStorage.setItem('userEmail', credentials.email);
                
                if (credentials.remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                resolve({ success: true });
            }
        }, 1500);
    });
}

// Simulate signup API call
async function simulateSignup(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate email already exists error
            if (userData.email === 'existing@example.com') {
                reject(new Error('An account with this email already exists'));
            } else {
                // Store auth token
                localStorage.setItem('authToken', 'demo-token-123');
                localStorage.setItem('userEmail', userData.email);
                localStorage.setItem('userName', userData.fullName);
                
                resolve({ success: true });
            }
        }, 2000);
    });
}

// Check authentication status
function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (authToken && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        // User is already logged in, redirect to home
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
        window.location.href = returnUrl;
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('rememberMe');
    
    window.location.href = 'index.html';
}

// Forgot password functionality
function handleForgotPassword() {
    const email = prompt('Please enter your email address:');
    
    if (email) {
        // Simulate sending reset email
        alert('Password reset instructions have been sent to your email.');
    }
}

// Add event listeners for forgot password links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('forgot-link')) {
        e.preventDefault();
        handleForgotPassword();
    }
});

// Auto-fill demo credentials (for testing)
function fillDemoCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput && window.location.search.includes('demo=true')) {
        emailInput.value = 'demo@ticketadda.in';
        passwordInput.value = 'demo123456';
    }
}

// Initialize demo credentials if needed
setTimeout(fillDemoCredentials, 100);

// Form accessibility improvements
function improveAccessibility() {
    // Add ARIA labels and descriptions
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label && !input.getAttribute('aria-labelledby')) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                if (!label.id) {
                    label.id = `label-${input.id}`;
                }
            }
        });
    });
    
    // Add keyboard navigation for custom checkboxes
    const checkboxWrappers = document.querySelectorAll('.checkbox-wrapper');
    
    checkboxWrappers.forEach(wrapper => {
        wrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        wrapper.setAttribute('tabindex', '0');
        wrapper.setAttribute('role', 'checkbox');
    });
}

// Initialize accessibility improvements
improveAccessibility();
