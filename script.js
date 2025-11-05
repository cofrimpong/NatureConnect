/* ===== NatureConnect Script ===== */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  renderObjectives();
  renderEvents();
  hookCompleteButton();
  hookPartnerForm();
});

/* ========== Footer Year ========== */
function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ========== Demo Data (from slides) ========== */
const demoObjectives = [
  { id: 1, text: '15-minute walk between classes' },
  { id: 2, text: 'Invite a friend to a park loop' },
  { id: 3, text: 'Log a photo of a tree on campus' }
];

const demoEvents = [
  { when: 'Fri 4:00 PM', what: 'Campus Green Walk (1.5 mi)' },
  { when: 'Sat 9:00 AM',  what: 'Branch Brook Park Run (5K)' },
  { when: 'Sun 2:00 PM',  what: 'NJIT Nature Club Hike' }
];

/* ========== Objectives UI ========== */
function renderObjectives() {
  const wrap = document.getElementById('objectives');
  if (!wrap) return;
  wrap.innerHTML = demoObjectives.map(o => `
    <label class="check" style="display:flex;gap:10px;align-items:flex-start;">
      <input type="checkbox" data-id="${o.id}" />
      <span>${o.text}</span>
    </label>
  `).join('');
}

function hookCompleteButton() {
  const btn = document.getElementById('completeBtn');
  const toast = document.getElementById('toast');
  if (!btn || !toast) return;

  btn.addEventListener('click', () => {
    const checks = Array.from(document.querySelectorAll('#objectives input[type="checkbox"]'));
    const done = checks.filter(c => c.checked).length;
    const total = checks.length;

    // Save quick progress
    safeSet('nc_objectives_completed', String(done));

    toast.textContent = (done === total)
      ? 'Objectives complete! Great job getting outside today.'
      : `You completed ${done}/${total}. Keep going!`;
  });
}

/* ========== Events UI ========== */
function renderEvents() {
  const list = document.getElementById('events');
  if (!list) return;
  list.innerHTML = demoEvents.map(e => `
    <li><strong>${e.when}</strong> — ${e.what}</li>
  `).join('');
}

/* ========== Partner Form (local save) ========== */
function hookPartnerForm() {
  const form = document.getElementById('partnerForm');
  const msg  = document.getElementById('partnerMsg');
  if (!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Basic guard
    if (!data.company || !data.email) {
      msg.textContent = 'Please add your company and a valid email.';
      return;
    }

    const leads = safeGet('nc_partner_leads', []);
    leads.push({ ...data, ts: Date.now() });
    safeSet('nc_partner_leads', leads);

    msg.textContent = "Thanks! We'll reach out within 2 business days.";
    form.reset();
  });
}

/* ========== Storage Helpers ========== */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, v);
  } catch {
    // ignore write errors (private mode, etc.)
  }
}
