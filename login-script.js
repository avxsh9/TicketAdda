// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('loginPassword');
    const passwordToggle = document.getElementById('passwordToggle');

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Real-time validation
    const inputs = {
        email: document.getElementById('loginEmail'),
        password: passwordInput
    };

    // Add blur event listeners for real-time validation
    Object.keys(inputs).forEach(fieldName => {
        inputs[fieldName].addEventListener('blur', () => validateField(fieldName));
        inputs[fieldName].addEventListener('input', () => clearError(fieldName));
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
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
            case 'email':
                if (!value) {
                    showError('email', 'Email address is required');
                    return false;
                } else if (!isValidEmail(value)) {
                    showError('email', 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'password':
                if (!value) {
                    showError('password', 'Password is required');
                    return false;
                } else if (value.length < 6) {
                    showError('password', 'Password must be at least 6 characters long');
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
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const fieldElement = inputs[fieldName];
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        if (fieldElement) {
            fieldElement.classList.add('error');
        }
    }

    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const fieldElement = inputs[fieldName];
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        
        if (fieldElement) {
            fieldElement.classList.remove('error');
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function submitForm() {
        const submitBtn = document.querySelector('.login-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Signing In...';
        btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
        
        // Simulate API call
        setTimeout(() => {
            // Collect form data
            const formData = {
                email: inputs.email.value.trim(),
                password: inputs.password.value,
                rememberMe: document.getElementById('rememberMe').checked,
                timestamp: new Date().toISOString()
            };
            
            // In a real application, you would send this data to your backend
            console.log('Login attempted with data:', formData);
            
            // Simulate successful login
            showSuccessMessage();
            
        }, 1500);
    }

    function showSuccessMessage() {
        const formContainer = document.querySelector('.login-form-container');
        
        formContainer.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="success-title">Welcome Back!</h2>
                <p class="success-text">
                    You have successfully signed in to your TicketAdda account. 
                    Redirecting you to your dashboard...
                </p>
                <div class="success-actions">
                    <a href="index.html" class="btn-primary">Go to Dashboard</a>
                    <a href="index.html#categories" class="btn-secondary">Browse Events</a>
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

        // Auto-redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    // Social login handlers
    document.querySelector('.google-btn').addEventListener('click', function() {
        // In a real application, integrate with Google OAuth
        console.log('Google login clicked');
        alert('Google login will be implemented with OAuth integration');
    });

    document.querySelector('.facebook-btn').addEventListener('click', function() {
        // In a real application, integrate with Facebook OAuth
        console.log('Facebook login clicked');
        alert('Facebook login will be implemented with OAuth integration');
    });

    // Forgot password handler
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = inputs.email.value.trim();
        
        if (!email) {
            alert('Please enter your email address first, then click "Forgot password?"');
            inputs.email.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address first, then click "Forgot password?"');
            inputs.email.focus();
            return;
        }
        
        // In a real application, you would send a password reset email
        alert(`Password reset instructions have been sent to ${email}`);
    });
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
