// help.js - Email sending + form wiring for TicketAdda Help page
// Config - replace if you change service/template/public keys
const EMAILJS_SERVICE_ID = 'service_s1wnsp8';
const EMAILJS_TEMPLATE_ID = 'template_vjnh88v';
const EMAILJS_PUBLIC_KEY = 'nRRLaf6LXw6OLVSgZ';
const DEST_EMAIL = 'ticketadda.in@gmail.com';

// Dynamically load EmailJS SDK if not already present
function loadEmailJSSDKIfNeeded(cb) {
  if (typeof window.emailjs !== 'undefined') return cb();
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  s.onload = () => cb();
  s.onerror = () => cb(new Error('Failed to load EmailJS SDK'));
  document.head.appendChild(s);
}

// Initialize SDK and attach submit handler
function initForm() {
  if (typeof window.emailjs === 'undefined') {
    console.error('EmailJS SDK not available after load.');
    return;
  }

  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized');
  } catch (err) {
    console.warn('EmailJS init exception', err);
  }

  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form) {
    console.error('contactForm not found.');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // collect values
    const from_name = document.getElementById('contactName').value.trim();
    const reply_to = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // validation
    if (!from_name || !reply_to || !subject || !message) {
      statusEl.textContent = 'Please fill all fields.';
      return;
    }

    // UI lock
    submitBtn.disabled = true;
    statusEl.textContent = 'Sending...';

    const templateParams = {
      from_name,
      reply_to,
      subject,
      message,
      to_email: DEST_EMAIL // include this in case template uses {{to_email}}
    };

    console.log('templateParams ->', templateParams);

    try {
      const resp = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('EmailJS success:', resp);
      statusEl.textContent = 'Message sent. Thank you!';
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);

      // Helpful guidance for the very common 422 recipients-empty case
      if (err && err.status === 422) {
        statusEl.textContent = 'Failed: recipients address is empty. Set "To" in EmailJS template to ticketadda.in@gmail.com or use {{to_email}}.';
        alert('EmailJS rejected request: recipient is empty. Open the EmailJS dashboard → Templates → set the To field to ticketadda.in@gmail.com or use {{to_email}}.');
      } else {
        statusEl.textContent = 'Failed to send. Check console for details.';
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Start
loadEmailJSSDKIfNeeded((err) => {
  if (err) {
    console.error('Could not load EmailJS SDK', err);
    const s = document.getElementById('contactStatus');
    if (s) s.textContent = 'Email service unavailable.';
    return;
  }
  initForm();
});
