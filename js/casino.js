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
}
function closeRouletteModal() {
  rouletteModal.style.display = 'none';
  resetRouletteModal();
}
window.addEventListener("click", (event) => {
  if (event.target === rouletteModal) {
    closeRouletteModal();
  }
});

// Controle de seleção de ONG
let selectedOng = null;

// Habilita botão só se ONG e valor válidos
function checkRoletaForm() {
  const betInput = document.getElementById('bet-input');
  const spinBtn = document.getElementById('spinBtn');
  if (selectedOng && betInput.value && parseFloat(betInput.value) >= 1) {
    spinBtn.disabled = false;
    document.getElementById('bet-message').textContent = '';
  } else {
    spinBtn.disabled = true;
    if (!selectedOng) {
      document.getElementById('bet-message').textContent = 'Escolha uma ONG antes de apostar!';
    } else if (!betInput.value || parseFloat(betInput.value) < 1) {
      document.getElementById('bet-message').textContent = 'Digite um valor válido!';
    }
  }
}

document.getElementById('bet-input').addEventListener('input', checkRoletaForm);

function selectOng(num) {
  selectedOng = num;
  for (let i = 1; i <= 4; i++) {
    document.getElementById('ong-' + i).classList.remove('btn-primary');
    document.getElementById('ong-' + i).classList.add('btn-outline');
  }
  document.getElementById('ong-' + num).classList.remove('btn-outline');
  document.getElementById('ong-' + num).classList.add('btn-primary');
  checkRoletaForm();
}

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
  setTimeout(() => {
    const win = Math.random() < 0.5;
    result.textContent = win ? 'Parabéns! Você ganhou!' : 'Não foi dessa vez. Tente novamente!';
    betMessage.textContent = '';
    document.getElementById('spinBtn').disabled = false;
  }, 1500);
}

// Reset modal roleta
function resetRouletteModal() {
  selectedOng = null;
  for (let i = 1; i <= 4; i++) {
    document.getElementById('ong-' + i).style.border = '2px solid transparent';
  }
  document.getElementById('bet-input').value = '';
  document.getElementById('bet-message').textContent = '';
  document.getElementById('result').textContent = '';
  document.getElementById('spinBtn').disabled = true;
}
