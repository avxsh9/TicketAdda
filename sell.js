// TicketAdda - sell.js (Fixed & Consolidated)
// Purpose: Reliable, self-contained client-side JS for "List Your Ticket" flow.
// IDs expected in HTML: ticketListingForm, ticketPrice, ticketQuantity, totalSale, platformFee, youEarn,
// sellingPrice, quantity, previewPrice, previewQuantity, previewTotal, previewFee, previewEarnings,
// previewEventName, previewCategory, previewEventDate, previewVenue, previewTicketInfo, previewPriceInfo,
// nextBtn, prevBtn, submitBtn, agreeTerms, agreeTransfer, ticketUpload, ticketUploadPreview,
// paymentProofUpload, paymentProofUploadPreview, eventName, eventCategory, eventDate, eventTime, venue, ticketSection, ticketRow, seatNumbers

// ---------------- CONFIG ----------------
const MAX_TOTAL = 100000; // ₹1,00,000 cap
const PLATFORM_FEE_RATE = 0.03; // 3%
const AUTO_SAVE_KEY = 'ticketadda_sell_draft_v1';
const ALERT_ON_CAP = true; // show alert when cap hits
const AUTOSAVE_INTERVAL_MS = 8000;

// ---------------- STATE -----------------
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
  quantity: 1,
  ticketType: 'mobile',
  ticketPrice: 0, // hero
  ticketQuantity: 1, // hero
  sellingPrice: 0, // listing price
  agreeTerms: false,
  agreeTransfer: false
};

// undo/redo minimal stacks
const undoStack = [];
const redoStack = [];
const UNDO_LIMIT = 100;

// debounce helpers
let debounceTimers = {};
function debounce(fn, ms, key) {
  return function(...args) {
    if (key) clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(() => fn.apply(this, args), ms);
  };
}

// ---------------- UTIL ------------------
function el(id) { return document.getElementById(id); }
function safeInt(v, fallback = 0) { const n = parseInt(v, 10); return Number.isNaN(n) ? fallback : n; }
function formatINR(n) { if (isNaN(n)) n = 0; return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function pushUndo() {
  try {
    const snap = JSON.stringify(formData);
    undoStack.push(snap);
    if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    // clear redo
    redoStack.length = 0;
  } catch (e) { console.warn('undo push failed', e); }
}

function undo() {
  if (!undoStack.length) { alert('Nothing to undo'); return; }
  redoStack.push(JSON.stringify(formData));
  const last = undoStack.pop();
  Object.assign(formData, JSON.parse(last));
  applyFormDataToUI();
  updatePreview();
}
function redo() {
  if (!redoStack.length) { alert('Nothing to redo'); return; }
  undoStack.push(JSON.stringify(formData));
  const last = redoStack.pop();
  Object.assign(formData, JSON.parse(last));
  applyFormDataToUI();
  updatePreview();
}

// ---------------- AUTOSAVE ----------------
let autosaveTimer = null;
function startAutosave() {
  if (autosaveTimer) clearInterval(autosaveTimer);
  autosaveTimer = setInterval(() => {
    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData));
      console.log('Autosaved');
    } catch (e) { console.warn('autosave failed', e); }
  }, AUTOSAVE_INTERVAL_MS);
}
function loadAutosave() {
  try {
    const raw = localStorage.getItem(AUTO_SAVE_KEY);
    if (!raw) return false;
    const obj = JSON.parse(raw);
    Object.assign(formData, obj);
    applyFormDataToUI();
    updatePreview();
    return true;
  } catch (e) { console.warn('load autosave failed', e); return false; }
}
function clearAutosave() { try { localStorage.removeItem(AUTO_SAVE_KEY); } catch(e){} }

// ---------------- INITIALIZE ----------------
document.addEventListener('DOMContentLoaded', () => {
  initializeCalculator();
  initializeForm();
  initializePricingSuggestions();
  initializeEventSuggestions();
  initializeFileUploads();
  addAnimationClasses();
  startAutosave();
  loadAutosave();
  updatePreview();
});

// ---------------- CALCULATOR ----------------
function initializeCalculator() {
  const priceInput = el('ticketPrice');
  const qtyInput = el('ticketQuantity');
  if (priceInput) priceInput.addEventListener('input', debounce(heroCalcChanged, 150, 'hero'));
  if (qtyInput) { qtyInput.addEventListener('change', heroCalcChanged); qtyInput.addEventListener('input', debounce(heroCalcChanged, 150, 'hero')); }
  heroCalcChanged();
}

function heroCalcChanged() {
  const price = safeInt(el('ticketPrice') ? el('ticketPrice').value : formData.ticketPrice, 0);
  const quantity = safeInt(el('ticketQuantity') ? el('ticketQuantity').value : formData.ticketQuantity, 1);

  formData.ticketPrice = price;
  formData.ticketQuantity = quantity;

  let totalSale = price * quantity;
  if (totalSale > MAX_TOTAL) {
    totalSale = MAX_TOTAL;
    if (ALERT_ON_CAP && !window.__cap_alert_shown) { window.__cap_alert_shown = true; setTimeout(()=>window.__cap_alert_shown=false,1500); alert('Maximum calculation cap is ' + formatINR(MAX_TOTAL) + '.'); }
  }
  const platformFee = Math.round(totalSale * PLATFORM_FEE_RATE);
  const earnings = totalSale - platformFee;

  if (el('totalSale')) el('totalSale').textContent = formatINR(totalSale);
  if (el('platformFee')) el('platformFee').textContent = formatINR(platformFee);
  if (el('youEarn')) el('youEarn').textContent = formatINR(earnings);

  updatePreview();
}

// ---------------- FORM ----------------
function initializeForm() {
  const form = el('ticketListingForm');
  const nextBtn = el('nextBtn');
  const prevBtn = el('prevBtn');
  const submitBtn = el('submitBtn');

  if (form) form.addEventListener('submit', handleSubmitWithLoading);
  if (nextBtn) nextBtn.addEventListener('click', nextStep);
  if (prevBtn) prevBtn.addEventListener('click', prevStep);

  addFormInputListeners();

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
  });

  updateStepDisplay();
}

function addFormInputListeners() {
  const inputs = document.querySelectorAll('#ticketListingForm input, #ticketListingForm select, #ticketListingForm textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => pushUndo());
    input.addEventListener('change', function() {
      if (this.type === 'checkbox') formData[this.name] = this.checked;
      else if (this.type === 'radio') { if (this.checked) formData[this.name] = this.value; }
      else formData[this.name] = this.value;
      scheduleAutosave(); updatePreview();
    });
    input.addEventListener('input', function() {
      if (this.type !== 'checkbox' && this.type !== 'radio') { formData[this.name] = this.value; scheduleAutosave(); updatePreview(); }
    });
  });
}

function nextStep(e) {
  if (e) e.preventDefault();
  if (!validateCurrentStep()) return;
  if (currentStep < totalSteps) { currentStep++; updateStepDisplay(); }
}
function prevStep(e) { if (e) e.preventDefault(); if (currentStep>1) { currentStep--; updateStepDisplay(); } }

function updateStepDisplay() {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(s => { const n = safeInt(s.dataset.step || s.getAttribute('data-step'), 0); s.classList.toggle('active', n === currentStep); });
  const indicators = document.querySelectorAll('.progress-indicator .step');
  indicators.forEach(ind => { const n = safeInt(ind.dataset.step || ind.getAttribute('data-step'), 0); ind.classList.toggle('active', n <= currentStep); });
  if (el('prevBtn')) el('prevBtn').style.display = currentStep === 1 ? 'none' : 'inline-flex';
  if (el('nextBtn')) el('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
  if (el('submitBtn')) el('submitBtn').style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
  if (currentStep === totalSteps) populateReview();
}

function validateCurrentStep() {
  const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (!currentFormStep) return true;
  const required = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
  let ok = true;
  required.forEach(inp => {
    if (inp.type === 'checkbox') { if (!inp.checked) { markError(inp); ok = false; } }
    else if (inp.type === 'file') { if (!inp.files || !inp.files[0]) { markError(inp); ok = false; alert('Please upload required files.'); } }
    else { if (!String(inp.value || '').trim()) { markError(inp); ok = false; } }
  });
  if (!ok) alert('Please fill all required fields before proceeding.');
  return ok;
}

function markError(elm) { elm.classList.add('error-border'); elm.addEventListener('input', () => elm.classList.remove('error-border'), { once: true }); }

// ---------------- PRICING SUGGESTIONS ----------------
function initializePricingSuggestions() {
  const buttons = document.querySelectorAll('.suggestion-btn');
  const priceInput = el('sellingPrice');
  if (!priceInput) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      const p = safeInt(this.getAttribute('data-price'), 0);
      priceInput.value = p; formData.sellingPrice = p; updatePreview();
      buttons.forEach(b=>{ b.style.background=''; b.style.borderColor=''; });
      this.style.background = '#fff5f3'; this.style.borderColor = '#ff6b35';
    });
  });
  priceInput.addEventListener('input', debounce(() => { formData.sellingPrice = priceInput.value; updatePreview(); scheduleAutosave(); }, 200, 'price_in')); 
}

// ---------------- PREVIEW & EARNINGS ----------------
function updatePreview() {
  updateEarningsPreview();
  updateListingPreview();
}

function updateEarningsPreview() {
  const price = safeInt(formData.sellingPrice || formData.ticketPrice || 0, 0);
  const qty = safeInt(formData.quantity || formData.ticketQuantity || 1, 1);
  let totalSale = price * qty;
  if (totalSale > MAX_TOTAL) totalSale = MAX_TOTAL;
  const fee = Math.round(totalSale * PLATFORM_FEE_RATE);
  const earnings = totalSale - fee;
  if (el('previewPrice')) el('previewPrice').textContent = formatINR(price);
  if (el('previewQuantity')) el('previewQuantity').textContent = String(qty);
  if (el('previewTotal')) el('previewTotal').textContent = formatINR(totalSale);
  if (el('previewFee')) el('previewFee').textContent = formatINR(fee);
  if (el('previewEarnings')) el('previewEarnings').textContent = formatINR(earnings);
  // small hint
  if (el('previewCapHint')) {
    el('previewCapHint').style.display = (price*qty > MAX_TOTAL) ? 'block' : 'none';
    el('previewCapHint').textContent = 'Total capped at ' + formatINR(MAX_TOTAL) + '.';
  }
}

function updateListingPreview() {
  if (el('previewEventName')) el('previewEventName').textContent = formData.eventName || 'Event Name';
  if (el('previewCategory')) el('previewCategory').textContent = formData.eventCategory || 'Category';
  if (formData.eventDate) {
    const d = new Date(formData.eventDate);
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = d.toLocaleDateString('en-IN', opts);
    if (formData.eventTime) dateStr += ' at ' + formData.eventTime;
    if (el('previewEventDate')) el('previewEventDate').textContent = dateStr;
  } else { if (el('previewEventDate')) el('previewEventDate').textContent = 'Date'; }
  if (el('previewVenue')) el('previewVenue').textContent = formData.venue || 'Venue';
  let ticketInfo = '';
  if (formData.quantity) ticketInfo += `${formData.quantity} ticket${formData.quantity>1?'s':''}`;
  if (formData.ticketSection) ticketInfo += ` • ${formData.ticketSection}`;
  if (formData.ticketRow) ticketInfo += ` • Row ${formData.ticketRow}`;
  if (formData.seatNumbers) ticketInfo += ` • Seats ${formData.seatNumbers}`;
  if (el('previewTicketInfo')) el('previewTicketInfo').textContent = ticketInfo || 'Ticket info';
  const price = safeInt(formData.sellingPrice,0);
  const qty = safeInt(formData.quantity,1);
  let total = price * qty; if (total > MAX_TOTAL) total = MAX_TOTAL;
  if (el('previewPriceInfo')) el('previewPriceInfo').textContent = `₹${price.toLocaleString()} per ticket • Total: ₹${total.toLocaleString()}`;
}

function populateReview() {
  updateListingPreview();
  updateEarningsPreview();
  // files
  if (el('ticketUpload')) el('previewTicketUpload').textContent = el('ticketUpload').files[0] ? el('ticketUpload').files[0].name : 'No file provided';
  if (el('paymentProofUpload')) el('previewPaymentProof').textContent = el('paymentProofUpload').files[0] ? el('paymentProofUpload').files[0].name : 'No file provided';
}

// ---------------- FILE UPLOADS ----------------
function initializeFileUploads() {
  setupFileUpload('ticketUpload','ticketUploadPreview');
  setupFileUpload('paymentProofUpload','paymentProofUploadPreview');
}
function setupFileUpload(inputId, previewId) {
  const input = el(inputId);
  const preview = el(previewId);
  if (!input) return;
  input.addEventListener('change', () => updateFilePreview(input, preview));
  // drag & drop if label exists
  const label = document.querySelector(`label[for="${inputId}"]`);
  if (label) {
    label.addEventListener('dragover', e=>{ e.preventDefault(); label.classList.add('dragover'); });
    label.addEventListener('dragleave', ()=>{ label.classList.remove('dragover'); });
    label.addEventListener('drop', e=>{ e.preventDefault(); label.classList.remove('dragover'); const files = e.dataTransfer.files; if (files.length) { input.files = files; updateFilePreview(input, preview); } });
  }
}
function updateFilePreview(input, preview) {
  if (!preview) return;
  if (input.files && input.files[0]) { preview.style.display = 'flex'; preview.innerHTML = `<i class="fas fa-check-circle"></i> ${escapeHtml(input.files[0].name)}`; }
  else { preview.style.display = 'none'; }
}

// ---------------- EVENT SUGGESTIONS ----------------
function initializeEventSuggestions() {
  const eventInput = el('eventName');
  const sugg = el('eventSuggestions');
  const mock = [
    'Mumbai Indians vs Chennai Super Kings',
    'Coldplay Concert - Mumbai',
    'Arijit Singh Live in Concert',
    'India vs Australia ODI',
    'Sunburn Festival Goa',
    'Comedy Nights with Kapil'
  ];
  if (!eventInput || !sugg) return;
  eventInput.addEventListener('input', debounce(function() {
    const v = (this.value||'').toLowerCase();
    if (v.length < 3) { sugg.style.display='none'; return; }
    const matches = mock.filter(x => x.toLowerCase().includes(v));
    if (!matches.length) { sugg.style.display='none'; return; }
    sugg.innerHTML = matches.map(m=>`<div class="suggestion-item" data-value="${escapeHtml(m)}">${escapeHtml(m)}</div>`).join('');
    sugg.style.display = 'block';
    sugg.querySelectorAll('.suggestion-item').forEach(it => it.addEventListener('click', ()=>{ selectEvent(it.dataset.value); }));
  }, 180, 'evt'));
  document.addEventListener('click', (e)=>{ if (!eventInput.contains(e.target) && !sugg.contains(e.target)) sugg.style.display='none'; });
}
function selectEvent(name) { if (el('eventName')) el('eventName').value = name; formData.eventName = name; updatePreview(); }

// ---------------- SUBMIT ----------------
function handleSubmit(e) {
  e.preventDefault();
  const terms = el('agreeTerms');
  const transfer = el('agreeTransfer');
  if (!terms || !transfer) { alert('Terms checkboxes missing'); return; }
  if (!terms.checked || !transfer.checked) { alert('Please agree to terms'); return; }
  // final payload
  const payload = gatherPayload();
  fakeApiSubmit(payload).then(res=>{
    alert('🎉 Tickets listed successfully!'); clearAutosave(); window.location.reload();
  }).catch(err=>{ console.error(err); alert('Submit failed. Try again later.'); });
}

function handleSubmitWithLoading(e) {
  e.preventDefault();
  const btn = el('submitBtn');
  const hide = showLoading(btn);
  setTimeout(()=>{ try { handleSubmit(e); } finally { hide(); } }, 700);
}

function gatherPayload() {
  const payload = { ...formData, submittedAt: new Date().toISOString() };
  payload.ticketFileName = el('ticketUpload')?.files?.[0]?.name || null;
  payload.paymentProofName = el('paymentProofUpload')?.files?.[0]?.name || null;
  payload.rawTotal = safeInt(formData.sellingPrice || 0) * safeInt(formData.quantity || 1);
  payload.cappedTotal = Math.min(payload.rawTotal, MAX_TOTAL);
  return payload;
}

function fakeApiSubmit(payload) {
  return new Promise((resolve, reject) => {
    console.log('Submitting payload (fake):', payload);
    setTimeout(()=>resolve({ success:true, id:'FAKE123' }), 800);
  });
}

// ---------------- HELPERS ----------------
function showLoading(btn) {
  if (!btn) return ()=>{};
  const orig = btn.innerHTML;
  btn.innerHTML = '<div class="loading-spinner"></div> Processing...';
  btn.disabled = true;
  return function hide() { btn.innerHTML = orig; btn.disabled = false; };
}

function scheduleAutosave() {
  if (window.__auto_save_timeout) clearTimeout(window.__auto_save_timeout);
  window.__auto_save_timeout = setTimeout(()=>{ try { localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData)); console.log('autosave'); } catch(e){} }, 1000);
}

function applyFormDataToUI() {
  // map keys
  const map = {
    eventName:'eventName', eventCategory:'eventCategory', eventDate:'eventDate', eventTime:'eventTime', venue:'venue',
    ticketSection:'ticketSection', ticketRow:'ticketRow', seatNumbers:'seatNumbers', quantity:'quantity',
    sellingPrice:'sellingPrice', ticketPrice:'ticketPrice', ticketQuantity:'ticketQuantity', ticketType:'ticketType',
    agreeTerms:'agreeTerms', agreeTransfer:'agreeTransfer'
  };
  Object.keys(map).forEach(k=>{
    const id = map[k]; const input = el(id);
    if (!input) return;
    if (input.type === 'checkbox') input.checked = !!formData[k]; else input.value = formData[k] !== undefined ? formData[k] : '';
  });
}

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"]+/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]||c)); }

// ---------------- ANIMATIONS & ACCESSIBILITY ----------------
function addAnimationClasses() {
  const obs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if (en.isIntersecting) en.target.classList.add('animate-in'); }); }, { threshold: 0.15 });
  document.querySelectorAll('.step-card, .faq-item, .form-step').forEach(elm=>obs.observe(elm));
}

// ---------------- SMALL PUBLIC API ----------------
window.ticketAdda = { formData, undo, redo, resetForm:()=>{ if (confirm('Reset form?')) { clearAutosave(); location.reload(); } } };

// End of sell.js (fixed)
