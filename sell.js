(function() {
  'use strict';

  const PLATFORM_FEE_RATE = 0.02;
  const MAX_TOTAL = Infinity;

  let currentStep = 1;
  const totalSteps = 4;

  const formData = {
      eventName: '',
      eventCategory: '',
      eventDate: '',
      eventTime: '',
      venue: '',
      ticketSection: '',
      ticketRow: '',
      seatNumbers: '',
      quantity: 0,
      ticketType: 'mobile',
      sellingPrice: 0,
      agreeTerms: false,
      agreeTransfer: false
  };

  function formatINR(num) {
      if (isNaN(num)) num = 0;
      return '₹' + Number(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  function calculate() {
      const priceInput = document.getElementById('ticketPrice');
      const qtyInput = document.getElementById('ticketQuantity');

      if (!priceInput || !qtyInput) return;

      let price = parseInt(priceInput.value) || 0;
      let qty = parseInt(qtyInput.value) || 1;

      let totalSale = price * qty;
      if (totalSale > MAX_TOTAL) {
          totalSale = MAX_TOTAL;
      }

      const platformFee = Math.round(totalSale * PLATFORM_FEE_RATE);
      const earnings = totalSale - platformFee;

      const totalSaleEl = document.getElementById('totalSale');
      const platformFeeEl = document.getElementById('platformFee');
      const youEarnEl = document.getElementById('youEarn');

      if (totalSaleEl) totalSaleEl.textContent = formatINR(totalSale);
      if (platformFeeEl) platformFeeEl.textContent = formatINR(platformFee);
      if (youEarnEl) youEarnEl.textContent = formatINR(earnings);
  }

  function updatePreview() {
      updateEarningsPreview();
      updateListingPreview();
  }

  function updateEarningsPreview() {
      const price = parseInt(formData.sellingPrice) || 0;
      const qty = parseInt(formData.quantity) || 1;

      let totalSale = price * qty;
      if (totalSale > MAX_TOTAL) totalSale = MAX_TOTAL;

      const fee = Math.round(totalSale * PLATFORM_FEE_RATE);
      const earnings = totalSale - fee;

      const previewPrice = document.getElementById('previewPrice');
      const previewQuantity = document.getElementById('previewQuantity');
      const previewTotal = document.getElementById('previewTotal');
      const previewFee = document.getElementById('previewFee');
      const previewEarnings = document.getElementById('previewEarnings');

      if (previewPrice) previewPrice.textContent = formatINR(price);
      if (previewQuantity) previewQuantity.textContent = String(qty);
      if (previewTotal) previewTotal.textContent = formatINR(totalSale);
      if (previewFee) previewFee.textContent = formatINR(fee);
      if (previewEarnings) previewEarnings.textContent = formatINR(earnings);
  }

  function updateListingPreview() {
      const previewEventName = document.getElementById('previewEventName');
      const previewCategory = document.getElementById('previewCategory');
      const previewEventDate = document.getElementById('previewEventDate');
      const previewVenue = document.getElementById('previewVenue');
      const previewTicketInfo = document.getElementById('previewTicketInfo');
      const previewPriceInfo = document.getElementById('previewPriceInfo');

      if (previewEventName) previewEventName.textContent = formData.eventName || 'Event Name';
      if (previewCategory) previewCategory.textContent = formData.eventCategory || 'Category';

      if (formData.eventDate) {
          const d = new Date(formData.eventDate);
          const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          let dateStr = d.toLocaleDateString('en-IN', opts);
          if (formData.eventTime) dateStr += ' at ' + formData.eventTime;
          if (previewEventDate) previewEventDate.textContent = dateStr;
      } else {
          if (previewEventDate) previewEventDate.textContent = 'Date';
      }

      if (previewVenue) previewVenue.textContent = formData.venue || 'Venue';

      let ticketInfo = '';
      if (formData.quantity) ticketInfo += `${formData.quantity} ticket${formData.quantity > 1 ? 's' : ''}`;
      if (formData.ticketSection) ticketInfo += ` • ${formData.ticketSection}`;
      if (formData.ticketRow) ticketInfo += ` • Row ${formData.ticketRow}`;
      if (formData.seatNumbers) ticketInfo += ` • Seats ${formData.seatNumbers}`;
      if (previewTicketInfo) previewTicketInfo.textContent = ticketInfo || 'Ticket info';

      const price = parseInt(formData.sellingPrice) || 0;
      const qty = parseInt(formData.quantity) || 1;
      let total = price * qty;
      if (total > MAX_TOTAL) total = MAX_TOTAL;
      if (previewPriceInfo) previewPriceInfo.textContent = `₹${price.toLocaleString()} per ticket • Total: ₹${total.toLocaleString()}`;
  }

  function validateCurrentStep() {
      const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
      if (!currentFormStep) return true;

      const required = currentFormStep.querySelectorAll('input[required], select[required]');
      let ok = true;

      required.forEach(inp => {
          inp.classList.remove('error-border');

          if (inp.type === 'checkbox') {
              if (!inp.checked) {
                  inp.parentElement.querySelector('.checkmark').classList.add('error-border');
                  ok = false;
              }
          } else if (inp.type === 'file') {
              if (!inp.files || !inp.files[0]) {
                  inp.parentElement.querySelector('.file-upload-label').style.borderColor = '#dc3545';
                  ok = false;
              }
          } else {
              if (!String(inp.value || '').trim()) {
                  inp.classList.add('error-border');
                  ok = false;
              }
          }
      });

      if (!ok) {
          alert('Please fill all required fields before proceeding.');
      }

      return ok;
  }

  function nextStep() {
      if (!validateCurrentStep()) return;

      if (currentStep < totalSteps) {
          currentStep++;
          updateStepDisplay();
      }
  }

  function prevStep() {
      if (currentStep > 1) {
          currentStep--;
          updateStepDisplay();
      }
  }

  function updateStepDisplay() {
      const steps = document.querySelectorAll('.form-step');
      steps.forEach(s => {
          const stepNum = parseInt(s.getAttribute('data-step'));
          s.classList.toggle('active', stepNum === currentStep);
      });

      const indicators = document.querySelectorAll('.progress-indicator .step');
      indicators.forEach(ind => {
          const stepNum = parseInt(ind.getAttribute('data-step'));
          ind.classList.toggle('active', stepNum <= currentStep);
      });

      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const submitBtn = document.getElementById('submitBtn');

      if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
      if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
      if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

      if (currentStep === totalSteps) {
          populateReview();
      }
  }

  function populateReview() {
      updateListingPreview();
      updateEarningsPreview();

      const ticketUpload = document.getElementById('ticketUpload');
      const paymentProofUpload = document.getElementById('paymentProofUpload');
      const previewTicketUpload = document.getElementById('previewTicketUpload');
      const previewPaymentProof = document.getElementById('previewPaymentProof');

      if (ticketUpload && previewTicketUpload) {
          previewTicketUpload.textContent = ticketUpload.files[0] ? ticketUpload.files[0].name : 'No file provided';
      }

      if (paymentProofUpload && previewPaymentProof) {
          previewPaymentProof.textContent = paymentProofUpload.files[0] ? paymentProofUpload.files[0].name : 'No file provided';
      }
  }

  function handleSubmit(e) {
      e.preventDefault();

      const agreeTerms = document.getElementById('agreeTerms');
      const agreeTransfer = document.getElementById('agreeTransfer');

      if (!agreeTerms || !agreeTransfer) {
          alert('Terms checkboxes missing');
          return;
      }

      if (!agreeTerms.checked || !agreeTransfer.checked) {
          alert('Please agree to all terms before submitting.');
          return;
      }

      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
          submitBtn.disabled = true;

          setTimeout(() => {
              alert('Tickets listed successfully! Thank you for using TicketAdda.');
              window.location.reload();
          }, 1500);
      }
  }

  function setupFileUpload(inputId, previewId) {
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);

      if (!input || !preview) return;

      input.addEventListener('change', function() {
          if (this.files && this.files[0]) {
              preview.style.display = 'flex';
              preview.innerHTML = `<i class="fas fa-check-circle"></i> ${escapeHtml(this.files[0].name)}`;

              const label = document.querySelector(`label[for="${inputId}"]`);
              if (label) label.style.borderColor = '#e9ecef';
          } else {
              preview.style.display = 'none';
          }
      });
  }

  function escapeHtml(text) {
      const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
  }

  function initializeEventSuggestions() {
      const eventInput = document.getElementById('eventName');
      const suggestions = document.getElementById('eventSuggestions');

      if (!eventInput || !suggestions) return;

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

          if (value.length < 3) {
              suggestions.style.display = 'none';
              return;
          }

          const matches = mockEvents.filter(event => event.toLowerCase().includes(value));

          if (matches.length === 0) {
              suggestions.style.display = 'none';
              return;
          }

          suggestions.innerHTML = matches.map(event =>
              `<div class="suggestion-item" data-value="${escapeHtml(event)}">${escapeHtml(event)}</div>`
          ).join('');

          suggestions.style.display = 'block';

          suggestions.querySelectorAll('.suggestion-item').forEach(item => {
              item.addEventListener('click', function() {
                  eventInput.value = this.getAttribute('data-value');
                  formData.eventName = this.getAttribute('data-value');
                  suggestions.style.display = 'none';
                  updatePreview();
              });
          });
      });

      document.addEventListener('click', function(e) {
          if (!eventInput.contains(e.target) && !suggestions.contains(e.target)) {
              suggestions.style.display = 'none';
          }
      });
  }

  function initializePricingSuggestions() {
      const buttons = document.querySelectorAll('.suggestion-btn');
      const priceInput = document.getElementById('sellingPrice');

      if (!priceInput) return;

      buttons.forEach(btn => {
          btn.addEventListener('click', function() {
              const price = parseInt(this.getAttribute('data-price'));
              priceInput.value = price;
              formData.sellingPrice = price;
              updatePreview();

              buttons.forEach(b => {
                  b.style.background = '';
                  b.style.borderColor = '';
              });

              this.style.background = '#f8f9fa';
              this.style.borderColor = '#3b82f6';
          });
      });

      priceInput.addEventListener('input', function() {
          formData.sellingPrice = this.value;
          updatePreview();
      });
  }

  function addFormInputListeners() {
      const inputs = document.querySelectorAll('#ticketListingForm input, #ticketListingForm select');

      inputs.forEach(input => {
          input.addEventListener('change', function() {
              if (this.type === 'checkbox') {
                  formData[this.name] = this.checked;
              } else if (this.type === 'radio') {
                  if (this.checked) formData[this.name] = this.value;
              } else {
                  formData[this.name] = this.value;
              }
              updatePreview();
          });

          input.addEventListener('input', function() {
              if (this.type !== 'checkbox' && this.type !== 'radio') {
                  formData[this.name] = this.value;
                  updatePreview();
              }
          });
      });
  }

  window.scrollToForm = function() {
      const form = document.getElementById('sellForm');
      if (form) {
          form.scrollIntoView({ behavior: 'smooth' });
      }
  };

  document.addEventListener('DOMContentLoaded', function() {
      calculate();

      const ticketPriceInput = document.getElementById('ticketPrice');
      const ticketQuantityInput = document.getElementById('ticketQuantity');

      if (ticketPriceInput) ticketPriceInput.addEventListener('input', calculate);
      if (ticketQuantityInput) ticketQuantityInput.addEventListener('change', calculate);

      const form = document.getElementById('ticketListingForm');
      const nextBtn = document.getElementById('nextBtn');
      const prevBtn = document.getElementById('prevBtn');

      if (form) form.addEventListener('submit', handleSubmit);
      if (nextBtn) nextBtn.addEventListener('click', nextStep);
      if (prevBtn) prevBtn.addEventListener('click', prevStep);

      addFormInputListeners();
      initializeEventSuggestions();
      initializePricingSuggestions();
      setupFileUpload('ticketUpload', 'ticketUploadPreview');
      setupFileUpload('paymentProofUpload', 'paymentProofUploadPreview');
      updateStepDisplay();
  });
})();
