import React, { useEffect, useState } from "react";
import CarrosselGames from "./components/CarrosselGames";
import { CarrosselHero } from "./components/CarrosselHero";
import Sobre from "./components/Sobre";
import { Link } from "react-router-dom";

type User = {
  nome: string;
  email: string;
  avatar?: string;
};

export default function HomeInterface() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    console.log("🔍 Verificando autenticação...");
    fetch("http://localhost:5000/api/me", {
      credentials: "include",
    })
      .then(res => {
        console.log("📡 Status da resposta:", res.status, res.ok);
        return res.ok ? res.json() : null;
      })
      .then(data => {
        console.log("👤 Dados do usuário:", data);
        setUser(data);
        setLoadingUser(false);
      })
      .catch(err => {
        console.error("❌ Erro ao buscar usuário:", err);
        setUser(null);
        setLoadingUser(false);
      });
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const destaqueSlider = React.useRef<any>(null);
  const iaSlider = React.useRef<any>(null);
  const [mensagens, setMensagens] = useState([
    { autor: "ia", texto: "Olá! Eu sou o Jamal. Em que posso ajudar?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!inputValue.trim() || isLoading) return;

    const msg = inputValue;
    setInputValue("");

    setMensagens((prev) => [...prev, { autor: "user", texto: msg }]);

    setIsLoading(true);
    setMensagens((prev) => [...prev, { autor: "ia", texto: "..." }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: msg })
      });

      const data = await res.json();
      const respostaIA = data.resposta || data.mensagem || "Desculpe, não entendi.";

      setMensagens((prev) => [
        ...prev.slice(0, -1),
        { autor: "ia", texto: respostaIA }
      ]);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      setMensagens((prev) => [
        ...prev.slice(0, -1),
        { autor: "ia", texto: "Desculpe, ocorreu um erro. Tente novamente." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    // Remove o avatar IMEDIATAMENTE (feedback visual instantâneo)
    setUser(null);
    
    try {
      console.log("🚪 Fazendo logout...");
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include"
      });
      
      console.log("📡 Resposta do logout:", response.status);
      
      if (response.ok) {
        console.log("✅ Logout realizado com sucesso!");
      } else {
        console.error("❌ Erro no logout:", response.status);
      }
    } catch (err) {
      console.error("❌ Erro ao fazer logout:", err);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers font-sans relative overflow-x-hidden">
      {/* HEADER */}
      <header className="w-full bg-[#00020D]">
        <div className="w-full px-6 py-4 flex items-center">
          {/* LOGO */}
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="w-35 h-18 flex items-center justify-center cursor-pointer">
              <img
                src="/logo-projeto.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </Link>
          </div>

          {/* MENU CENTRALIZADO */}
          <nav className="ml-20 flex items-center gap-12 text-3xl font-bangers text-white">
            <Link to="/" className="cursor-pointer hover:text-orange-400 transition">Jogos</Link>
            <Link to="/ranking" className="cursor-pointer hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="cursor-pointer text-orange-400 underline">Sobre</Link>
            <Link to="/suporte" className="cursor-pointer hover:text-orange-400 transition">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
          </nav>

          {/* Botão Entrar / Avatar */}
          <div className="ml-auto mr-6">
            {loadingUser ? (
              <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
            ) : !user ? (
              <button
                onClick={() => (window.location.href = "/login/login.html")}
                className="
                  px-6 py-2 bg-orange-500 text-2xl rounded-xl
                  border-4 border-black shadow-[3px_3px_0px_#000]
                  hover:translate-y-[-2px] transition-all
                "
              >
                Entrar
              </button>
            ) : (
              <div className="relative group">
                {/* AVATAR */}
                <img
                  src={user.avatar || "/images/avatar-default.png"}
                  alt={user.nome || "avatar"}
                  className="
                    w-12 h-12 rounded-full border-4 border-black
                    cursor-pointer object-cover
                  "
                />

                {/* DROPDOWN */}
                <div className="
                  absolute right-0 mt-3 w-48
                  bg-[#00020D] border-4 border-black rounded-lg
                  opacity-0 group-hover:opacity-100
                  pointer-events-none group-hover:pointer-events-auto
                  transition-opacity duration-200
                  shadow-xl
                ">
                  <div className="px-4 py-2 border-b-2 border-gray-700">
                    <p className="text-sm font-bold text-orange-400">{user.nome}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Link 
                    to="/conta" 
                    className="block px-4 py-2 hover:bg-orange-500 transition"
                  >
                    Minha conta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-500 transition"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-1 w-full bg-transparent border-t-4 border-orange-500"></div>
      </header>

      {/* HERO SECTION: Carrossel de Imagens */}
      <div className="w-full mt-10 px-5">
          <CarrosselHero />
      </div>

      {/* SCROLLING MENU */}
      <nav className="w-full overflow-hidden bg-[#00020D] border-y-4 border-orange-500 py-3 relative mt-10">
        <div className="marquee-track flex whitespace-nowrap">
          {[1, 2, 3].map((n) => (
            <div key={n} className="marquee-block flex text-orange-400 text-3xl">
              <span className="mx-10"># Poderoso.Jamal</span>
              <span className="mx-10"># Ranking - TOP 20</span>
              <span className="mx-10"># Flip Bird</span>
            </div>
          ))}
        </div>
        <style>{`
          .marquee-track {
            width: max-content;
            animation: marqueeMove 14s linear infinite;
          }
          @keyframes marqueeMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
        `}</style>
      </nav>

      {/* SEÇÃO DE JOGOS */}
      <section className="w-full mt-16 px-10">
        <h2 className="text-6xl font-[anton] text-center mb-14">
          Jogos
        </h2>

        {/* Jogos em Destaque */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-4xl font-[anton]">Jogos em destaques</h3>
            <div className="flex gap-4 text-3xl">
              <button
                className="hover:text-orange-400 transition"
                onClick={() => destaqueSlider.current?.prev()}
              >
                ←
              </button>
              <button
                className="hover:text-orange-400 transition"
                onClick={() => destaqueSlider.current?.next()}
              >
                →
              </button>
            </div>
          </div>

          <CarrosselGames
            jogos={[
              {
                id: 1,
                titulo: "Jogo da Velha",
                link: "/jogos/jogo_da_velha/index.html",
                imagem: "/images/tic-tac-toe.jpg",
              },
              {
                id: 2,
                titulo: "Space Shooter",
                link: "#",
                imagem: "/images/space-shooter.jpg"
              },
              {
                id: 3,
                titulo: "Quiz Game",
                link: "#",
                imagem: "/images/quiz.jpg"
              },
              {
                id: 4,
                titulo: "JoKenPô",
                link: "#",
                imagem: "/images/jokenpo.jpeg"
              },
              {
                id: 5,
                titulo: "Tic",
                link: "/jogovelha",
              },
              {
                id: 6,
                titulo: "Dama",
                link: "/dama",
              },
            ]}
            onSliderReady={(slider) => (destaqueSlider.current = slider)}
          />
        </div>

        {/* Desafie a IA */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-4xl font-[anton]">Desafie a IA</h3>
            <div className="flex gap-4 text-3xl">
              <button
                className="hover:text-orange-400 transition"
                onClick={() => iaSlider.current?.prev()}
              >
                ←
              </button>
              <button
                className="hover:text-orange-400 transition"
                onClick={() => iaSlider.current?.next()}
              >
                →
              </button>
            </div>
          </div>

          <CarrosselGames
            jogos={[
              {
                id: 101,
                titulo: "Space Shooter IA",
                link: "#",
                imagem: "/images/space-shooter.jpg"
              },
              {
                id: 102,
                titulo: "Jogo da Velha IA",
                link: "/jogos/jogo_da_velha/index.html",
                imagem: "/images/tic-tac-toe.jpg"
              },
              {
                id: 103,
                titulo: "JoKenPô Impossível",
                link: "#",
                imagem: "/images/jokenpo.jpeg"
              },
              {
                id: 104,
                titulo: "Quiz Inteligente",
                link: "#",
                imagem: "/images/quiz.jpg"
              },
              {
                id: 105,
                titulo: "Outro desafio",
                link: "#"
              },
            ]}
            onSliderReady={(slider) => (iaSlider.current = slider)}
          />
        </div>
      </section>

      {/* CHAT POPUP */}
      {isChatOpen && (
        <div className="fixed bottom-32 right-6 w-80 h-96 bg-[#111827] border-4 border-orange-500 rounded-xl shadow-2xl flex flex-col p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold">Chat Jamal</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white text-2xl hover:text-orange-400 transition"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-base">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={m.autor === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={
                    m.autor === "user"
                      ? "inline-block bg-orange-500 text-black px-3 py-2 rounded-xl max-w-[80%]"
                      : "inline-block bg-gray-700 text-white px-3 py-2 rounded-xl max-w-[80%]"
                  }
                >
                  {m.texto}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 rounded-lg text-black"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-orange-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-orange-400 transition disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        .animate-pulse-custom {
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}