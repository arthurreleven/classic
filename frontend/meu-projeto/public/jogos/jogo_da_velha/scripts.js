const cellElements = document.querySelectorAll("[data-cell]");
const board = document.querySelector("[data-board]");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");
const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const botoesNiveis = document.querySelectorAll(".niveis button");
const winningMessage = document.querySelector("[data-winning-message]");
const restartButton = document.querySelector("[data-restart-button]");
const pontuacaoContainer = document.getElementById("pontuacao-container");
pontuacaoContainer.style.display = "none";

let pontosVoce = 0;
let pontosIa = 0;
const pontosVoceElem = document.getElementById("pontos-voce");
const pontosIaElem = document.getElementById("pontos-ia");

let isCircleTurn;
let nivelSelecionado = "dificil"; // 👈 nível padrão

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Atualiza o placar
function atualizarPlacar(vencedor) {
  if (vencedor === "voce") {
    pontosVoce++;
    pontosVoceElem.textContent = pontosVoce;
  } else if (vencedor === "ia") {
    pontosIa++;
    pontosIaElem.textContent = pontosIa;
  }
}

// === Funções principais ===

const iniciarJogoComNivel = (nivel) => {
  telaInicial.style.display = "none";
  telaJogo.style.display = "block";
  pontuacaoContainer.style.display = "flex";
  carregarPontuacaoUsuario();
  
  nivelSelecionado = nivel; // 👈 define o nível global
  startGame();
};

// Configura os botões de nível
botoesNiveis.forEach((botao) => {
  botao.addEventListener("click", () => {
    const nivel = botao.getAttribute("data-nivel");
    iniciarJogoComNivel(nivel);
  });
});

const startGame = () => {
  isCircleTurn = false;
  for (const cell of cellElements) {
    cell.classList.remove("x", "circle");
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  }

  setBoardHoverClass();
  winningMessage.classList.remove("show-winning-message");
};

const endGame = (winner) => {
  if (winner === "empate") {
    winningMessageTextElement.innerText = "Empate!";
    salvarResultado("empate");
  } else if (winner === "X") {
    winningMessageTextElement.innerText = "Você venceu!";
    atualizarPlacar("voce");
    salvarResultado("vitoria");
  } else if (winner === "O") {
    winningMessageTextElement.innerText = "A IA venceu!";
    atualizarPlacar("ia");
    salvarResultado("derrota");
  }

  winningMessage.classList.add("show-winning-message");
};

const checkForWin = (player) =>
  winningCombinations.some((combo) => combo.every((i) => cellElements[i].classList.contains(player)));

const checkForDraw = () =>
  [...cellElements].every((cell) => cell.classList.contains("x") || cell.classList.contains("circle"));

const placeMark = (cell, mark) => cell.classList.add(mark);

const setBoardHoverClass = () => {
  board.classList.remove("circle", "x");
  board.classList.add(isCircleTurn ? "circle" : "x");
};

const getBoardState = () =>
  [...cellElements].map((cell) => {
    if (cell.classList.contains("x")) return "X";
    if (cell.classList.contains("circle")) return "O";
    return "";
  });

// === Função da IA ===
const iaPlay = async () => {
  const state = getBoardState();

  try {
    const response = await fetch("http://127.0.0.1:5000/jogada_ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tabuleiro: state,
        nivel: nivelSelecionado, // envia o nível atual para o backend
      }),
    });

    const data = await response.json();
    const iaIndex = data.posicao;

    if (iaIndex !== null) {
      // 💭 tempo de pensamento de acordo com o nível
      const delay =
        nivelSelecionado === "facil"
          ? 2000 // 2 segundos
          : nivelSelecionado === "medio"
          ? 1200 // 1,2 segundos
          : 300; // rápido no difícil

      setTimeout(() => {
        const iaCell = cellElements[iaIndex];
        if (
          !iaCell.classList.contains("x") &&
          !iaCell.classList.contains("circle")
        ) {
          placeMark(iaCell, "circle");

          const isWin = checkForWin("circle");
          const isDraw = checkForDraw();

          if (isWin) {
            endGame("O");
            return;
          }

          if (isDraw) {
            endGame("empate");
            return;
          }
        }
      }, delay);
    }
  } catch (error) {
    console.error("Erro ao conectar com a IA:", error);
  }
};


// === Função de clique do jogador ===
const handleClick = (e) => {
  const cell = e.target;

  if (cell.classList.contains("x") || cell.classList.contains("circle")) {
    return; // impede clicar em casa ocupada
  }

  placeMark(cell, "x");

  const isWin = checkForWin("x");
  const isDraw = checkForDraw();

  if (isWin) {
    endGame("X");
  } else if (isDraw) {
    endGame("empate");
  } else {
    iaPlay(); // chama IA após jogada válida
  }
};

async function salvarResultado(resultado) {
    try {
        const res = await fetch(`/api/resultado/${resultado}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Pontuação atualizada:", data);
        } else if (res.status === 401) {
          console.warn("Usuario não logado. Pontuação não salva")
        } else {
            console.error("Erro ao atualizar pontuação:", data.error);
        }
    } catch (err) {
        console.error("Erro na requisição:", err);
    }
}

const carregarPontuacaoUsuario = async () => {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();

    if (res.ok) {
      console.log("Estatísticas do usuário:", data);
      pontosVoceElem.textContent = data.vitorias || 0;
      pontosIaElem.textContent = data.derrotas || 0;
    }
  } catch (error) {
    console.error("Erro ao carregar pontuação:", error);
  }
};


// === Botão de reiniciar ===
restartButton.addEventListener("click", startGame);

// Botão para sair do jogo (voltar para tela inicial local)
document.getElementById("btn-sair").addEventListener("click", function () {
    window.location.href = "index.html"; 
});

// Botão para voltar ao localhost:5173
document.getElementById("btn-voltar").addEventListener("click", function () {
    window.location.href = "http://localhost:5173";
});
