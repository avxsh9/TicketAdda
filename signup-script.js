// Signup Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Password strength checker
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBar.className = 'strength-fill';
        
        if (password.length > 0) {
            if (strength.score <= 25) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak password';
                strengthText.style.color = '#e74c3c';
            } else if (strength.score <= 50) {
                strengthBar.classList.add('fair');
                strengthText.textContent = 'Fair password';
                strengthText.style.color = '#f39c12';
            } else if (strength.score <= 75) {
                strengthBar.classList.add('good');
                strengthText.textContent = 'Good password';
                strengthText.style.color = '#f1c40f';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong password';
                strengthText.style.color = '#27ae60';
            }
        } else {
            strengthText.textContent = 'Password strength';
            strengthText.style.color = '#666';
        }
    });

    // Real-time validation
    const inputs = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        password: passwordInput,
        confirmPassword: confirmPasswordInput,
        termsAccept: document.getElementById('termsAccept')
    };

    // Add blur event listeners for real-time validation
    Object.keys(inputs).forEach(fieldName => {
        if (inputs[fieldName] && fieldName !== 'termsAccept') {
            inputs[fieldName].addEventListener('blur', () => validateField(fieldName));
            inputs[fieldName].addEventListener('input', () => clearError(fieldName));
        }
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        clearError('confirmPassword');
        if (this.value && this.value !== passwordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
        }
    });

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    function validateField(fieldName) {
        const field = inputs[fieldName];
        const value = field.value.trim();
        
        clearError(fieldName);
        
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    showError(fieldName, `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`);
                    return false;
                } else if (value.length < 2) {
                    showError(fieldName, `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`);
                    return false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    showError(fieldName, 'Name can only contain letters and spaces');
                    return false;
                }
                break;
                
            case 'email':
                if (!value) {
                    showError('email', 'Email address is required');
                    return false;
                } else if (!isValidEmail(value)) {
                    showError('email', 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                if (!value) {
                    showError('phone', 'Phone number is required');
                    return false;
                } else if (!/^[6-9]\d{9}$/.test(value)) {
                    showError('phone', 'Please enter a valid 10-digit Indian phone number');
                    return false;
                }
                break;
                
            case 'password':
                if (!value) {
                    showError('password', 'Password is required');
                    return false;
                } else if (value.length < 8) {
                    showError('password', 'Password must be at least 8 characters long');
                    return false;
                } else if (calculatePasswordStrength(value).score < 50) {
                    showError('password', 'Password is too weak. Please use a stronger password');
                    return false;
                }
                break;
                
            case 'confirmPassword':
                if (!value) {
                    showError('confirmPassword', 'Please confirm your password');
                    return false;
                } else if (value !== passwordInput.value) {
                    showError('confirmPassword', 'Passwords do not match');
                    return false;
                }
                break;
        }
        
        return true;
    }

    function validateForm() {
        let isValid = true;
        
        // Validate all fields
        Object.keys(inputs).forEach(fieldName => {
            if (fieldName !== 'termsAccept') {
                if (!validateField(fieldName)) {
                    isValid = false;
                }
            }
        });
        
        // Check terms acceptance
        if (!inputs.termsAccept.checked) {
            showError('termsAccept', 'You must accept the terms and conditions');
            isValid = false;
        }
        
        return isValid;
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const fieldElement = inputs[fieldName];
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        if (fieldElement && fieldElement.type !== 'checkbox') {
            fieldElement.classList.add('error');
        }
    }

    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const fieldElement = inputs[fieldName];
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        
        if (fieldElement && fieldElement.type !== 'checkbox') {
            fieldElement.classList.remove('error');
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 25;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        
        return { score: Math.min(score, 100) };
    }

    function submitForm() {
        const submitBtn = document.querySelector('.signup-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Creating Account...';
        btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
        
        // Simulate API call
        setTimeout(() => {
            // Collect form data
            const formData = {
                firstName: inputs.firstName.value.trim(),
                lastName: inputs.lastName.value.trim(),
                email: inputs.email.value.trim(),
                phone: inputs.phone.value.trim(),
                password: inputs.password.value,
                newsletter: document.getElementById('newsletter').checked,
                timestamp: new Date().toISOString()
            };
            
            // In a real application, you would send this data to your backend
            console.log('Account created with data:', formData);
            
            // Show success message
            showSuccessMessage();
            
        }, 2000);
    }

    function showSuccessMessage() {
        const formContainer = document.querySelector('.signup-form-container');
        
        formContainer.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="success-title">Account Created Successfully!</h2>
                <p class="success-text">
                    Welcome to TicketAdda! We've sent a verification email to your address. 
                    Please check your inbox and click the verification link to activate your account.
                </p>
                <div class="success-actions">
                    <a href="login.html" class="btn-primary">Go to Login</a>
                    <a href="index.html" class="btn-secondary">Back to Home</a>
                </div>
            </div>
        `;
        
        // Add success message styles
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                text-align: center;
                padding: 40px 20px;
            }
            
            .success-icon {
                font-size: 4rem;
                color: #27ae60;
                margin-bottom: 20px;
            }
            
            .success-title {
                font-size: 1.8rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 15px;
            }
            
            .success-text {
                font-size: 1rem;
                color: #666;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            
            .success-actions {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .success-actions .btn-primary,
            .success-actions .btn-secondary {
                display: inline-block;
                padding: 14px 24px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .success-actions .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .success-actions .btn-secondary {
                background: transparent;
                color: #667eea;
                border: 2px solid #667eea;
            }
            
            .success-actions .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }
            
            .success-actions .btn-secondary:hover {
                background: #667eea;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    // Social login handlers
    document.querySelector('.google-btn').addEventListener('click', function() {
        // In a real application, integrate with Google OAuth
        console.log('Google signup clicked');
        alert('Google signup will be implemented with OAuth integration');
    });

    document.querySelector('.facebook-btn').addEventListener('click', function() {
        // In a real application, integrate with Facebook OAuth
        console.log('Facebook signup clicked');
        alert('Facebook signup will be implemented with OAuth integration');
    });
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 10) {
        value = value.slice(0, 10); // Limit to 10 digits
    }
    e.target.value = value;
});

// Smooth animations for form interactions
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentNode.classList.remove('focused');
        }
    });
});
