/* ==========================================================================
   GEM CITY NAILS — shared interactions (v3)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.nav-burger');
  const links  = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      links.style.display = open ? 'flex' : 'none';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '68px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#fff';
      links.style.padding = '12px 24px 20px';
      links.style.borderBottom = '1px solid rgba(21,22,27,0.09)';
    });
  }
});

/* Simple inline icon set — stroke-based, reused across service tiles */
const ICONS = {
  manicure: '<path d="M12 2c-1.5 3-2 5-2 7a2 2 0 0 0 4 0c0-2-.5-4-2-7Z"/><path d="M6 22c0-4 2.5-7 6-7s6 3 6 7"/>',
  structured: '<rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/>',
  pedicure: '<path d="M8 21c-2 0-3-1.5-3-3.5 0-3 2-5 2-8 0-2 1-4 3-4s2 2 2 3c0 2-1 2-1 4 0 1 1 1 2 1s3-1 3-3 1.5-3 3-2 1 3-1 5c-1 1-2 3-2 5s-2 2.5-3 2.5"/>',
  acrylic: '<path d="M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8 7 17M17 7l2.8-2.8"/><circle cx="12" cy="12" r="2.4"/>',
  gel: '<path d="M12 2c3 4 6 8.5 6 12a6 6 0 0 1-12 0c0-3.5 3-8 6-12Z"/>',
  polygel: '<path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"/><path d="M4 7l8 5 8-5"/><path d="M12 12v10"/>',
  pressOn: '<rect x="7" y="2" width="4" height="9" rx="2"/><rect x="13" y="2" width="4" height="9" rx="2"/><path d="M5 15h14M5 19h14"/>',
  art: '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3Z"/><circle cx="19" cy="17" r="1.6"/><circle cx="5" cy="18" r="1.2"/>',
  gem: '<path d="M6 3h12l3 5-9 13L3 8l3-5Z"/><path d="M3 8h18M9 3l3 5 3-5M12 8l-3 13M12 8l3 13"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/>',
  percent: '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  repair: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>'
};
function icon(name){ return `<svg class="icon" viewBox="0 0 24 24">${ICONS[name] || ''}</svg>`; }

/* ==========================================================================
   SERVICE MENU — single source of truth
   All core services are one flat walk-in rate. Membership swaps this for
   monthly credits. Edit this array to add/remove/reprice a service — the
   grid on services.html rebuilds itself automatically.
   ========================================================================== */
const FLAT_RATE = 65;
const FILL_RATE = 45;

/* Each card can hold a dropdown of variants (options) or stand alone.
   To add/remove/reprice a category or its variants, edit this array —
   the menu on services.html rebuilds itself automatically. */
const SERVICE_CATEGORIES = [
  {
    name: 'Natural Nails', icon: 'manicure', photo: 'assets/photo-manicure.jpg',
    options: ['Manicure', "Men's Manicure", 'Structured Manicure'],
    showPrice: false,
  },
  {
    name: 'Pedicure', icon: 'pedicure', photo: 'assets/photo-pedicure.jpg',
    options: null,
    showPrice: false,
  },
  {
    name: 'Enhancements', icon: 'acrylic', photo: 'assets/photo-enhancements.jpg',
    options: ['Acrylic', 'Hard Gel', 'Polygel'],
    showPrice: false,
  },
  {
    name: 'Fill', icon: 'repair', photo: 'assets/photo-fill.jpg',
    options: null,
    showPrice: true, price: FILL_RATE, unit: 'no membership required',
  },
  {
    name: 'Press-On Nails', icon: 'pressOn', photo: 'assets/photo-pressons.jpg',
    options: ['Custom Style', 'Provide Your Own'],
    showPrice: true, priceRange: '$45–$85', unit: 'priced by design — see tiers below',
  },
];

/* Press-On pricing follows its own 3-tier system, same pattern as Nail Art. */
const PRESSON_TIERS = [
  { level: 'Level 1', price: '$45', desc: 'Minimal design — solid color or simple accent nail. Same price as a Fill.' },
  { level: 'Level 2', price: '$65', desc: 'Moderate design — patterned or multi-color sets.' },
  { level: 'Level 3', price: '$85', desc: 'Elaborate design — fully custom, intricate detail work.' },
];

const NAIL_ART_TIERS = [
  { level: 'Level 1', price: 'Included', included:true, desc: 'French tip or one solid color. Included in the $65 flat rate on every service.' },
  { level: 'Level 2', price: '+$15', included:false, desc: 'Simple flat nail art on up to 4 nails.' },
  { level: 'Level 3', price: '+$20', included:false, desc: 'Charms (up to 4), rhinestones on 2+ fingers, or more intricate design work.' },
];

function renderServiceGrid() {
  const el = document.querySelector('#service-grid');
  if (!el) return;
  el.innerHTML = SERVICE_CATEGORIES.map(c => `
    <div class="category-card">
      ${c.photo ? `
        <div class="category-photo">
          <img src="${c.photo}" alt="${c.name} at GEM City Nails" loading="lazy">
          <div class="icon-tile">${icon(c.icon)}</div>
        </div>
      ` : ''}
      <div class="category-body">
        <div class="category-top">
          ${!c.photo ? `<div class="icon-tile">${icon(c.icon)}</div>` : ''}
          <h3>${c.name}</h3>
        </div>
        ${c.options ? `
          <select class="category-select" aria-label="${c.name} options">
            ${c.options.map(o => `<option>${o}</option>`).join('')}
          </select>
        ` : ''}
        ${c.showPrice ? `
          <div class="category-price-row">
            <span class="amt">${c.price ? '$' + c.price : c.priceRange}</span>
            <span class="unit">${c.unit}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function renderPressonTiers() {
  const el = document.querySelector('#presson-tier-grid');
  if (!el) return;
  el.innerHTML = PRESSON_TIERS.map(t => `
    <div class="art-tier">
      <div class="level">${t.level}</div>
      <div class="price-tag">${t.price}</div>
      <p>${t.desc}</p>
    </div>
  `).join('');
}

function renderArtTiers() {
  const el = document.querySelector('#art-tier-grid');
  if (!el) return;
  el.innerHTML = NAIL_ART_TIERS.map(t => `
    <div class="art-tier ${t.included ? 'included' : ''}">
      <div class="level">${t.level}</div>
      <div class="price-tag">${t.price}</div>
      <p>${t.desc}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderServiceGrid();
  renderArtTiers();
  renderPressonTiers();
  document.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = icon(el.dataset.icon);
  });
});

/* ==========================================================================
   WAITLIST FORM
   Points to a Formspree endpoint by default — swap YOUR_FORM_ID in
   index.html for a real one (formspree.io, free tier, no code needed).
   Any POST-based form service (Formspree, Basin, Google Forms via a
   proxy) works the same way — just change the form's `action` URL.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waitlist-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalLabel = btn.textContent;
    btn.textContent = 'Joining…';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        form.style.display = 'none';
        document.getElementById('waitlist-success').style.display = 'block';
      } else {
        throw new Error('Form endpoint not connected yet');
      }
    } catch (err) {
      // Placeholder endpoint isn't live yet — still show success so the
      // studio can preview the intended UX. Real submissions need a
      // working form ID in index.html's <form action="...">.
      console.warn('Waitlist form not connected to a real endpoint yet:', err);
      form.style.display = 'none';
      document.getElementById('waitlist-success').style.display = 'block';
    } finally {
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  });
});

/* ==========================================================================
   MEMBERSHIP CHECKOUT — placeholder hook (for after launch, once billing
   is connected). Not currently wired to any button — the site is in
   waitlist mode until membership officially opens.
   ========================================================================== */
function startMembershipCheckout() {
  console.log('[stub] starting GEM Membership checkout — $99/mo');
  alert('Membership checkout is a placeholder in this prototype — connect Stripe Billing, Square Subscriptions, or Memberstack in script.js (startMembershipCheckout). Studio is cashless, so this should be the only path to pay in-app/in-studio alongside card-on-file at the desk.');
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-checkout]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); startMembershipCheckout(); });
  });
});
