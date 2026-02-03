// src/services/DamaService.ts

type BoardArray = number[];
type Coord = [number, number];
type Move = { from: Coord; to: Coord };
type Nivel = "facil" | "medio" | "dificil";

class DamaService {
  private indexFromCoord(l: number, c: number): number | null {
    if (l < 0 || l > 7 || c < 0 || c > 7) return null;
    if ((l + c) % 2 === 0) return null;
    return l * 4 + Math.floor(c / 2);
  }

  private getRandomItem<T>(arr: T[]): T | null {
    if (arr.length === 0) return null;
    const item = arr[Math.floor(Math.random() * arr.length)];
    // Se 'item' for undefined, retorna null
    return item ?? null;
  }

  public escolherJogada(board: BoardArray, nivel: Nivel): Move {
    const movimentos: Move[] = [];
    const capturas: Move[] = [];

    // Itera por todas as casas
    for (let i = 0; i < board.length; i++) {
      const peca = board[i];

      // Se não for peça da IA (Preta=2 ou Dama Preta=4), pula
      if (peca !== 2 && peca !== 4) continue;

      const linha = Math.floor(i / 4);
      const coluna = (i % 4) * 2 + (linha % 2 === 0 ? 1 : 0);
      const ehDama = peca === 4;

      let direcoes: Coord[] = [];
      if (ehDama) {
        direcoes = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      } else {
        // Peça comum preta só desce
        direcoes = [[1, -1], [1, 1]];
      }

      for (const [dl, dc] of direcoes) {
        let l = linha + dl;
        let c = coluna + dc;

        while (l >= 0 && l < 8 && c >= 0 && c < 8) {
          const idx = this.indexFromCoord(l, c);
          if (idx === null) break;

          const conteudo = board[idx];

          // 1. Casa Vazia
          if (conteudo === 0) {
            movimentos.push({ from: [linha, coluna], to: [l, c] });
            if (!ehDama) break;
          }
          // 2. Inimigo (Vermelha=1 ou Dama Vermelha=3)
          else if (conteudo === 1 || conteudo === 3) {
            const lDest = l + dl;
            const cDest = c + dc;
            const idxDest = this.indexFromCoord(lDest, cDest);

            if (idxDest !== null && board[idxDest] === 0) {
              capturas.push({ from: [linha, coluna], to: [lDest, cDest] });
            }
            break; 
          } else {
            // Amigo
            break;
          }
          l += dl;
          c += dc;
        }
      }
    }

    // --- LÓGICA DE DECISÃO ---
    if (movimentos.length === 0 && capturas.length === 0) {
      return { from: [0, 0], to: [0, 0] };
    }

    if (nivel === "facil") {
      if (movimentos.length > 0) return this.getRandomItem(movimentos)!;
      return this.getRandomItem(capturas)!;
    } else if (nivel === "medio") {
      const temCaptura = capturas.length > 0;
      if (temCaptura && Math.random() < 0.5) {
        return this.getRandomItem(capturas)!;
      }
      if (movimentos.length > 0) return this.getRandomItem(movimentos)!;
      return this.getRandomItem(capturas)!;
    } else {
      // Dificil (default)
      if (capturas.length > 0) return this.getRandomItem(capturas)!;
      return this.getRandomItem(movimentos)!;
    }
  }
}

export default new DamaService();