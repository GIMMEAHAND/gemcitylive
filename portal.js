/* ==========================================================================
   GEM PRO PORTAL — shift board demo
   In-memory only: claims reset on page reload. A real build needs a backend
   (e.g. Supabase/Firebase or a custom API) that locks a shift the instant
   it's claimed, so two technicians can never grab the same table.
   ========================================================================== */

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* Edit this array to change the week's shift offerings — table numbers,
   time blocks, and which are pre-claimed by someone else (for the demo). */
let SHIFTS = [
  { day:'Mon', time:'8a – 2p', table:'Table 1', status:'open' },
  { day:'Mon', time:'2p – 8p', table:'Table 3', status:'open' },
  { day:'Tue', time:'8a – 2p', table:'Table 2', status:'claimed-other' },
  { day:'Tue', time:'2p – 8p', table:'Table 4', status:'open' },
  { day:'Wed', time:'8a – 2p', table:'Table 1', status:'open' },
  { day:'Wed', time:'2p – 8p', table:'Table 5', status:'claimed-other' },
  { day:'Thu', time:'8a – 2p', table:'Table 3', status:'open' },
  { day:'Thu', time:'2p – 8p', table:'Table 2', status:'open' },
  { day:'Fri', time:'8a – 2p', table:'Table 4', status:'open' },
  { day:'Fri', time:'2p – 8p', table:'Table 1', status:'open' },
  { day:'Sat', time:'8a – 2p', table:'Table 5', status:'claimed-other' },
  { day:'Sat', time:'2p – 8p', table:'Table 2', status:'open' },
  { day:'Sun', time:'10a – 5p', table:'Table 3', status:'open' },
];

function renderShiftBoard() {
  const board = document.getElementById('shift-board');
  if (!board) return;
  board.innerHTML = DAYS.map(day => {
    const dayShifts = SHIFTS.filter(s => s.day === day);
    return `
      <div class="shift-day">
        <div class="shift-day-label">${day}</div>
        ${dayShifts.map(s => renderShift(s)).join('')}
      </div>
    `;
  }).join('');

  board.querySelectorAll('[data-claim]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.claim);
      SHIFTS[idx].status = 'claimed-mine';
      renderShiftBoard();
      renderClaimedSummary();
    });
  });
}

function renderShift(s) {
  const idx = SHIFTS.indexOf(s);
  if (s.status === 'claimed-mine') {
    return `
      <div class="shift-slot claimed-mine">
        <div class="shift-time">${s.time}</div>
        <div class="shift-table">${s.table}</div>
        <button class="shift-claim-btn mine" disabled>Claimed by You</button>
      </div>`;
  }
  if (s.status === 'claimed-other') {
    return `
      <div class="shift-slot claimed-other">
        <div class="shift-time">${s.time}</div>
        <div class="shift-table">${s.table}</div>
        <button class="shift-claim-btn" disabled>Claimed</button>
      </div>`;
  }
  return `
    <div class="shift-slot">
      <div class="shift-time">${s.time}</div>
      <div class="shift-table">${s.table}</div>
      <button class="shift-claim-btn" data-claim="${idx}">Claim Shift</button>
    </div>`;
}

function renderClaimedSummary() {
  const el = document.getElementById('claimed-summary');
  if (!el) return;
  const mine = SHIFTS.filter(s => s.status === 'claimed-mine');
  if (mine.length === 0) {
    el.className = 'claimed-summary empty';
    el.textContent = "You haven't claimed any shifts yet — tap \"Claim\" on an open slot below.";
    return;
  }
  el.className = 'claimed-summary';
  el.innerHTML = `<strong style="display:block; margin-bottom:10px; font-size:13px;">Your claimed shifts this week</strong>` +
    mine.map(s => `<span class="claimed-chip">${s.day} · ${s.time} · ${s.table}</span>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const signinBtn = document.getElementById('staff-signin');
  const signoutBtn = document.getElementById('staff-signout');
  const signoutTop = document.getElementById('staff-signout-top');
  const loginView = document.getElementById('staff-login-view');
  const dashView = document.getElementById('staff-dashboard-view');

  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      loginView.style.display = 'none';
      dashView.style.display = 'block';
      signoutTop.style.display = 'inline-flex';
      renderShiftBoard();
      renderClaimedSummary();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }
  function doSignOut(e) {
    if (e) e.preventDefault();
    dashView.style.display = 'none';
    loginView.style.display = 'block';
    signoutTop.style.display = 'none';
    window.scrollTo({top:0, behavior:'smooth'});
  }
  if (signoutBtn) signoutBtn.addEventListener('click', doSignOut);
  if (signoutTop) signoutTop.addEventListener('click', doSignOut);
});
