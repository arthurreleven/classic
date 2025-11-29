import React from "react";
import { Link } from "react-router-dom";

export default function Conta() {
  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-hidden">

      {/* BACKGROUND DECORATIVO — DIREITA */}
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

      {/* ===== HEADER (MESMO PADRÃO QUE VOCÊ JÁ TEM) ===== */}
      <header className="w-full bg-[#00020D] relative z-10">
        <div className="w-full px-6 py-4 flex items-center">
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="w-35 h-18 flex items-center justify-center cursor-pointer">
              <img src="/logo-projeto.png" alt="Logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          <nav className="ml-20 flex gap-12 text-3xl">
            <Link to="/" className="hover:text-orange-400">Jogos</Link>
            <Link to="/conta" className="text-orange-400 underline">Conta</Link>
            <Link to="/sobre" className="hover:text-orange-400">Sobre</Link>
            <Link to="/suporte" className="hover:text-orange-400">Suporte</Link>
          </nav>

          <div className="ml-auto mr-6">
            <button className="
              px-6 py-2 bg-orange-500 text-2xl rounded-xl border-4 border-black
              shadow-[3px_3px_0px_#000]
            ">
              Entrar
            </button>
          </div>
        </div>

        <div className="h-1 border-t-4 border-orange-500"></div>
      </header>

      {/* ===== CONTEÚDO ===== */}
      <main className="relative z-10 max-w-6xl mx-auto mt-12 px-8">

        {/* TÍTULO */}
        <h1
          className="
            absolute
            left-1/2
            -translate-x-1/2
            top-[0px]
            text-5xl
            text-orange-400
            border-2
            border-black
            px-8
            py-1
            w-fit
            z-20
          "
        >
          Minha conta
        </h1>


        <div className="flex gap-16 items-start">
          
          {/* ===== PERFIL ===== */}
          <div className="flex flex-col gap-6">
            {/* ESPAÇADOR */}
            <div className="h-18"></div>

            {/* AVATAR + NICK */}
            <div className="flex items-center gap-6">
              <div className="
                w-24 h-24 rounded-full bg-gray-200 border-4 border-black
              " />
              <span className="text-3xl">#Nickname</span>
            </div>

            {/* INFORMAÇÕES */}
            <div className="mt-6">
              <h2 className="text-orange-400 text-3xl mb-4">
                Informações do Perfil
              </h2>

              <ul className="space-y-3 text-xl">
                <li><span className="text-orange-400">E-mail:</span> jamal@gmail.com</li>
                <li><span className="text-orange-400">Nome de exibição:</span> Nickname</li>
                <li><span className="text-orange-400">Jogo preferido:</span> Jogo da Velha</li>
                <li className="cursor-pointer hover:text-orange-400 transition">
                  Alterar senha
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
