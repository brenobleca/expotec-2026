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

// Botão "Jogar" da Roleta
document.getElementById('game-play-roulette').addEventListener('click', function () {
  if (!localStorage.getItem('token')) {
    document.getElementById('loginModal').style.display = 'flex';
    return;
  }
  openRouletteModal();
});

// Modal da Roleta
const rouletteModal = document.getElementById('rouletteModal');
function openRouletteModal() {
  rouletteModal.style.display = 'flex';
  resetRouletteModal();
}
function closeRouletteModal() {
  rouletteModal.style.display = 'none';
  resetRouletteModal();
  const closeBtn = document.getElementById('close-game-btn');
  if (closeBtn) closeBtn.remove();
}
window.addEventListener("click", (event) => {
  if (event.target === rouletteModal) closeRouletteModal();
  if (event.target === loginModal) CloseLoginModal();
  if (event.target === SignUpModal) CloseRegisterModal();
});

// Controle de seleção de ONG
let selectedOng = null;
let selectedBetType = null;

// Botão "Escolher ONG" abre o segundo modal
document.getElementById('chooseOngBtn').onclick = function() {
  document.getElementById('ongModal').style.display = 'flex';
};

// Fecha modal de seleção de ONG
function closeOngModal() {
  document.getElementById('ongModal').style.display = 'none';
}

// Seleciona ONG no modal de ONGs e atualiza card no modal do jogo
function selectOngFromOngModal(num) {
  document.querySelectorAll('#ongModal .ong-card').forEach(card => card.classList.remove('selected'));
  document.querySelector('#ongModal .ong-card[data-ong="' + num + '"]').classList.add('selected');

  // Pega dados da ONG selecionada
  const card = document.querySelector('#ongModal .ong-card[data-ong="' + num + '"]');
  const tag = card.querySelector('.ong-tag').textContent;
  const name = card.querySelector('h3').textContent;
  const desc = card.querySelector('p').textContent;

  // Atualiza card no modal do jogo
  document.getElementById('selectedOngTag').textContent = tag;
  document.getElementById('selectedOngName').textContent = name;
  document.getElementById('selectedOngDesc').textContent = desc;
  document.getElementById('selectedOngCard').style.display = 'block';

  selectedOng = num;
  document.getElementById('bet-input').disabled = false;
  enableBetTypeButtons(true);
  checkRoletaForm();

  closeOngModal();
}

// Habilita/desabilita botões de cor de aposta
function enableBetTypeButtons(enable) {
  document.querySelectorAll('.bet-type-btn').forEach(btn => {
    btn.disabled = !enable;
    if (!enable) btn.classList.remove('selected');
  });
  selectedBetType = null;
}

// Seleção de cor de aposta
document.querySelectorAll('.bet-type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (btn.disabled) return;
    document.querySelectorAll('.bet-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedBetType = btn.getAttribute('data-type');
    checkRoletaForm();
  });
});

// Validação para liberar botão de jogar
function checkRoletaForm() {
  const betInput = document.getElementById('bet-input');
  const spinBtn = document.getElementById('spinBtn');
  if (selectedOng && selectedBetType && betInput.value && parseFloat(betInput.value) >= 1) {
    spinBtn.disabled = false;
    document.getElementById('bet-message').textContent = '';
  } else {
    spinBtn.disabled = true;
    document.getElementById('bet-message').textContent = '';
  }
}

document.getElementById('bet-input').addEventListener('input', checkRoletaForm);

let userBalance = 1000; // Saldo inicial do usuário (exemplo)
const balanceInfo = document.getElementById('balance-info');
function updateBalanceInfo() {
  balanceInfo.textContent = `Seu saldo: R$ ${userBalance.toFixed(2)}`;
}
window.addEventListener('DOMContentLoaded', updateBalanceInfo);

// Referência ao botão (garante que existe antes de usar)
const spinBtn = document.getElementById('spinBtn');


let rouletteAngle = 0;

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}


function spinRoulette() {
  const betInput   = document.getElementById('bet-input');
  const betMessage = document.getElementById('bet-message');
  const resultEl   = document.getElementById('result');
  const spinBtn    = document.getElementById('spinBtn');

  if (!selectedOng)       { betMessage.textContent = 'Escolha uma ONG antes de jogar!'; return; }
  if (!selectedBetType)   { betMessage.textContent = 'Selecione o tipo de aposta!';   return; }

  const aposta = parseFloat(betInput.value);
  if (isNaN(aposta) || aposta < 1)  { betMessage.textContent = 'Valor inválido.';     return; }
  if (aposta > userBalance)         { betMessage.textContent = 'Saldo insuficiente.'; return; }

  betMessage.textContent = '';
  resultEl.textContent = 'Girando...';
  spinBtn.disabled = true;

  // Escolhe aleatoriamente um ângulo final e a rotação total (6 a 8 voltas)
  const targetAngle = Math.random() * Math.PI * 2;   // 0..2π
  const baseTurns   = 6 + Math.random() * 2;         // 6–8 voltas
  const totalRotation = baseTurns * Math.PI * 2 + ((targetAngle - (rouletteAngle % (Math.PI*2)) + Math.PI*2) % (Math.PI*2));

  const duration = 3400; // ms (ajuste fino se quiser mais/menos suave)
  let start = null;

  function frame(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const t = Math.min(elapsed / duration, 1); // 0..1
    const eased = easeOutQuint(t);

    // Ângulo atual com easing (sem “snap” no final)
    const angle = rouletteAngle + totalRotation * eased;
    drawRouletteWheel(angle);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      // Congela no ângulo final exato
      rouletteAngle = (rouletteAngle + totalRotation) % (Math.PI * 2);
      drawRouletteWheel(rouletteAngle);

      // Descobre setor sorteado com base no ângulo final (mapeamento 0..2π)
      const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
      const colors  = ['green','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black'];

      // Normaliza para 0..2π
      const finalAngle = (rouletteAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      let sector = Math.floor((finalAngle / (Math.PI * 2)) * numbers.length);
      if (sector < 0) sector += numbers.length;

      const sorteado = numbers[sector];
      const cor = colors[sector];

      // Paga/retira aposta
      userBalance -= aposta;
      const payout = (cor === 'green') ? 36 : 2;
      const ganhou = (selectedBetType === cor);
      let premio = 0;
      if (ganhou) {
        premio = aposta * payout;
        userBalance += premio;
      }
      updateBalanceInfo();

      resultEl.textContent = ganhou
        ? `Número: ${sorteado} (${cor}) • Ganhou R$ ${premio.toFixed(2)}`
        : `Número: ${sorteado} (${cor}) • Perdeu R$ ${aposta.toFixed(2)}`;

      // Bloqueia inputs até reset
      betInput.disabled = true;
      enableBetTypeButtons(false);

      // Reinicia automaticamente após 6s
      setTimeout(() => {
        resetRouletteModal();
        // mantém o ângulo atual como ponto de partida para próxima animação
      }, 6000);
    }
  }

  requestAnimationFrame(frame);
}



// Reset modal roleta
function resetRouletteModal() {
  selectedOng = null;
  selectedBetType = null;
  document.getElementById('bet-input').value = '';
  document.getElementById('bet-input').disabled = true;
  enableBetTypeButtons(false);
  document.getElementById('bet-message').textContent = '';
  document.getElementById('result').textContent = '';
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('selectedOngCard').style.display = 'none';
  document.getElementById('selectedOngTag').textContent = '';
  document.getElementById('selectedOngName').textContent = '';
  document.getElementById('selectedOngDesc').textContent = '';
  const closeBtn = document.getElementById('close-game-btn');
  if (closeBtn) closeBtn.remove();
  drawRouletteWheel();
  updateBalanceInfo();
}

// Funções para login/registro
function CloseLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.reset();
    const mensagem = document.getElementById('mensagem-login');
    if (mensagem) mensagem.textContent = '';
  }
}
function CloseRegisterModal() {
  document.getElementById('SignUpModal').style.display = 'none';
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    formRegistro.reset();
    const mensagem = document.getElementById('mensagem-registro');
    if (mensagem) mensagem.textContent = '';
  }
}
function OpenRegisterFromLogin() {
  CloseLoginModal();
  document.getElementById('SignUpModal').style.display = 'flex';
}

// Botão de valor da aposta
document.getElementById('bet-minus').onclick = function() {
  const input = document.getElementById('bet-input');
  let val = parseInt(input.value, 10) || 0;
  if (val > 10) input.value = val - 10;
  else input.value = 1;
  checkRoletaForm();
};
document.getElementById('bet-plus').onclick = function() {
  const input = document.getElementById('bet-input');
  let val = parseInt(input.value, 10) || 0;
  input.value = val + 10;
  checkRoletaForm();
};

window.addEventListener('DOMContentLoaded', () => drawRouletteWheel());

function drawRouletteWheel(angle = 0) {
  const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const colors = ['green','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black','red','black'];
  const canvas = document.getElementById('rouletteWheel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(cx, cy) - 10;
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

  // Pino indicador
  ctx.restore();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff7f50";
  ctx.fill();
  ctx.restore();

  // Indicador de topo
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0);
  ctx.beginPath();
  ctx.moveTo(0, -radius - 5);
  ctx.lineTo(-10, -radius - 25);
  ctx.lineTo(10, -radius - 25);
  ctx.closePath();
  ctx.fillStyle = "#ffd700";
  ctx.fill();
  ctx.restore();
}

/*const logoutBtn = document.getElementById('logout');
  if (localStorage.getItem('token')) {
    logoutBtn.style.display = 'inline-block';
  } else {
    logoutBtn.style.display = 'none';
  }

  document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('token');
  this.style.display = 'none';
  location.reload();
});*/
