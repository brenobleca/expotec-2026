//* ===== DRAGSCROLL HORIZONTAL ===== */
//* Slider horizontal com arrastar e rolar
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.game-grid');
  if (!slider) {
    console.warn('game-grid não encontrado');
    return;
  }

  // Evita que as imagens sejam arrastáveis
  slider.querySelectorAll('img').forEach(img => {
    img.draggable = false;
    img.addEventListener('dragstart', e => e.preventDefault());
  });

  let isDown = false;
  let startX;
  let scrollLeft;

  const pointerDown = (e) => {
    // Não iniciar drag se clicar em botão ou link
    if (e.target.closest('button, a')) return;

    isDown = true;
    slider.classList.add('active');
    startX = e.clientX;
    scrollLeft = slider.scrollLeft;
    document.body.style.userSelect = 'none';


    if (e.pointerId && slider.setPointerCapture) {
      try { slider.setPointerCapture(e.pointerId); } catch (err) { }
    }
    e.preventDefault();
  };

  const pointerMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const delta = e.clientX - startX;
    const speed = 1.5; // Sensibilidade do scroll
    slider.scrollLeft = scrollLeft - delta * speed;
  };

  const pointerUp = (e) => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('active');
    document.body.style.userSelect = '';


    if (e.pointerId && slider.releasePointerCapture) {
      try { slider.releasePointerCapture(e.pointerId); } catch (err) { }
    }
  };
  slider.addEventListener('wheel', (e) => {

    e.preventDefault();
    slider.scrollLeft += e.deltaY; // permite usar a roda do mouse
  });
  // Pointer events (mouse + touch)
  slider.addEventListener('pointerdown', pointerDown, { passive: false });
  document.addEventListener('pointermove', pointerMove, { passive: false });
  document.addEventListener('pointerup', pointerUp, { passive: false });
  document.addEventListener('pointercancel', pointerUp, { passive: false });

  // Fallback para navegadores sem pointer events
  if (!('onpointerdown' in window)) {
    slider.addEventListener('mousedown', pointerDown, { passive: false });
    document.addEventListener('mousemove', pointerMove, { passive: false });
    document.addEventListener('mouseup', pointerUp, { passive: false });
  }
});

// Controle de tema (dark/light)
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light');
} else {
  body.classList.remove('light');
}
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});


/* Função para abrir o modal de login */
const LoginModal = document.getElementById("loginModal");
function openModal() {
  LoginModal.style.display = "flex";
}


function CloseLoginModal() {
  LoginModal.style.display = "none";
  // Limpa os campos do formulário de login ao fechar o modal
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.reset();
    const mensagem = document.getElementById('mensagem-login');
    if (mensagem) mensagem.textContent = '';
  }
}

window.addEventListener("click", (event) => {
  if (event.target === LoginModal) {
    CloseLoginModal();
  }
});

/* Função para abrir o modal de registro */
const SignUpmodal = document.getElementById("SignUpModal");
function SignUpOpenModal() {
  SignUpmodal.style.display = "flex";
}


function CloseRegisterModal() {
  SignUpmodal.style.display = "none";
  // Limpa o formulário de registro ao fechar o modal
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    formRegistro.reset();
    const mensagem = document.getElementById('mensagem-registro');
    if (mensagem) mensagem.textContent = '';
  }
}

window.addEventListener("click", (event) => {
  if (event.target === SignUpmodal) {
    CloseRegisterModal();
  }
});

// Atualiza navbar (login/cadastro/logout) conforme status do usuário
function updateNavbarAuth() {
  const isLogged = !!localStorage.getItem('token');
  const loginBtn = document.getElementById('Loginbtn');
  const registerBtn = document.getElementById('Registerbtn');
  const logoutBtn = document.getElementById('logout');

  if (loginBtn) loginBtn.style.display = isLogged ? 'none' : 'inline-block';
  if (registerBtn) registerBtn.style.display = isLogged ? 'none' : 'inline-flex';
  if (logoutBtn) logoutBtn.classList[isLogged ? 'remove' : 'add']('invisible');
}

// Botão de logout
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('token');
    updateNavbarAuth();
    CloseLoginModal();
    CloseRegisterModal();
    window.location.reload();
  });
}

// Atualiza navbar ao carregar
window.addEventListener('DOMContentLoaded', updateNavbarAuth);

// ===== LOGIN =====
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async function (e) {
    e.preventDefault();
    const usuario = document.getElementById('username-login').value;
    const senha = document.getElementById('password-login').value;
    try {
      const resposta = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });
      const resultado = await resposta.json();
      const mensagem = document.getElementById('mensagem-login');
      mensagem.textContent = resultado.mensagem;
      if (resultado.auth && resultado.token) {
        localStorage.setItem('token', resultado.token);
        updateNavbarAuth();
        CloseLoginModal();
        // Se estiver no casino.html, abre modal da roleta se necessário
        if (window.location.pathname.includes('casino.html')) {
          if (typeof openRouletteModal === 'function') openRouletteModal();
        }
      }
    } catch (erro) {
      document.getElementById('mensagem-login').textContent = 'Erro ao conectar com o servidor.';
    }
  });
}

// ===== REGISTRO =====
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
      nome: document.getElementById('name').value,
      cpf: document.getElementById('cpf').value,
      data_nasc: document.getElementById('birth-date').value,
      usuario: document.getElementById('username-register').value,
      senha: document.getElementById('password-register').value
    };
    try {
      const resposta = await fetch('http://localhost:4000/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const resultado = await resposta.json();
      const mensagem = document.getElementById('mensagem-registro');
      mensagem.textContent = resultado.mensagem;
      if (resultado.sucesso) {
        setTimeout(() => {
          CloseRegisterModal();
          LoginModal.style.display = "flex";
        }, 1200);
      }
    } catch (erro) {
      document.getElementById('mensagem-registro').textContent = 'Erro ao conectar com o servidor.';
    }
  });
}

//* ===== ONGS =====
document.addEventListener('DOMContentLoaded', () => {
  // === UTILITÁRIOS ===
  function parseBRNumber(str) {
    if (!str) return 0;
    const cleaned = str.replace(/[^\d,\.]/g, '').trim();
    if (!cleaned) return 0;
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
  }

  function getCategoryColor(category) {
    const rootStyles = getComputedStyle(document.documentElement);
    const map = {
      'educacao': 'cat-educacao',
      'saude': 'cat-saude',
      'meio-ambiente': 'cat-meioambiente',
      'combate-a-fome': 'cat-fome',
      'direitos-humanos': 'cat-direitos',
      'causa-animal': 'cat-animais',
      'assistencia-social': 'cat-social',
      'default': 'cat-default',
      'total-raised': 'cat-total-raised'
    };
    const varName = map[category] || 'cat-default';
    return rootStyles.getPropertyValue(`--${varName}`)?.trim() || '#ccc';
  }

  // === PROGRESSO DAS ONGs ===
  document.querySelectorAll('.ngos-card').forEach(card => {
    const tag = card.querySelector('.ngos-ong-tag');
    if (!tag) return;
    let cat = tag.getAttribute('data-category') || tag.textContent.trim().toLowerCase();
    cat = cat.replace(/\s+/g, '-');
    card.setAttribute('data-category', cat);

    const infoP = Array.from(card.querySelectorAll('p')).find(p => /arrecad/i.test(p.textContent));
    if (!infoP) return;

    const nums = Array.from(infoP.textContent.matchAll(/[\d\.\,]+/g)).map(m => m[0]);
    let raised = 0, target = 0;
    if (nums.length >= 2) {
      raised = parseBRNumber(nums[0]);
      target = parseBRNumber(nums[1]);
    } else {
      raised = parseBRNumber(card.dataset.raised);
      target = parseBRNumber(card.dataset.target);
    }

    const percent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

    let progressInner = card.querySelector('.progress-inner') || card.querySelector('.ngos-progress-inner');
    if (!progressInner) {
      const outer = card.querySelector('.progress-outer') || card.querySelector('.ngos-progress-outer');
      if (outer) {
        progressInner = outer.querySelector('div') || document.createElement('div');
        progressInner.classList.add('progress-inner');
        if (!outer.contains(progressInner)) outer.appendChild(progressInner);
      }
    }

    if (progressInner) {
      progressInner.style.width = percent + '%';
      progressInner.setAttribute('aria-valuenow', String(percent));
      progressInner.setAttribute('title', percent + '%');
      progressInner.style.backgroundColor = getCategoryColor(cat);
    }
  });

  // === PROGRESSO DO TOTAL ARRECADADO (opcional) ===
  function atualizarBarraTotal(idTexto, idBarra, categoria = 'total-raised') {
    const totalText = document.getElementById(idTexto);
    const totalBar = document.getElementById(idBarra);
    if (totalText && totalBar) {
      const nums = Array.from(totalText.textContent.matchAll(/[\d\.\,]+/g)).map(m => m[0]);
      if (nums.length >= 2) {
        const raised = parseBRNumber(nums[0]);
        const target = parseBRNumber(nums[1]);
        const percent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
        totalBar.style.width = percent + '%';
        totalBar.setAttribute('aria-valuenow', String(percent));
        totalBar.setAttribute('title', percent + '%');
        totalBar.style.background = getCategoryColor(categoria);
      }
    }
  }

  // Chamada para a barra de total arrecadado
  atualizarBarraTotal('expotec-progress-text', 'total-progress-bar', 'total-raised');


  // === FILTRO POR CATEGORIA + VER MAIS ===
  const categoryCards = Array.from(document.querySelectorAll('.ngos-categories-grid-card'));
  const ngoCards = Array.from(document.querySelectorAll('.ngos-card'));
  const seeMoreBtn = document.querySelector('.btn-see-more');
  const initialCount = 3;

  let showingAll = false;
  let activeCategory = null;

  function applyFilter() {
    const filtered = ngoCards.filter(card => {
      if (!activeCategory) return true;
      const tag = card.querySelector('.ngos-ong-tag');
      return tag && tag.getAttribute('data-category') === activeCategory;
    });

    ngoCards.forEach(c => c.style.display = 'none');

    if (activeCategory) {
      filtered.forEach(c => c.style.display = '');
      if (seeMoreBtn) seeMoreBtn.style.display = 'none';
      return;
    }

    if (showingAll) {
      filtered.forEach(c => c.style.display = '');
    } else {
      filtered.slice(0, initialCount).forEach(c => c.style.display = '');
    }

    if (seeMoreBtn) {
      if (filtered.length > initialCount) {
        seeMoreBtn.style.display = '';
        seeMoreBtn.textContent = showingAll ? 'Ver Menos' : 'Ver Todas as ONGs';
      } else {
        seeMoreBtn.style.display = 'none';
      }
    }
  }

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const wasActive = card.classList.contains('active');
      categoryCards.forEach(c => c.classList.remove('active'));
      activeCategory = null;
      showingAll = false;

      if (!wasActive) {
        card.classList.add('active');
        activeCategory = card.getAttribute('data-category');
      }

      applyFilter();
    });
  });

  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', () => {
      if (activeCategory) return;
      showingAll = !showingAll;
      applyFilter();
      if (showingAll) {
        document.querySelector('.ngos-ongs-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  applyFilter();
});