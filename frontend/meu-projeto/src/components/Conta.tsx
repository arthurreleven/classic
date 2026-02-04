<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Conta() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =============================
  //   BUSCAR DADOS DO USUÁRIO
  // =============================
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          console.warn("Usuário não autenticado");
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Enquanto carrega
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#040826] text-white text-3xl">
        Carregando...
      </div>
    );
  }

  // Se não estiver logado
  if (!user) {
    return (
      <div className="w-screen h-screen flex flex-col gap-6 items-center justify-center bg-[#040826] text-white text-3xl">
        Você não está logado.
        <Link
          to="/login/login.html"
          className="px-6 py-3 bg-orange-500 rounded-xl border-4 border-black text-2xl shadow-[4px_4px_0px_#000]"
        >
          Fazer login
        </Link>
      </div>
    );
  }

  // ==========================
  //   DEFINIR AVATAR EXIBIDO
  // ==========================
  const avatarSRC = user.avatar 
    ? user.avatar
    : `/avatars/avatar-${user.avatarId || 1}.jpg`;

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-hidden">

      {/* BACKGROUND */}
      <img
        src="/images/sobre/preto-branco.png"
        alt="bg"
        className="fixed bottom-0 left-0 w-[500px] opacity-20 select-none pointer-events-none z-0"
      />

      {/* HEADER */}
      <header className="w-full bg-[#00020D] relative z-10">
        <div className="w-full px-6 py-4 flex items-center">

          {/* LOGO */}
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="cursor-pointer">
              <img src="/images/images-login/logo-projeto.png" className="w-32" />
            </Link>
          </div>

          {/* MENU */}
          <nav className="ml-20 flex gap-12 text-3xl">
            <Link to="/" className="cursor-pointer hover:text-orange-400 transition">Jogos</Link>
            <Link to="/conta" className="cursor-pointer hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="cursor-pointer text-orange-400">Sobre</Link>
            <Link to="/suporte" className="cursor-pointer text-orange-400">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
            <Link to="/labia" className="hover:text-orange-400 transition">IA</Link>
          </nav>

          {/* AVATAR NO HEADER */}
          <div className="ml-auto mr-6">
            <img
              src={avatarSRC}
              className="w-12 h-12 rounded-full border-4 border-black object-cover shadow-[3px_3px_0px_#000]"
              alt="avatar"
            />
>>>>>>> 77524ba (Add Files)
          </div>
        </div>

        <div className="h-1 border-t-4 border-orange-500"></div>
      </header>

<<<<<<< HEAD
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
=======
      {/* CONTEÚDO */}
      <main className="relative z-10 max-w-6xl mx-auto mt-16 px-8">

        {/* TÍTULO */}
        <h1 className="text-center text-5xl text-orange-400 border-2 border-black px-8 py-1 w-fit mx-auto mb-0">
          Minha Conta
        </h1>

        <div className="flex gap-10 items-start">

          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col gap-10">

            {/* AVATAR + NICK */}
            <div className="flex items-center gap-6">
              <img
                src={avatarSRC}
                className="w-28 h-28 rounded-full border-4 border-black object-cover shadow-[4px_4px_0px_#000]"
                alt="avatar"
              />
              <span className="text-4xl">{user.nome}</span>
            </div>

            {/* INFORMAÇÕES */}
            <div>
              <h2 className="text-orange-400 text-3xl mb-">Informações do Perfil</h2>

              <ul className="space-y-3 text-xl">
                <li><span className="text-orange-400">Nome:</span> {user.nome}</li>
                <li><span className="text-orange-400">E-mail:</span> {user.email}</li>
                <li><span className="text-orange-400">Login via:</span> {user.provider}</li>
                <li><span className="text-orange-400">Avatar:</span> {user.avatarId || "Google"}</li>
                <li className="cursor-pointer hover:text-orange-400 transition">Alterar senha</li>
              </ul>
            </div>



          </div>

>>>>>>> 77524ba (Add Files)
        </div>
      </main>
    </div>
  );
}
