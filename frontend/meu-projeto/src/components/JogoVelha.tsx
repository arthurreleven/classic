import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type CellValue = 'x' | 'o' | null;
type Board = CellValue[];
type Nivel = 'facil' | 'medio' | 'dificil';

const X_CLASS: CellValue = 'x';
const O_CLASS: CellValue = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export default function JogoDaVelha() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winMessage, setWinMessage] = useState<string>('');
  const [nivel, setNivel] = useState<Nivel>('facil');
  const [pontos, setPontos] = useState({ voce: 0, ia: 0 });

  useEffect(() => {
    if (!isXTurn && !gameOver) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXTurn, gameOver, board]);

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver || !isXTurn) return;

    const newBoard = [...board];
    newBoard[index] = X_CLASS;
    setBoard(newBoard);

    if (checkWin(newBoard, X_CLASS)) {
      endGame(false);
      setPontos(prev => ({ ...prev, voce: prev.voce + 1 }));
    } else if (isDraw(newBoard)) {
      endGame(true);
    } else {
      setIsXTurn(false);
    }
  };

  const makeAIMove = () => {
    let move;
    
    if (nivel === 'dificil') {
      move = getBestMove(board);
    } else if (nivel === 'medio') {
      move = Math.random() > 0.5 ? getBestMove(board) : getRandomMove(board);
    } else {
      move = getRandomMove(board);
    }

    if (move !== null) {
      const newBoard = [...board];
      newBoard[move] = O_CLASS;
      setBoard(newBoard);

      if (checkWin(newBoard, O_CLASS)) {
        endGame(false);
        setPontos(prev => ({ ...prev, ia: prev.ia + 1 }));
      } else if (isDraw(newBoard)) {
        endGame(true);
      } else {
        setIsXTurn(true);
      }
    }
  };

  const getRandomMove = (currentBoard: Board): number | null => {
    const availableCells = currentBoard
      .map((cell: CellValue, index: number) => cell === null ? index : null)
      .filter((val: number | null) => val !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  };

  const getBestMove = (currentBoard: Board): number | null => {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = O_CLASS;
        const score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    if (checkWin(currentBoard, O_CLASS)) return 10 - depth;
    if (checkWin(currentBoard, X_CLASS)) return depth - 10;
    if (isDraw(currentBoard)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = O_CLASS;
          const score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = X_CLASS;
          const score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const checkWin = (currentBoard: Board, currentClass: CellValue): boolean => {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return currentBoard[index] === currentClass;
      });
    });
  };

  const isDraw = (currentBoard: Board): boolean => {
    return currentBoard.every((cell: CellValue) => cell !== null);
  };

  const endGame = (draw: boolean) => {
    setGameOver(true);
    if (draw) {
      setWinMessage('Empate!');
    } else {
      setWinMessage(isXTurn ? 'Você Venceu!' : 'IA Venceu!');
    }
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setGameOver(false);
    setWinMessage('');
  };

  const resetPontos = () => {
    setPontos({ voce: 0, ia: 0 });
    restartGame();
  };

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-hidden">
      
      {/* ===== HEADER (PADRÃO DO SEU DESIGN) ===== */}
      <header className="w-full bg-[#00020D] relative z-10">
        <div className="w-full px-6 py-4 flex items-center">
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="w-35 h-18 flex items-center justify-center cursor-pointer">
              <img src="/logo-projeto.png" alt="Logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          <nav className="ml-20 flex gap-12 text-3xl">
            <Link to="/" className="hover:text-orange-400 transition">Jogos</Link>
            <Link to="/conta" className="hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="hover:text-orange-400 transition">Sobre</Link>
            <Link to="/suporte" className="hover:text-orange-400 transition">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
          </nav>

          <div className="ml-auto mr-6">
            <button className="px-6 py-2 bg-orange-500 text-2xl rounded-xl border-4 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] transition-all">
              Entrar
            </button>
          </div>
        </div>

        <div className="h-1 border-t-4 border-orange-500"></div>
      </header>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="relative z-10 flex justify-center items-center min-h-[calc(100vh-100px)] py-10">
        
        {/* CONTAINER DO JOGO */}
        <div className="w-[490px] bg-[#06203d] p-10 rounded-[25px] flex flex-col items-center gap-4 font-mono" 
             style={{boxShadow: '0 0 30px #00aaff'}}>
          
          {/* TÍTULO */}
          <h2 className="text-5xl font-bangers text-[#00c8ff] mb-2" style={{textShadow: '0 0 15px #00aaff'}}>
            Jogo da Velha
          </h2>

          {/* DIFICULDADE */}
          <div className="flex gap-2.5 items-center mb-2.5">
            <span className="font-bold text-lg">Dificuldade:</span>
            <button
              onClick={() => { setNivel('facil'); resetPontos(); }}
              className={`px-5 py-2 rounded-[20px] border-2 font-bold cursor-pointer transition-all text-base ${
                nivel === 'facil'
                  ? 'bg-[#00aaff] text-black border-[#00aaff]'
                  : 'bg-transparent text-[#00aaff] border-[#00aaff] hover:bg-[#00aaff]/20'
              }`}
              style={nivel === 'facil' ? {boxShadow: '0 0 15px #00aaff'} : {}}
            >
              Fácil
            </button>
            <button
              onClick={() => { setNivel('medio'); resetPontos(); }}
              className={`px-5 py-2 rounded-[20px] border-2 font-bold cursor-pointer transition-all text-base ${
                nivel === 'medio'
                  ? 'bg-[#00aaff] text-black border-[#00aaff]'
                  : 'bg-transparent text-[#00aaff] border-[#00aaff] hover:bg-[#00aaff]/20'
              }`}
              style={nivel === 'medio' ? {boxShadow: '0 0 15px #00aaff'} : {}}
            >
              Médio
            </button>
            <button
              onClick={() => { setNivel('dificil'); resetPontos(); }}
              className={`px-5 py-2 rounded-[20px] border-2 font-bold cursor-pointer transition-all text-base ${
                nivel === 'dificil'
                  ? 'bg-[#00aaff] text-black border-[#00aaff]'
                  : 'bg-transparent text-[#00aaff] border-[#00aaff] hover:bg-[#00aaff]/20'
              }`}
              style={nivel === 'dificil' ? {boxShadow: '0 0 15px #00aaff'} : {}}
            >
              Difícil
            </button>
          </div>

          {/* TABULEIRO */}
          <div className={`w-[320px] h-[320px] grid grid-cols-3 gap-2.5 my-2.5 ${gameOver ? 'opacity-60 pointer-events-none' : ''}`}>
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                className={`w-[100px] h-[100px] bg-[#0a3050] rounded-2xl flex items-center justify-center cursor-pointer relative transition-transform hover:scale-105 ${
                  cell ? 'cursor-not-allowed' : ''
                }`}
                style={{boxShadow: '0 0 10px rgba(0,170,255,0.3)'}}
              >
                {cell === X_CLASS && (
                  <>
                    <div className="absolute w-[70px] h-2.5 bg-[#00aaff] rounded-full rotate-45"></div>
                    <div className="absolute w-[70px] h-2.5 bg-[#00aaff] rounded-full -rotate-45"></div>
                  </>
                )}
                {cell === O_CLASS && (
                  <div className="absolute w-[65px] h-[65px] border-8 border-[#00e5ff] rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* PLACAR */}
          <div className="mt-2.5 bg-black/40 px-10 py-3 rounded-[30px] flex gap-10 text-[1.4rem]">
            <span>Você: <b className="text-[#00e5ff]">{pontos.voce}</b></span>
            <span>IA: <b className="text-[#00e5ff]">{pontos.ia}</b></span>
          </div>
        </div>

      </main>

      {/* MODAL DE VITÓRIA */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[3000]">
          <div className="bg-[#06203d] px-[60px] py-10 rounded-[20px] text-center font-mono" 
               style={{boxShadow: '0 0 40px rgba(0,140,255,0.6)'}}>
            <p className="text-4xl text-[#00e5ff] mb-5">{winMessage}</p>
            <button
              onClick={restartGame}
              className="px-8 py-3 text-xl bg-[#00aaff] text-black border-none rounded-[15px] cursor-pointer hover:scale-105 transition-transform font-bold"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}