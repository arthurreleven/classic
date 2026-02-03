import React, { useState, FormEvent } from 'react';
import './Style.css';

function Login() {
  // Estados para controlar os inputs e o carregamento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Função de envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Evita o reload da página
    setLoading(true);

    try {
      const response = await fetch('/api/login_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login realizado com sucesso!");
        window.location.href = "/"; // Redireciona para o jogo
      } else {
        alert(data.error || "Erro no login");
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      // CORREÇÃO AQUI: Adicionei 'flex items-center justify-center'
      className="w-screen min-h-screen flex items-center justify-center bg-[#040826] text-white font-sans relative overflow-x-hidden"
      style={{ 
        backgroundImage: "url('../images/images-login/background-tech.png')",
        backgroundSize: 'cover', // Garante que a imagem cubra tudo
        backgroundPosition: 'center',
         // Centraliza a imagem de fundo
      }}
    >
      <div className="bg-brand-card shadow-2xl rounded-lg p-8 w-full max-w-md bg-opacity-90 border-2 border-brand-accent">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <a href="/">
            <img
              src="../images/images-login/logo-projeto.png"
              alt="Games CAF Logo"
              className="w-28 h-28 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
          </a>
        </div>

        {/* Título Animado */}
        <h2 className="title-jump text-4xl font-tech font-bold text-white text-center mb-2 flex justify-center gap-2">
          <span>G</span>
          <span>A</span>
          <span>M</span>
          <span>E</span>
          <span>S</span>
          <span className="ml-3">C</span>
          <span>A</span>
          <span>F</span>
        </h2>
        <p className="text-gray-300 text-center mb-6">Login</p>

        {/* Formulário */}
        <form id="login-form" onSubmit={handleSubmit}>
          {/* Input ID/Email */}
          <div className="mb-4">
            <label htmlFor="userid" className="sr-only">ID</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                id="userid"
                name="userid"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent hover:ring-2 hover:ring-brand-accent transition-all duration-300"
                placeholder="Digite seu ID"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Input Senha */}
          <div className="mb-6">
            <label htmlFor="password" className="sr-only">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300"
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-2">
              <a
                href="/esqueceusenha"
                className="inline-block text-sm text-brand-accent underline hover:text-cyan-300 transform transition-all duration-300 hover:scale-105"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          {/* Botão Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-brand-highlight to-brand-card opacity-80 border-2 border-black transform transition duration-300 ease-in-out hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-75 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        {/* Login Google */}
        <div className="mt-8">
          <a
            href="http://localhost:5000/api/login"
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-3 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="ml-1">Entrar com o Google</span>
          </a>
        </div>

        {/* Rodapé Cadastre-se */}
        <p className="text-center text-gray-300 mt-8 text-sm">
          Ainda não tem cadastro?{' '}
          <a
            href="/cadastro"
            className="inline-block font-medium text-brand-accent underline hover:text-cyan-300 transform transition-all duration-300 hover:scale-105"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;