import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Interfaces
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface Examples {
  [key: string]: string;
}

const Suporte: React.FC = () => {
  // --- Estados ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! 👋 Eu sou o assistente virtual da @GameCaf.\nComo posso ajudar hoje?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const API_URL = "http://127.0.0.1:5000/predict-suporte";

  const exemplos: Examples = {
    email: "Não consigo recuperar meu e-mail, como faço?",
    senha: "Esqueci minha senha, como recupero?",
    conta: "Quero trocar meu nome de usuário.",
    jogo: "O jogo está travando aqui."
  };

  // --- Efeitos ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- Handlers ---
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setInputText(exemplos[category] || "");
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText;
    const newMessage: Message = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: userText })
      });

      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const data = await res.json();
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.resposta, sender: 'bot' }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Erro ao conectar à API.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleExit = () => {
    // Redireciona para a home
    window.location.href = '/';
  };

  // --- Renderização ---
  return (
    // 1. Adicionado 'flex flex-col' para organizar Header e Conteúdo verticalmente
    <div className="w-screen min-h-screen bg-[#040826] text-white font-sans relative overflow-x-hidden flex flex-col">
      
      {/* HEADER */}
      <header className="w-full bg-[#00020D] font-bangers relative z-20 shrink-0">
        <div className="w-full px-6 py-4 flex items-center">
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="w-35 h-18 flex items-center justify-center cursor-pointer">
              <img src="/images/images-login/logo-projeto.png" alt="Logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          <nav className="ml-20 flex items-center gap-12 text-3xl">
            <Link to="/" className="cursor-pointer hover:text-orange-400 transition">Jogos</Link>
            <Link to="/conta" className="cursor-pointer hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="cursor-pointer text-orange-400">Sobre</Link>
            <Link to="/suporte" className="cursor-pointer text-orange-400">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
            <Link to="/labia" className="hover:text-orange-400 transition">IA</Link>
          </nav>

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

      {/* BOTÃO SAIR */}
      <button onClick={handleExit} className="fixed left-[30px] bottom-[30px] px-6 py-2 bg-red-600/80 text-white font-bold text-lg rounded-xl border-2 border-white/20 hover:bg-red-500 transition-all z-50">
        Sair do Jogo
      </button>

      {/* 2. Wrapper de Centralização (<main>):
         - flex-1: Ocupa todo o espaço vertical que sobra abaixo do header.
         - flex items-center justify-center: Centraliza o filho (box de suporte) no meio desse espaço.
         - p-4: Garante um respiro nas bordas em telas menores.
         - relative z-10: Garante que fique acima das decorações de fundo.
      */}
      <main className="flex-1 w-full flex items-center justify-center p-4 relative z-10">
        
        {/* CONTAINER PRINCIPAL (Box do Suporte) */}
        <div className="w-full max-w-[600px] bg-white/[0.03] rounded-xl p-6 shadow-[0_8px_30px_rgba(2,6,23,0.6)] border border-white/[0.03]">
          
          <h2 className="m-0 mb-2.5 text-2xl font-bold">Central de Suporte — GameCaf</h2>

          <p className="m-0 mb-4 text-[#bcd3ff] text-[15px]">
            Bem-vindo(a) ao sistema de atendimento inteligente da <strong>@GameCaf</strong>.<br />
            Escolha uma categoria ou envie sua dúvida.
          </p>

          {/* BOTÕES DE CATEGORIA */}
          <div className="flex gap-2.5 mb-3.5">
            {Object.keys(exemplos).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`
                  px-3 py-2 rounded-[10px] cursor-pointer font-semibold text-[13px] border transition-all duration-200
                  ${activeCategory === cat 
                    ? 'bg-[#2563eb] text-white border-transparent shadow-[0_6px_18px_rgba(124,58,237,0.18)]' 
                    : 'bg-white/[0.03] text-[#dbeafe] border-white/[0.04] hover:bg-white/10'}
                `}
              >
                {cat === 'email' && '✉️'} {cat === 'senha' && '🔒'}
                {cat === 'conta' && '👤'} {cat === 'jogo' && '🎮'}
                {' ' + cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* ÁREA DO CHAT */}
          <div className="rounded-[10px] bg-[#040817]/45 p-4 min-h-[220px] max-h-[420px] overflow-y-auto mb-3.5 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 mb-3 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  px-3 py-2.5 max-w-[82%] text-sm leading-[1.3] shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-[#ff663d] text-[#002222] rounded-[10px_10px_2px_10px]' 
                    : 'bg-white/[0.08] text-[#e6eef8] rounded-[10px_10px_10px_2px]'}
                `}>
                  {msg.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                          {line}
                          {i !== msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 mb-3 justify-start">
                <div className="px-3 py-2.5 bg-white/[0.08] text-[#e6eef8] rounded-[10px_10px_10px_2px] text-sm">
                  <em className="animate-pulse">… processando</em>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* COMPOSER (Input) */}
          <div className="flex gap-2.5 items-center">
            <input
              type="text"
              placeholder="Digite sua mensagem aqui..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 p-2.5 rounded-[10px] border-none outline-none text-sm bg-white/[0.06] text-[#e6eef8] placeholder-slate-400 focus:ring-1 focus:ring-white/20 transition-all"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-[10px] border-none bg-[#00e0b8] text-[#002222] font-bold cursor-pointer hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              Enviar
            </button>
          </div>

          <div className="mt-3 text-xs text-[#9fb7ff]">
            Projeto desenvolvido pela equipe <strong>@GameCaf</strong><br />
            Trabalho acadêmico apresentado na <strong>@UniFecaf</strong>
          </div>
        </div>
      </main>

      {/* ELEMENTOS LATERAIS (Decoração) */}
      <div className="hidden lg:block pointer-events-none z-0">
        
        {/* Logo Esquerda */}
        <img 
          src="/logo-projeto.png" 
          alt="Decoration Left" 
          className="fixed top-1/2 left-[50px] -translate-y-1/2 w-[180px] opacity-[0.15] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] grayscale" 
        />
        
        {/* Logo Direita */}
        <img 
          src="/logo-projeto.png" 
          alt="Decoration Right" 
          className="fixed top-1/2 right-[50px] -translate-y-1/2 w-[180px] opacity-[0.15] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] grayscale" 
        />
      </div>
    </div>
  );
};

export default Suporte;