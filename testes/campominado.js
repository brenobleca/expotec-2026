const game = document.getElementById('game');
const status = document.getElementById('status');
const gridSize = 25;
const mineCount = 5;
let mines = [];
let score = 0;
let gameOver = false;

// Gera minas aleatórias
while (mines.length < mineCount) {
  const rand = Math.floor(Math.random() * gridSize);
  if (!mines.includes(rand)) mines.push(rand);
}

// Cria células
for (let i = 0; i < gridSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = i;
  cell.addEventListener('click', handleClick);
  game.appendChild(cell);
}

function handleClick(e) {
  if (gameOver) return;

  const index = parseInt(e.target.dataset.index);
  const cell = e.target;

  if (mines.includes(index)) {
    cell.textContent = '💣';
    cell.classList.add('revealed');
    status.textContent = `Você perdeu! Pontuação: ${score}`;
    gameOver = true;
  } else {
    cell.textContent = '💰';
    cell.classList.add('revealed');
    cell.removeEventListener('click', handleClick);
    score++;
    status.textContent = `Pontuação: ${score}`;
    if (score === gridSize - mineCount) {
      status.textContent = `🎉 Você venceu! Pontuação: ${score}`;
      gameOver = true;
    }
  }
}