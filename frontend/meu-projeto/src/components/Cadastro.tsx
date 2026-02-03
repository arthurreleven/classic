import React, { useState, FormEvent } from 'react';
import './Style.css';

function Cadastro() {
  // Estados para controlar os inputs
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Função de envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validação local: Senhas devem ser iguais
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      // Simulação de chamada API para cadastro
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userid: userId,
          email: email, 
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso! Faça login.");
        window.location.href = "/login"; // Redireciona para o login
      } else {
        alert(data.error || "Erro ao realizar cadastro.");
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
      className="w-screen min-h-screen flex items-center justify-center bg-[#040826] text-white font-sans relative overflow-x-hidden"
      style={{ 
        backgroundImage: "url('../images/images-login/background-tech.png')", // Caminho ajustado
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-brand-card shadow-2xl rounded-lg p-6 w-full max-w-md bg-opacity-90 border-2 border-brand-accent">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="../images/images-login/logo-projeto.png"
            alt="Games CAF Logo"
            className="w-24 h-24 transform transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Título Animado */}
        <h2 className="title-jump text-4xl font-tech font-bold text-white text-center mb-2 flex justify-center gap-2">
          <span>G</span><span>A</span><span>M</span><span>E</span><span>S</span>
          <span className="ml-3">C</span><span>A</span><span>F</span>
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Crie sua conta
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          
          {/* Input ID de Usuário */}
          <div className="mb-3">
            <label htmlFor="userid" className="sr-only">ID de usuario</label>
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
                placeholder="ID de usuario"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="mb-3">
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative group cursor-text">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                inputMode="email"     
                autoCapitalize="none"
                autoComplete="email"
                id="email"
                name="email"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent hover:ring-2 hover:ring-brand-accent transition-all duration-300"
                placeholder="Digite seu email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Input Senha */}
          <div className="mb-3">
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent hover:ring-2 hover:ring-brand-accent transition-all duration-300"
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Input Confirmar Senha */}
          <div className="mb-4">
            <label htmlFor="confirm-password" className="sr-only">Confirmar Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                // Lógica Visual: Borda vermelha se senhas diferentes
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  password !== confirmPassword && confirmPassword
                    ? 'border-red-500 focus:ring-red-500 ring-red-500' 
                    : 'border-gray-300 focus:ring-brand-accent hover:ring-brand-accent'
                }`}
                placeholder="Confirme sua senha"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Botão Submit */}
          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-brand-highlight to-brand-card opacity-80 border-2 border-black transform transition duration-300 ease-in-out hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-75 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>

        {/* Rodapé */}
        <p className="text-center text-gray-300 mt-2 text-sm">
          Já tem uma conta?{' '}
          <a
            href="/login"
            className="inline-block font-medium text-brand-accent underline hover:text-cyan-300 transform transition-all duration-300 hover:scale-105"
          >
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;