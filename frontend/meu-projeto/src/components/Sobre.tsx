import React from "react";
import { Link } from "react-router-dom";

export default function Sobre() {
  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-x-hidden">

      {/* BACKGROUND IMG — canto inferior direito */}
      <img
        src="/images/sobre/preto-branco.png"
        alt="background"
        className="
          fixed 
          bottom-0 
          left-0 
          w-[500px] 
          opacity-20 
          pointer-events-none 
          select-none 
          z-0
        "
      />

      {/* HEADER — MESMO DA HOME */}
      <header className="w-full bg-[#00020D] relative z-10">
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

          {/* MENU */}
          <nav className="ml-20 flex items-center gap-12 text-3xl font-bangers text-white">
            <Link to="/" className="cursor-pointer hover:text-orange-400 transition">Jogos</Link>
            <Link to="/conta" className="cursor-pointer hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="cursor-pointer text-orange-400 underline">Sobre</Link>
            <Link to="/suporte" className="cursor-pointer hover:text-orange-400 transition">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
          </nav>

          {/* BOTÃO ENTRAR */}
          <div className="ml-auto mr-6">
            <button
              onClick={() => (window.location.href = "/login/login.html")}
              className="px-6 py-2 bg-orange-500 text-white text-2xl font-coda-800
              rounded-xl border-[4px] border-black shadow-[3px_3px_0px_#000]
              hover:translate-y-[-2px] transition-all active:translate-y-[1px]"
            >
              Entrar
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-transparent border-t-4 border-orange-500"></div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-5xl mx-auto mt-12 px-5 text-center relative z-10">

        {/* TÍTULO SOBRE */}
        <h1 className="text-5xl font-bangers text-orange-400 border-2 border-black inline-block px-6 py-2 mb-10">
          SOBRE
        </h1>

        {/* PARÁGRAFOS */}
        <div className="space-y-6 text-2xl leading-tight text-justify">
          <p>
            Somos um grupo de estudantes do 4° semestre do curso de Análise e Desenvolvimento de Sistemas,
            unidos pela paixão por tecnologia, inovação e jogos digitais.
          </p>

          <p>
            Nosso projeto nasceu para criar um ambiente interativo onde jogos clássicos ganham uma nova vida,
            permitindo que você jogue contra uma inteligência artificial.
          </p>

          <p>
            Acreditamos que aprender é muito mais significativo quando colocamos a mão na massa. Por isso,
            desenvolvemos este site como parte do nosso processo de evolução acadêmica e profissional.
          </p>

          <p>
            Aqui, você encontrará jogos nostálgicos com uma camada moderna de desafio: competir contra uma IA
            treinada para oferecer partidas dinâmicas, inteligentes e imprevisíveis.
          </p>

          <p className="text-orange-400 text-center pt-4">
            Obrigado por jogar com a gente!
          </p>
        </div>

        {/* TÍTULO TECNOLOGIAS */}
        <h2 className="text-4xl font-bangers text-orange-400 mt-20 mb-10 border-b border-white/20 pb-4">
          Tecnologias que Dão Vida aos Nossos Jogos
        </h2>

        {/* CARROSSEL MANUAL */}
        <div className="relative max-w-full mx-auto">

          {/* BOTÃO ESQUERDA */}
          <button
            id="btn-left"
            className="absolute left-[-50px] top-1/2 -translate-y-1/2 bg-orange-500 text-white w-12 h-12 rounded-full font-bold shadow-lg hover:bg-orange-400"
            onClick={() =>
              document.getElementById("carousel-inner")?.scrollBy({ left: -500, behavior: "smooth" })
            }
          >
            &lt;
          </button>

          {/* BOTÃO DIREITA */}
          <button
            id="btn-right"
            className="absolute right-[-50px] top-1/2 -translate-y-1/2 bg-orange-500 text-white w-12 h-12 rounded-full font-bold shadow-lg hover:bg-orange-400"
            onClick={() =>
              document.getElementById("carousel-inner")?.scrollBy({ left: 500, behavior: "smooth" })
            }
          >
            &gt;
          </button>

          {/* CARROSSEL */}
          <div
            id="carousel-inner"
            className="flex space-x-6 pb-4 overflow-x-scroll snap-x snap-mandatory no-scrollbar"
          >
            {[
              {
                titulo: "TypeScript (TS)",
                texto:
                  "Usado para escrever o código de jogo com segurança. Tipagem estática mantém tudo estável e confiável.",
              },
              {
                titulo: "Python",
                texto:
                  "Espinha dorsal da IA e backend. Usado para treinar e rodar os modelos que desafiam o jogador.",
              },
              {
                titulo: "HTML",
                texto:
                  "Estrutura base do projeto. Define toda a arquitetura visual e semântica do site.",
              },
              {
                titulo: "CSS / Tailwind",
                texto:
                  "Responsável pelo visual completo da plataforma, com estilo retrô-futurista.",
              },
              {
                titulo: "JavaScript (JS)",
                texto:
                  "Dá vida aos jogos — eventos, animações, lógicas e toda interatividade.",
              },
              {
                titulo: "MongoDB Atlas",
                texto:
                  "Banco de dados na nuvem usado para contas, rankings e dados da IA.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full h-[350px] snap-center bg-white border-4 border-orange-500 rounded-lg shadow-xl p-6 text-left text-black"
              >
                <h3 className="text-3xl font-bold mb-3">{item.titulo}</h3>
                <p className="text-xl">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
