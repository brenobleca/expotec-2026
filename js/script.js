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

if(localStorage.getItem('theme') === 'light'){
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

/* conexão com o banco de dados e exibição dos usuários */
// Lógica do registro: após sucesso, fecha registro e abre login
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
      nome: document.getElementById('name').value,
      cpf: document.getElementById('cpf').value,
      data_nasc: document.getElementById('birth-date').value,
      usuario: document.getElementById('username-register').value,
      email: document.getElementById('email').value,
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
        // Cadastro realizado com sucesso: fecha registro e abre login
        setTimeout(() => {
          CloseRegisterModal();
          LoginModal.style.display = "flex";
        }, 1200); // tempo para mostrar mensagem de sucesso
      }
    } catch (erro) {
      document.getElementById('mensagem-registro').textContent = 'Erro ao conectar com o servidor.';

    }
  });
}



  const logoutBtn = document.getElementById('logout');
  if (localStorage.getItem('token')) {
    logoutBtn.style.display = 'inline-block';
  } else {
    logoutBtn.style.display = 'none';
  }

async function acessarRotaProtegida() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você não está autenticado!');
    return;
  }
  try {
    const resposta = await fetch('http://localhost:4000/api/protegida', {
      method: 'post',
      headers: {
        'x-access-token': token
      }
    });
    const resultado = await resposta.json();
    alert(JSON.stringify(resultado));
  } catch (erro) {
    alert('Erro ao acessar rota protegida.');
  }
}

//logout
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('token');
  this.style.display = 'none';
  location.reload();
});

// config button
document.getElementById('config').addEventListener('click', function(){
window.location.href = 'settings.html';
} );