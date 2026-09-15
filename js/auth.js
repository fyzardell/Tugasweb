/* ========================================
   Kopken Holic - Auth Script (tanpa database)
   ======================================== */

const USERS = [
  { username: 'Firdy',  password: 'firdy123',  display: 'Firdy' },
  { username: 'Faeyza', password: 'faeyza123', display: 'Faeyza' },
  { username: 'Dian',   password: 'dian123',   display: 'Dian' }
];

document.addEventListener('DOMContentLoaded', () => {
  // ----- LOGIN -----
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const errBox = document.getElementById('loginError');
    const successBox = document.getElementById('loginSuccess');
    const btn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

      // reset state
      if (errBox) errBox.classList.remove('show');
      if (successBox) successBox.classList.remove('show');
      document.querySelectorAll('.auth-field input').forEach(i => i.classList.remove('input-error'));

      if (!username || !password) {
        showError(errBox, 'Username dan password wajib diisi.');
        if (!username) document.getElementById('loginUsername').classList.add('input-error');
        if (!password) document.getElementById('loginPassword').classList.add('input-error');
        return;
      }

      const found = USERS.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

      if (!found) {
        // check if username exists but password wrong
        const userExists = USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (userExists) {
          showError(errBox, 'Password salah. Coba lagi ya!');
          document.getElementById('loginPassword').classList.add('input-error');
        } else {
          showError(errBox, `Username "${username}" tidak terdaftar. Akun yang tersedia hanya: Firdy, Faeyza, Dian.`);
          document.getElementById('loginUsername').classList.add('input-error');
        }
        shakeCard();
        return;
      }

      // success
      if (btn) {
        btn.innerHTML = '<span>Berhasil ✓</span>';
        btn.disabled = true;
      }
      if (successBox) {
        successBox.textContent = `Halo ${found.display}! Login berhasil, mengarahkan ke beranda...`;
        successBox.classList.add('show');
      }

      // simpan session sederhana (tanpa DB)
      try {
        sessionStorage.setItem('kopken_user', JSON.stringify(found));
        localStorage.setItem('kopken_user', JSON.stringify(found));
      } catch (_) {}

      // modal sukses login
      const modal = document.getElementById('loginSuccessModal');
      if (modal) {
        const nameEl = document.getElementById('successUserName');
        if (nameEl) nameEl.textContent = found.display;
        openModal(modal);
        // auto redirect after 2.5s
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 2200);
      } else {
        setTimeout(() => window.location.href = '../index.html', 1200);
      }
    });
  }

  // ----- REGISTER -----
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value.trim();
      const username = document.getElementById('regUsername')?.value.trim();
      const password = document.getElementById('regPassword')?.value;
      const confirm = document.getElementById('regConfirm')?.value;

      // basic validation just to make it feel real, then popup
      if (password && confirm && password !== confirm) {
        const m = document.getElementById('regNoDbModal');
        // still show no-db modal, but add hint
        const desc = m?.querySelector('.modal-desc');
        if (desc) desc.innerHTML = 'Password dan konfirmasi tidak cocok. Tapi jangan khawatir — <strong>website ini memang tidak menyimpan data apapun</strong>, jadi registrasi hanya simulasi untuk tugas saja.';
        openModal(m);
        return;
      }

      const modal = document.getElementById('regNoDbModal');
      openModal(modal);
    });
  }

  // ----- MODAL HANDLERS -----
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(target);
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m));
    }
  });

  // helper open from button with data-open
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(document.getElementById(btn.dataset.openModal)));
  });

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function shakeCard() {
    const card = document.querySelector('.auth-card');
    if (!card) return;
    card.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' }
    ], { duration: 350, easing: 'ease' });
  }
});

function openModal(el) {
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(el) {
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
  // reset login button if closed manually
  if (el.id === 'loginSuccessModal') {
    // if user closes, still redirect?
  }
}
