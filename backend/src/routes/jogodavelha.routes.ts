import express, { Request, Response } from 'express';

const router = express.Router();

// Tipos
type CellValue = 'X' | 'O' | '';
type Board = CellValue[];

const WIN_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Rota para jogada da IA
router.post('/jogada_ia', (req: Request, res: Response) => {
  const { tabuleiro, nivel } = req.body as { tabuleiro: Board; nivel: string };

  let posicao: number | null = null;

  if (nivel === 'dificil') {
    posicao = melhorJogada(tabuleiro);
  } else if (nivel === 'medio') {
    posicao = Math.random() > 0.5 ? melhorJogada(tabuleiro) : jogadaAleatoria(tabuleiro);
  } else {
    posicao = jogadaAleatoria(tabuleiro);
  }

  res.json({ posicao });
});

// Jogada aleatória
function jogadaAleatoria(tabuleiro: Board): number | null {
  const celulasVazias = tabuleiro
    .map((cell, index) => (cell === '' ? index : null))
    .filter((val): val is number => val !== null);

  if (celulasVazias.length === 0) return null;

  const indiceAleatorio = Math.floor(Math.random() * celulasVazias.length);
  const jogada = celulasVazias[indiceAleatorio];
  
  return jogada !== undefined ? jogada : null;
}

// Melhor jogada (Minimax)
function melhorJogada(tabuleiro: Board): number | null {
  let melhorPontuacao = -Infinity;
  let jogada: number | null = null;

  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '') {
      tabuleiro[i] = 'O';
      const pontuacao = minimax(tabuleiro, 0, false);
      tabuleiro[i] = '';

      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        jogada = i;
      }
    }
  }

  return jogada;
}

// Algoritmo Minimax
function minimax(tabuleiro: Board, profundidade: number, isMaximizing: boolean): number {
  if (verificarVitoria(tabuleiro, 'O')) return 10 - profundidade;
  if (verificarVitoria(tabuleiro, 'X')) return profundidade - 10;
  if (verificarEmpate(tabuleiro)) return 0;

  if (isMaximizing) {
    let melhorPontuacao = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (tabuleiro[i] === '') {
        tabuleiro[i] = 'O';
        const pontuacao = minimax(tabuleiro, profundidade + 1, false);
        tabuleiro[i] = '';
        melhorPontuacao = Math.max(pontuacao, melhorPontuacao);
      }
    }
    return melhorPontuacao;
  } else {
    let melhorPontuacao = Infinity;
    for (let i = 0; i < 9; i++) {
      if (tabuleiro[i] === '') {
        tabuleiro[i] = 'X';
        const pontuacao = minimax(tabuleiro, profundidade + 1, true);
        tabuleiro[i] = '';
        melhorPontuacao = Math.min(pontuacao, melhorPontuacao);
      }
    }
    return melhorPontuacao;
  }
}

// Verificar vitória
function verificarVitoria(tabuleiro: Board, jogador: CellValue): boolean {
  return WIN_COMBINATIONS.some(combinacao =>
    combinacao.every(index => tabuleiro[index] === jogador)
  );
}

// Verificar empate
function verificarEmpate(tabuleiro: Board): boolean {
  return tabuleiro.every(cell => cell !== '');
}

export default router;