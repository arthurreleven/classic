import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type BoardArray = number[];

const initialBoard = (): BoardArray => {
  const b = new Array(32).fill(0);
  for (let i = 0; i < 12; i++) b[i] = 2;
  for (let i = 20; i < 32; i++) b[i] = 1;
  return b;
};

function coordFromIndex(i: number): [number, number] {
  const linha = Math.floor(i / 4);
  const coluna = (i % 4) * 2 + (linha % 2 === 0 ? 1 : 0);
  return [linha, coluna];
}

function indexFromCoord(l: number, c: number): number | null {
  if (l < 0 || l > 7 || c < 0 || c > 7) return null;
  if ((l + c) % 2 === 0) return null;
  return l * 4 + Math.floor(c / 2);
}

function deepCopyBoard(b: BoardArray) {
  return b.slice();
}

export default function Dama() {
  const [board, setBoard] = useState<BoardArray>(() => initialBoard());
  const [turno, setTurno] = useState<"vermelha" | "preta">("vermelha");
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [jogando, setJogando] = useState<boolean>(true);
  const [nivel, setNivel] = useState<"facil" | "medio" | "dificil">("facil");
  const [pontos, setPontos] = useState<{ voce: number; ia: number }>({ voce: 0, ia: 0 });
  const [overlayMsg, setOverlayMsg] = useState<string | null>(null);

  useEffect(() => {
    const dados = localStorage.getItem("placarDama");
    if (dados) {
      try {
        const obj = JSON.parse(dados);
        setPontos({ voce: obj.voce || 0, ia: obj.ia || 0 });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("placarDama", JSON.stringify(pontos));
  }, [pontos]);

  function countPieces(b: BoardArray) {
    let verm = 0;
    let pret = 0;
    b.forEach((v) => {
      if (v === 1 || v === 3) verm++;
      if (v === 2 || v === 4) pret++;
    });
    return { verm, pret };
  }

  useEffect(() => {
    const { verm, pret } = countPieces(board);
    if (pret === 0) {
      setPontos((p) => ({ ...p, voce: p.voce + 1 }));
      setOverlayMsg("🏆 Você venceu!");
      setJogando(false);
    } else if (verm === 0) {
      setPontos((p) => ({ ...p, ia: p.ia + 1 }));
      setOverlayMsg("😢 Você perdeu!");
      setJogando(false);
    }
  }, [board]);

  function isDama(value: number) {
    return value === 3 || value === 4;
  }

  function isVermelha(value: number) {
    return value === 1 || value === 3;
  }

  function isPreta(value: number) {
    return value === 2 || value === 4;
  }

  function attemptMove(origIndex: number, destIndex: number): boolean {
    if (!jogando) return false;
    if (turno !== "vermelha") return false;
    if (origIndex === destIndex) return false;
    const oVal = board[origIndex];
    if (!isVermelha(oVal)) return false;
    const dVal = board[destIndex];
    if (dVal !== 0) return false;

    const [l1, c1] = coordFromIndex(origIndex);
    const [l2, c2] = coordFromIndex(destIndex);
    const dl = l2 - l1;
    const dc = c2 - c1;
    const dama = isDama(oVal);

    let valido = false;
    let capturadaIdx: number | null = null;

    if (dama) {
      if (Math.abs(dl) === Math.abs(dc) && Math.abs(dl) >= 1) {
        const passos = Math.abs(dl);
        let bloqueada = false;
        for (let i = 1; i < passos; i++) {
          const idx = indexFromCoord(l1 + i * Math.sign(dl), c1 + i * Math.sign(dc));
          const peca = idx !== null ? board[idx] : null;
          if (idx === null) { bloqueada = true; break; }
          if (peca && peca !== 0) {
            if (isPreta(peca) && capturadaIdx === null) {
              capturadaIdx = idx;
            } else {
              bloqueada = true;
              break;
            }
          }
        }
        if (!bloqueada) valido = true;
      }
    } else {
      if (dl === -1 && Math.abs(dc) === 1) {
        valido = true;
      }
      if (dl === -2 && Math.abs(dc) === 2) {
        const meioL = (l1 + l2) / 2;
        const meioC = (c1 + c2) / 2;
        const meioIdx = indexFromCoord(meioL, meioC);
        if (meioIdx !== null && isPreta(board[meioIdx])) {
          capturadaIdx = meioIdx;
          valido = true;
        }
      }
    }

    if (!valido) return false;

    const nb = deepCopyBoard(board);
    nb[destIndex] = nb[origIndex];
    nb[origIndex] = 0;
    if (capturadaIdx !== null) nb[capturadaIdx] = 0;

    const [destL] = coordFromIndex(destIndex);
    if (!isDama(oVal) && destL === 0) {
      nb[destIndex] = 3;
    }

    setBoard(nb);
    setSelecionada(null);
    setTurno("preta");
    setJogando(false);

    setTimeout(() => turnoIA(nb), 300);

    return true;
  }

  function applyIAMove(j: { from: [number, number]; to: [number, number] }, currentBoard: BoardArray) {
    const [l1, c1] = j.from;
    const [l2, c2] = j.to;
    const oIdx = indexFromCoord(l1, c1);
    const dIdx = indexFromCoord(l2, c2);
    if (oIdx === null || dIdx === null) return;
    const nb = deepCopyBoard(currentBoard);
    const oVal = nb[oIdx];
    if (oVal === 0) return;
    
    const passos = Math.abs(l2 - l1);
    let capturadaIdx: number | null = null;
    if (passos >= 2) {
      const dirL = Math.sign(l2 - l1);
      const dirC = Math.sign(c2 - c1);
      for (let i = 1; i < passos; i++) {
        const idx = indexFromCoord(l1 + i * dirL, c1 + i * dirC);
        if (idx !== null && isVermelha(nb[idx])) {
          capturadaIdx = idx;
          break;
        }
      }
    }
    nb[dIdx] = nb[oIdx];
    nb[oIdx] = 0;
    if (capturadaIdx !== null) nb[capturadaIdx] = 0;
    
    const [destL] = coordFromIndex(dIdx);
    if (!isDama(nb[dIdx]) && destL === 7) {
      nb[dIdx] = 4;
    }
    setBoard(nb);
    setTurno("vermelha");
    setJogando(true);
  }

  async function turnoIA(currentBoard: BoardArray) {
    const bToSend = currentBoard.slice();
    try {
      const resp = await fetch("http://127.0.0.1:5000/jogar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: bToSend, nivel }),
      });
      if (!resp.ok) throw new Error("IA fetch failed");
      const j = await resp.json();
      applyIAMove(j, currentBoard);
    } catch (err) {
      console.error("Erro comunicando com o backend IA:", err);
      setTurno("vermelha");
      setJogando(true);
    }
  }

  function onCellClick(idx: number | null) {
    if (!jogando) return;
    if (idx === null) return;
    const val = board[idx];
    if (val !== 0 && isVermelha(val) && turno === "vermelha") {
      setSelecionada(idx);
      return;
    }
    if (selecionada !== null && board[idx] === 0) {
      const moved = attemptMove(selecionada, idx);
      if (!moved) {
        setSelecionada(null);
      }
    }
  }

  function reiniciar() {
    setBoard(initialBoard());
    setJogando(true);
    setTurno("vermelha");
    setSelecionada(null);
    setOverlayMsg(null);
  }

  function fecharOverlay() {
    setOverlayMsg(null);
    setJogando(true);
    reiniciar();
  }

  function renderBoard() {
    const rows: React.ReactNode[] = [];
    for (let l = 0; l < 8; l++) {
      const cells: React.ReactNode[] = [];
      for (let c = 0; c < 8; c++) {
        const isDark = (l + c) % 2 === 1;
        if (!isDark) {
          cells.push(
            <div key={`c-${l}-${c}`} className="w-[45px] h-[45px] inline-block bg-gray-300" />
          );
        } else {
          const idx = indexFromCoord(l, c)!;
          const val = board[idx];
          const hasPiece = val !== 0;
          const pieceClass =
            val === 1 ? "bg-gradient-to-br from-red-500 to-red-700 shadow-lg" : 
            val === 2 ? "bg-gradient-to-br from-gray-200 to-black shadow-lg" : 
            val === 3 ? "bg-gradient-to-br from-red-600 to-red-800 shadow-xl" : 
            val === 4 ? "bg-gradient-to-br from-gray-900 to-black shadow-xl" : "";
          const isSelected = selecionada === idx;
          const isDamaVal = val === 3 || val === 4;
          
          cells.push(
            <div
              key={`c-${l}-${c}`}
              className={`w-[45px] h-[45px] inline-flex items-center justify-center ${
                isSelected ? "outline outline-4 outline-yellow-400 outline-offset-[-4px] bg-[#2a2a2a]" : "bg-[#1a1a1a]"
              } relative cursor-pointer hover:bg-[#2a2a2a] transition-colors`}
              onClick={() => onCellClick(idx)}
            >
              {hasPiece && (
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-full ${pieceClass} border-2 ${
                      isDamaVal ? "border-yellow-400" : val === 1 ? "border-red-800" : "border-gray-900"
                    } transform transition-transform hover:scale-110`}
                  />
                  {isDamaVal && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-yellow-400 text-xl font-bold">👑</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }
      }
      rows.push(
        <div key={`r-${l}`} className="flex gap-0">
          {cells}
        </div>
      );
    }
    return rows;
  }

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-hidden">
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

      <main className="max-w-5xl mx-auto mt-8 mb-12 px-6">
        <div className="bg-gradient-to-br from-[#0a1628] to-[#040d1a] p-8 rounded-3xl shadow-2xl border-4 border-orange-500">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              ♟️ Dama com IA
            </h1>
            <div className="inline-block bg-[#0a1628] px-6 py-2 rounded-xl border-2 border-orange-500">
              <p className="text-2xl font-bold">
                {turno === "vermelha" ? "🔴 Seu Turno" : "⚫ Turno da IA"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            
            <div className="flex flex-col gap-4 lg:w-64">
              
              <div className="bg-[#0a1628] p-6 rounded-2xl border-4 border-orange-500 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-center text-orange-400">Placar</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-red-900/30 p-3 rounded-lg border-2 border-red-500">
                    <span className="text-lg font-semibold">🔴 Você:</span>
                    <span className="text-2xl font-bold text-orange-400">{pontos.voce}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-900/30 p-3 rounded-lg border-2 border-gray-500">
                    <span className="text-lg font-semibold">⚫ IA:</span>
                    <span className="text-2xl font-bold text-orange-400">{pontos.ia}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a1628] p-6 rounded-2xl border-4 border-orange-500 shadow-lg">
                <label className="block text-xl font-bold mb-3 text-orange-400">Dificuldade</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as any)}
                  className="w-full bg-[#040d1a] text-white border-2 border-orange-500 p-3 rounded-xl text-lg font-semibold hover:bg-[#0a1628] transition cursor-pointer"
                >
                  <option value="facil">😊 Fácil</option>
                  <option value="medio">😐 Médio</option>
                  <option value="dificil">😈 Difícil</option>
                </select>
              </div>

              <button 
                onClick={reiniciar}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 rounded-xl text-xl font-bold border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all"
              >
                🔄 Reiniciar Jogo
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-[#0a1628] p-6 rounded-2xl border-4 border-orange-500 shadow-2xl">
                <div id="tabuleiro" className="w-[360px] h-[360px]">
                  {renderBoard()}
                </div>
              </div>
              <div className="mt-4 text-center text-gray-400 text-sm">
                <p>💡 Clique em uma peça vermelha para selecioná-la</p>
                <p>💡 Clique em uma casa vazia para mover</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {overlayMsg && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-[#0a1628] to-[#040d1a] p-12 rounded-3xl border-4 border-orange-500 shadow-2xl text-center max-w-md">
            <h2 className="text-5xl mb-6 font-extrabold">{overlayMsg}</h2>
            <div className="mb-6 p-4 bg-[#0a1628] rounded-xl border-2 border-orange-500">
              <div className="flex justify-around text-2xl">
                <div>
                  <p className="text-gray-400 text-sm">Você</p>
                  <p className="text-orange-400 font-bold">{pontos.voce}</p>
                </div>
                <div className="text-4xl text-orange-500">×</div>
                <div>
                  <p className="text-gray-400 text-sm">IA</p>
                  <p className="text-orange-400 font-bold">{pontos.ia}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={fecharOverlay}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-xl text-xl font-bold border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all"
            >
              🎮 Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}