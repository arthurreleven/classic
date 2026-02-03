import React, { useState, FormEvent } from 'react';
import './Style.css';

function EsqueceuSenha() {
  // Estados
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Função de envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulação de chamada API para enviar o email de recuperação
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes.");
        setEmail(''); // Limpa o campo após o envio
      } else {
        alert(data.error || "Erro ao processar solicitação.");
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center bg-[#040826] text-white font-sans relative overflow-x-hidden"
      style={{ 
        backgroundImage: "url('../images/images-login/background-tech.png')", // Caminho ajustado para o padrão React
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
          <span>G</span><span>A</span><span>M</span><span>E</span><span>S</span>
          <span className="ml-3">C</span><span>A</span><span>F</span>
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Recuperar Senha
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
            
          {/* Input Email */}
          <div className="mb-8">
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300"
                placeholder="Digite seu email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Botão Submit */}
          <div className="mb-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-brand-highlight to-brand-card opacity-80 border-2 border-black transform transition duration-300 ease-in-out hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-75 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </div>
        </form>

        {/* Rodapé Voltar Login */}
        <p className="text-center text-gray-300 mt-8 text-sm">
          Lembrou a senha?{' '}
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

export default EsqueceuSenha;