document.addEventListener('DOMContentLoaded', () => {

    // --- Countdown Timer ---
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    let timeLeft = 10 * 60; // 10 minutes in seconds

    const timerInterval = setInterval(() => {
        timeLeft--;
        
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Your session has expired. Please try again.");
            document.getElementById('checkoutForm').querySelector('button[type="submit"]').disabled = true;
        }
    }, 1000);

    // --- Payment Method Tabs ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to the clicked button and corresponding panel
            button.classList.add('active');
            const tabTarget = button.getAttribute('data-tab');
            document.getElementById(tabTarget).classList.add('active');
        });
    });

    // --- Form Validation ---
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual submission for this demo

        // Simple validation check
        let isValid = true;
        const requiredFields = ['fullName', 'email', 'phone'];
        
        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });

        if (isValid) {
            // If form is valid, simulate successful payment
            alert('Payment Successful! Your tickets have been sent to your email.');
            // In a real application, you would redirect to a confirmation page.
            window.location.href = 'index.html'; // Redirect to home page
        } else {
            alert('Please fill in all the required fields.');
        }
    });

});