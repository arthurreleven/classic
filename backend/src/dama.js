const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Permite que o React acesse o backend
app.use(express.json()); // Permite ler JSON no body

const PORT = 5000; // Mantendo a mesma porta do Python para não precisar mexer no React

// --- LÓGICA DO JOGO (Convertida de Python para JS) ---

function indexFromCoord(l, c) {
  if (l < 0 || l > 7 || c < 0 || c > 7) return null;
  if ((l + c) % 2 === 0) return null;
  return l * 4 + Math.floor(c / 2);
}

function getRandomItem(arr) {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function escolherJogada(board, nivel) {
  const movimentos = []; // Movimentos simples
  const capturas = [];   // Movimentos de captura

  // Itera por todas as casas do tabuleiro (0 a 31)
  for (let i = 0; i < board.length; i++) {
    const peca = board[i];

    // Se não for peça da IA (Preta=2 ou Dama Preta=4), ignora
    if (peca !== 2 && peca !== 4) continue;

    const linha = Math.floor(i / 4);
    // Cálculo chato da coluna em array de 32 posições:
    const coluna = (i % 4) * 2 + (linha % 2 === 0 ? 1 : 0);
    const ehDama = (peca === 4);

    let direcoes = [];
    if (ehDama) {
      direcoes = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    } else {
      // Peça comum preta só desce (linha aumenta)
      direcoes = [[1, -1], [1, 1]];
    }

    for (const [dl, dc] of direcoes) {
      let l = linha + dl;
      let c = coluna + dc;

      // Loop (útil para Dama andar várias casas)
      while (l >= 0 && l < 8 && c >= 0 && c < 8) {
        const idx = indexFromCoord(l, c);
        
        if (idx === null) break; // Casa inválida

        const conteudoCasa = board[idx];

        // 1. Casa Vazia
        if (conteudoCasa === 0) {
          movimentos.push({
            from: [linha, coluna],
            to: [l, c]
          });
          // Se não for dama, para aqui (só anda 1 casa)
          if (!ehDama) break;
        }
        // 2. Encontrou Inimigo (Vermelha=1 ou Dama Vermelha=3)
        else if (conteudoCasa === 1 || conteudoCasa === 3) {
          const lDest = l + dl;
          const cDest = c + dc;
          const idxDest = indexFromCoord(lDest, cDest);

          if (idxDest !== null && board[idxDest] === 0) {
            capturas.push({
              from: [linha, coluna],
              to: [lDest, cDest]
            });
          }
          // Encontrou peça, não pode pular por cima sem capturar imediatamente (lógica simplificada)
          break;
        }
        // 3. Encontrou Amigo
        else {
          break;
        }

        // Avança (apenas Dama continua no while)
        l += dl;
        c += dc;
      }
    }
  }

  // --- INTELIGÊNCIA ARTIFICIAL ---

  // Se não há nada a fazer
  if (movimentos.length === 0 && capturas.length === 0) {
    return { from: [0, 0], to: [0, 0] };
  }

  // Lógica de dificuldade
  if (nivel === "facil") {
    // Prioriza movimento simples, mas captura se for a única opção
    if (movimentos.length > 0) return getRandomItem(movimentos);
    return getRandomItem(capturas);
  } 
  else if (nivel === "medio") {
    // 50% de chance de priorizar captura
    const temCaptura = capturas.length > 0;
    if (temCaptura && Math.random() < 0.5) {
      return getRandomItem(capturas);
    }
    if (movimentos.length > 0) return getRandomItem(movimentos);
    return getRandomItem(capturas);
  } 
  else {
    // Dificil (ou default): Captura Obrigatória
    if (capturas.length > 0) return getRandomItem(capturas);
    return getRandomItem(movimentos);
  }
}

// --- ROTA ---

app.post("/jogar", (req, res) => {
  try {
    const { board, nivel } = req.body;
    
    if (!board) {
      return res.status(400).json({ error: "Board is required" });
    }

    const jogada = escolherJogada(board, nivel || "facil");
    
    // Pequeno delay artificial para parecer que a IA está "pensando" (opcional)
    // setTimeout(() => res.json(jogada), 500); 
    
    res.json(jogada);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Node rodando na porta ${PORT}`);
});