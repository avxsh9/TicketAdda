document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    const inputs = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        terms: document.getElementById('terms')
    };

    // Password visibility toggles
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength checker
    inputs.password.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        strengthBar.className = 'strength-fill';
        
        if (this.value.length > 0) {
            if (strength.score <= 25) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#ef4444';
            } else if (strength.score <= 50) {
                strengthBar.classList.add('fair');
                strengthText.textContent = 'Fair';
                strengthText.style.color = '#f59e0b';
            } else if (strength.score <= 75) {
                strengthBar.classList.add('good');
                strengthText.textContent = 'Good';
                strengthText.style.color = '#eab308';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#22c55e';
            }
        } else {
            strengthText.textContent = 'Password strength';
            strengthText.style.color = '#6c757d';
        }
    });

    // Real-time validation on blur
    Object.keys(inputs).forEach(fieldName => {
        if (inputs[fieldName] && fieldName !== 'terms') {
            inputs[fieldName].addEventListener('blur', () => validateField(fieldName));
            inputs[fieldName].addEventListener('input', () => clearError(fieldName));
        }
    });

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    // --- HELPER FUNCTIONS ---

    function validateField(fieldName) {
        const field = inputs[fieldName];
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        clearError(fieldName);
        let isValid = true;

        switch (fieldName) {
            case 'fullName':
                if (!value) { showError(fieldName, 'Full name is required'); isValid = false; }
                break;
            case 'email':
                if (!value) { showError(fieldName, 'Email is required'); isValid = false; }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { showError(fieldName, 'Invalid email format'); isValid = false; }
                break;
            case 'password':
                if (!value) { showError(fieldName, 'Password is required'); isValid = false; }
                else if (value.length < 8) { showError(fieldName, 'Password must be at least 8 characters'); isValid = false; }
                break;
            case 'confirmPassword':
                if (!value) { showError(fieldName, 'Please confirm your password'); isValid = false; }
                else if (value !== inputs.password.value) { showError(fieldName, 'Passwords do not match'); isValid = false; }
                break;
            case 'terms':
                if (!value) { showError(fieldName, 'You must accept the terms'); isValid = false; }
                break;
        }
        return isValid;
    }

    function validateForm() {
        let isFormValid = true;
        Object.keys(inputs).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/[0-9]/.test(password)) score += 25;
        if (/[^A-Za-z0-9]/.test(password)) score += 25;
        return { score: Math.min(score, 100) };
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const fieldElement = inputs[fieldName];
        if (errorElement) { errorElement.textContent = message; errorElement.classList.add('show'); }
        if (fieldElement && fieldElement.type !== 'checkbox') { fieldElement.classList.add('error'); }
    }

    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const fieldElement = inputs[fieldName];
        if (errorElement) { errorElement.classList.remove('show'); }
        if (fieldElement && fieldElement.type !== 'checkbox') { fieldElement.classList.remove('error'); }
    }

    function submitForm() {
        const submitBtn = signupForm.querySelector('.btn-primary');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Creating Account...`;

        setTimeout(() => {
            showSuccessMessage();
        }, 1500);
    }

    function showSuccessMessage() {
        const formSection = document.querySelector('.auth-form-section');
        formSection.innerHTML = `
            <div class="success-message">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h2 class="success-title">Welcome to TicketAdda!</h2>
                <p class="success-text">Your account has been created. Start discovering amazing events now!</p>
                <div class="success-actions">
                    <a href="login.html" class="btn-primary">Go to Sign In</a>
                    <a href="index.html" class="btn-secondary">Explore Events</a>
                </div>
            </div>`;
    }
});