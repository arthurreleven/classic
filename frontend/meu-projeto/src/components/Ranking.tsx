import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Jogador {
  nome?: string;
  name?: string;
  email?: string;
  pontuacao?: number;
  vitorias?: number;
  derrotas?: number;
  empates?: number;
}

export default function Ranking() {
  const [jogos, setJogos] = useState<string[]>([]);

  const [jogoSelecionado, setJogoSelecionado] = useState(() => {
    return localStorage.getItem("ranking_jogoSelecionado") || "";
  });

  useEffect(() => {
  if (jogoSelecionado) {
    localStorage.setItem("ranking_jogoSelecionado", jogoSelecionado);
  }
}, [jogoSelecionado]);

  const [dificuldade, setDificuldade] = useState(() => {
    return localStorage.getItem("ranking_dificuldade") || "";
  });
  
  useEffect(() => {
  if (dificuldade) {
    localStorage.setItem("ranking_dificuldade", dificuldade);
  }
}, [dificuldade]);

  const [ranking, setRanking] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Carregar lista de jogos no início
  useEffect(() => {
    async function carregarJogos() {
      try {
        const resp = await fetch("/api/jogos");
        const data = await resp.json();
        setJogos(data.map((j: any) => j.jogo));
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      }
    }

    carregarJogos();
  }, []);

  // 🔥 Carregar ranking quando jogo + dificuldade forem selecionados
  useEffect(() => {
    if (!jogoSelecionado || !dificuldade) return;

    async function carregarRanking() {
      setLoading(true);
      setRanking([]);

      try {
        const resp = await fetch(
          `/api/ranking_nome/${encodeURIComponent(jogoSelecionado)}/${dificuldade}`
        );

        const data = await resp.json();
        setRanking(data);
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
      }

      setLoading(false);
    }

    carregarRanking();
  }, [jogoSelecionado, dificuldade]);

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-x-hidden">

      {/* BACKGROUND IMG */}
      <img
        src="/images/sobre/preto-branco.png"
        alt="background"
        className="fixed bottom-0 left-0 w-[500px] opacity-20 pointer-events-none select-none z-0"
      />

      {/* HEADER */}
      <header className="w-full bg-[#00020D] relative z-10">
        <div className="w-full px-6 py-4 flex items-center">

          {/* LOGO */}
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="w-35 h-18 flex items-center justify-center cursor-pointer">
              <img src="/logo-projeto.png" alt="Logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          {/* MENU */}
          <nav className="ml-20 flex items-center gap-12 text-3xl">
            <Link to="/" className="hover:text-orange-400 transition">Jogos</Link>
            <Link to="/conta" className="hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="hover:text-orange-400 transition">Sobre</Link>
            <Link to="/suporte" className="hover:text-orange-400 transition">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
          </nav>

          {/* BOTÃO ENTRAR */}
          <div className="ml-auto mr-6">
            <button
              onClick={() => (window.location.href = "/login/login.html")}
              className="px-6 py-2 bg-orange-500 text-white text-2xl
              rounded-xl border-[4px] border-black shadow-[3px_3px_0px_#000]
              hover:translate-y-[-2px] transition-all active:translate-y-[1px]"
            >
              Entrar
            </button>
          </div>
        </div>

        <div className="h-1 w-full border-t-4 border-orange-500"></div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 mt-14">

        <h1 className="text-5xl text-center text-orange-400 mb-10">
          🏆 Ranking de Jogadores
        </h1>

        {/* SELECT DE JOGOS */}
        <div className="text-center mb-8">
          <label className="text-2xl mr-4">Selecione o jogo:</label>
          <select
            value={jogoSelecionado}
            onChange={(e) => {
              const jogo = e.target.value;
              setJogoSelecionado(jogo);

              // Quando troca o jogo, reseta a dificuldade
              setDificuldade("");
              localStorage.removeItem("ranking_dificuldade");

              setRanking([]);
            }}
             className="
              text-black text-xl px-2 py-2 rounded-xl font-bold
              bg-orange-400 border-2 border-white
              shadow-[4px_4px_0px_#000] 
              hover:shadow-[2px_2px_0px_#000] 
              hover:bg-yellow-200
              transition-all cursor-pointer
            "
          >
            <option value="">-- Escolha --</option>
            {jogos.map((jogo, i) => (
              <option key={i} value={jogo}>{jogo}</option>
            ))}
          </select>
        </div>

        {/* SELECT DE DIFICULDADE */}
        {jogoSelecionado && (
          <div className="text-center mb-8">
            <label className="text-2xl mr-4">Dificuldade:</label>
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              className="
              text-black text-xl px-3 py-2 rounded-xl font-bold
              bg-orange-400 border-2 border-white
              shadow-[4px_4px_0px_#000]
              hover:shadow-[2px_2px_0px_#000]
              hover:bg-yellow-200
              transition-all cursor-pointer
            "
            >
              <option value="">-- Escolha --</option>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center text-2xl opacity-80 mt-10">
            ⏳ Carregando ranking...
          </div>
        )}

        {/* LISTA DE RANKING */}
        {!loading && ranking.length > 0 && (
          <table className="w-full bg-white text-black rounded-lg overflow-hidden shadow-xl">
            <thead>
              <tr className="bg-gray-600 text-white text-xl">
                <th className="py-3">Posição</th>
                <th>Jogador</th>
                <th>Pontos / Vitórias</th>
                <th>Derrotas</th>
                <th>Empates</th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((user, index) => {
                const nome = user.nome || user.name || user.email || "Sem nome";
                const pos =
                  index === 0 ? "🥇" :
                  index === 1 ? "🥈" :
                  index === 2 ? "🥉" :
                  index + 1;

                const avatar = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(nome)}`;

                return (
                  <tr key={index} className="text-lg text-center hover:bg-gray-100">
                    <td className="py-3">{pos}</td>
                    <td>
                      <div className="flex justify-center items-center gap-3">
                        <img src={avatar} className="w-12 h-12 rounded-full" />
                        {nome}
                      </div>
                    </td>
                    <td>{user.pontuacao ?? user.vitorias ?? 0}</td>
                    <td>{user.derrotas ?? 0}</td>
                    <td>{user.empates ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* MENSAGEM DE VAZIO */}
        {!loading && ranking.length === 0 && jogoSelecionado && dificuldade && (
          <div className="text-center text-2xl text-red-200 mt-6">
            Nenhum jogador encontrado 😢
          </div>
        )}

      </main>
    </div>
  );
}