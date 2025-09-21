// Lógica do fluxo do botão "Jogar agora" da Roleta
document.getElementById('game-play-roulette').addEventListener('click', function () {
  if (!localStorage.getItem('token')) {
    // Não está logado: abre modal de login
    LoginModal.style.display = "flex";
  } else {
    // Está logado: abre modal da roleta
    openRouletteModal();
  }
});

// Troca para modal de cadastro a partir do login
function OpenRegisterFromLogin() {
  CloseLoginModal();
  SignUpOpenModal();
}

// Modal da Roleta
const rouletteModal = document.getElementById('rouletteModal');
function openRouletteModal() {
  rouletteModal.style.display = 'flex';
  resetRouletteModal();
  // Remove botão de fechar jogo se existir
  const closeBtn = document.getElementById('close-game-btn');
  if (closeBtn) closeBtn.remove();
}
function closeRouletteModal() {
  rouletteModal.style.display = 'none';
  resetRouletteModal();
  // Remove botão de fechar jogo se existir
  const closeBtn = document.getElementById('close-game-btn');
  if (closeBtn) closeBtn.remove();
}
window.addEventListener("click", (event) => {
  if (event.target === rouletteModal) {
    closeRouletteModal();
  }
});

// Controle de seleção de ONG
let selectedOng = null;

function selectOng(num) {
  selectedOng = num;
  // Destaca ONG selecionada
  document.querySelectorAll('.ong-card').forEach(card => card.classList.remove('selected'));
  document.querySelector('.ong-card:nth-child(' + num + ')').classList.add('selected');
  // Habilita input e botão
  document.getElementById('bet-input').disabled = false;
  checkRoletaForm();
}

function checkRoletaForm() {
  const betInput = document.getElementById('bet-input');
  const spinBtn = document.getElementById('spinBtn');
  if (selectedOng && betInput.value && parseFloat(betInput.value) >= 1) {
    spinBtn.disabled = false;
    document.getElementById('bet-message').textContent = '';
  } else {
    spinBtn.disabled = true;
    document.getElementById('bet-message').textContent = '';
  }
}

document.getElementById('bet-input').addEventListener('input', checkRoletaForm);

// Confirmação de aposta
function confirmBet() {
  const betInput = document.getElementById('bet-input');
  const betMessage = document.getElementById('bet-message');
  const value = parseFloat(betInput.value);
  if (!selectedOng) {
    betMessage.textContent = 'Escolha uma ONG antes de apostar!';
    document.getElementById('spinBtn').disabled = true;
    return;
  }
  if (!value || value < 1) {
    betMessage.textContent = 'Digite um valor válido!';
    document.getElementById('spinBtn').disabled = true;
    return;
  }
  betMessage.textContent = 'Aposta confirmada! Clique em "Iniciar Jogo".';
  document.getElementById('spinBtn').disabled = false;
}

// Gira a roleta (simulação)
let rouletteAngle = 0;
let spinning = false;

function drawRouletteWheel(angle = 0) {
  const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const colors = ['green','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black'];
  const canvas = document.getElementById('rouletteWheel');
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 100;
  const angleStep = (2 * Math.PI) / numbers.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  for (let i = 0; i < numbers.length; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Números
    ctx.save();
    ctx.rotate(i * angleStep + angleStep / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Segoe UI';
    ctx.fillText(numbers[i], radius - 25, 5);
    ctx.restore();
  }
  ctx.restore();
}

function spinRoulette() {
  const betInput = document.getElementById('bet-input');
  const betMessage = document.getElementById('bet-message');
  const result = document.getElementById('result');
  if (!selectedOng) {
    betMessage.textContent = 'Escolha uma ONG antes de jogar!';
    return;
  }
  if (!betInput.value || parseFloat(betInput.value) < 1) {
    betMessage.textContent = 'Digite um valor válido!';
    return;
  }
  result.textContent = 'Girando...';
  document.getElementById('spinBtn').disabled = true;
  spinning = true;
  let start = null;
  let duration = 2000; // 2 segundos
  let finalAngle = Math.random() * 2 * Math.PI;
  const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const colors = ['green','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black'];

  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let angle = (progress / duration) * (6 * Math.PI) + finalAngle * (progress / duration);
    drawRouletteWheel(angle);
    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      drawRouletteWheel(finalAngle);

      // Calcula o número sorteado
      let sector = Math.floor(((finalAngle % (2 * Math.PI)) / (2 * Math.PI)) * numbers.length);
      if (sector < 0) sector += numbers.length;
      const sorteado = numbers[sector];
      const cor = colors[sector];
      const aposta = parseFloat(betInput.value);

      // Lógica de prêmio
      let ganhou = false;
      let premio = 0;
      if (cor === 'green') {
        ganhou = true;
        premio = aposta * 36;
      } else if (cor === 'red' || cor === 'black') {
        if (Math.random() < 0.5) {
          ganhou = true;
          premio = aposta * 2;
        }
      }

      if (ganhou) {
        result.textContent = `Número sorteado: ${sorteado} (${cor}) — Você ganhou R$ ${premio.toFixed(2)}!`;
      } else {
        result.textContent = `Número sorteado: ${sorteado} (${cor}) — Não foi dessa vez.`;
      }
      betMessage.textContent = '';

      // Desabilita input, seleção de ONG e botão de iniciar jogo
      betInput.disabled = true;
      document.querySelectorAll('.ong-card').forEach(card => card.onclick = null);
      document.getElementById('spinBtn').disabled = true;

      // Adiciona botão de fechar jogo
      if (!document.getElementById('close-game-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.id = 'close-game-btn';
        closeBtn.className = 'btn-primary';
        closeBtn.textContent = 'Fechar Jogo';
        closeBtn.style.marginTop = '1rem';
        closeBtn.onclick = function() {
          closeRouletteModal();
          // Remove o botão ao fechar
          closeBtn.remove();
        };
        result.parentNode.appendChild(closeBtn);
      }
    }
  }
  requestAnimationFrame(animate);
}

// Reset modal roleta
function resetRouletteModal() {
  selectedOng = null;
  // Remove seleção visual das ONGs
  document.querySelectorAll('.ong-card').forEach(card => card.classList.remove('selected'));
  // Reabilita seleção de ONG
  document.querySelectorAll('.ong-card').forEach(card => {
    card.onclick = function() {
      selectOng(Array.from(document.querySelectorAll('.ong-card')).indexOf(card) + 1);
    };
  });
  // Limpa e reabilita input
  const betInput = document.getElementById('bet-input');
  betInput.value = '';
  betInput.disabled = true;
  // Limpa mensagens e resultado
  document.getElementById('bet-message').textContent = '';
  document.getElementById('result').textContent = '';
  // Reabilita botão de iniciar jogo
  document.getElementById('spinBtn').disabled = true;
  // Remove botão de fechar jogo se existir
  const closeBtn = document.getElementById('close-game-btn');
  if (closeBtn) closeBtn.remove();
}

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        usuario: document.getElementById('username-login').value,
        senha: document.getElementById('password-login').value,
    };

  try {
    const resposta = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    const mensagem = document.getElementById('mensagem-login');
    mensagem.textContent = resultado.mensagem;

    if (resultado.auth && resultado.token) {
      // Salva o token JWT no localStorage
      localStorage.setItem('token', resultado.token);
      document.getElementById('logout').style.display = 'inline-block';
      document.getElementById('config').style.display = 'inline-block';
      const logo = document.getElementById('home');
        if (logo) {
        logo.onclick = null;
        logo.style.cursor = 'default'; //muda o cursor para indicar que não é clicável
}
      // Login realizado com sucesso: fecha o modal de login
      setTimeout(() => {
        CloseLoginModal();
      }
      // Redireciona para a página protegida
      //window.location.href = 'pagina-protegida.html';
      , 1000); // tempo para mostrar mensagem de sucesso
    }
  } catch (erro) {
    console.error('Erro de conexão:', erro);
    document.getElementById('mensagem-login').textContent = 'Erro ao conectar com o servidor.';
  }
});

window.addEventListener('DOMContentLoaded', () => drawRouletteWheel());