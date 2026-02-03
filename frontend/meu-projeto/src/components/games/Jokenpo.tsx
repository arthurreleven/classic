import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Tipagem para as jogadas
type Jogada = 'pedra' | 'papel' | 'tesoura';
type ResultadoStatus = 'vitoria' | 'derrota' | 'empate' | 'neutro';

const Jokenpo: React.FC = () => {
  // --- ESTADOS (Substituem as variáveis globais e manipulação de DOM) ---
  const [placar, setPlacar] = useState({ usuario: 0, empate: 0, maquina: 0 });
  const [maoUsuario, setMaoUsuario] = useState<string>('✊');
  const [maoMaquina, setMaoMaquina] = useState<string>('✊');
  const [mensagem, setMensagem] = useState<string>('Escolha sua jogada abaixo!');
  const [statusResultado, setStatusResultado] = useState<ResultadoStatus>('neutro');
  
  // Estados de controle da interface
  const [jogando, setJogando] = useState(false); // Substitui 'jogoAtivo' e 'desabilitarBotoes'
  const [animando, setAnimando] = useState(false); // Controla a classe 'shaking'

  const emojis: Record<string, string> = { pedra: '✊', papel: '✋', tesoura: '✌️' };

  // --- 3. O "CÉREBRO" DA IA (Convertido para função interna) ---
  const obterJogadaIA = async (escolhaUsuario: string): Promise<Jogada> => {
    try {
      const resposta = await fetch('http://localhost:5000/jokenpo/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'escolha_usuario': escolhaUsuario })
      });

      if (!resposta.ok) throw new Error('Erro IA');
      const dados = await resposta.json();
      return dados.jogada_maquina as Jogada;

    } catch (error) {
      console.error("Erro na IA (usando aleatório):", error);
      const opcoes: Jogada[] = ['pedra', 'papel', 'tesoura'];
      return opcoes[Math.floor(Math.random() * opcoes.length)];
    }
  };

  // --- 4. FUNÇÕES DO JOGO ---
  const jogar = (escolhaUsuario: Jogada) => {
    if (jogando) return; // Previne múltiplos cliques
    
    setJogando(true);
    setAnimando(true);
    setStatusResultado('neutro');

    // Estado inicial da animação (Mãos fechadas)
    setMaoUsuario(emojis['pedra']);
    setMaoMaquina(emojis['pedra']);
    setMensagem('Jo...');

    // Dispara a busca na API imediatamente (Promise)
    const promessaIA = obterJogadaIA(escolhaUsuario);

    // Sequência de tempos (Timers)
    setTimeout(() => {
        setMensagem('Ken...');
    }, 500);

    setTimeout(async () => {
        setMensagem('PÔ!');
        
        // Aguarda ou recupera o resultado da IA
        const escolhaMaquina = await promessaIA;

        // Para animação e mostra mãos reais
        setAnimando(false);
        setMaoUsuario(emojis[escolhaUsuario]);
        setMaoMaquina(emojis[escolhaMaquina]);

        // Verifica vencedor
        processarResultado(escolhaUsuario, escolhaMaquina);
        
        setJogando(false);
    }, 1000);
  };

  const processarResultado = (usuario: Jogada, maquina: Jogada) => {
    if (usuario === maquina) {
        setMensagem('EMPATE!');
        setStatusResultado('empate');
        setPlacar(prev => ({ ...prev, empate: prev.empate + 1 }));
    } else if (
        (usuario === 'pedra' && maquina === 'tesoura') ||
        (usuario === 'papel' && maquina === 'pedra') ||
        (usuario === 'tesoura' && maquina === 'papel')
    ) {
        setMensagem('VOCÊ VENCEU!');
        setStatusResultado('vitoria');
        setPlacar(prev => ({ ...prev, usuario: prev.usuario + 1 }));
    } else {
        setMensagem('MÁQUINA VENCEU!');
        setStatusResultado('derrota');
        setPlacar(prev => ({ ...prev, maquina: prev.maquina + 1 }));
    }
  };

  const reiniciarJogo = () => {
    if (jogando) return;
    setPlacar({ usuario: 0, empate: 0, maquina: 0 });
    setMaoUsuario('✊');
    setMaoMaquina('✊');
    setMensagem('Escolha sua jogada abaixo!');
    setStatusResultado('neutro');
  };

  const sair = () => window.location.href = '../index.html';

  // Helper para cores baseadas no resultado
  const getCorMensagem = () => {
      switch (statusResultado) {
          case 'vitoria': return 'text-brand-accent';
          case 'derrota': return 'text-brand-highlight';
          case 'empate': return 'text-white';
          default: return 'text-brand-text';
      }
  };

  const handleExit = () => {
    // Redireciona para a home
    window.location.href = '/';
  };

  return (
    <div 
      // 1. ADICIONADO: flex e flex-col para organizar o layout verticalmente
      className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-x-hidden flex flex-col"
      style={{ backgroundImage: "url('./images/jokenpo/fundo-site.jpg')" }} 
    >
      
      {/* HEADER */}
      <header className="w-full bg-[#00020D] relative z-20 shadow-lg"> {/* Aumentei z-index pra garantir que fique acima */}
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
      <button onClick={handleExit} className="fixed left-[30px] bottom-[30px] px-6 py-2 bg-red-600/80 text-white font-bold text-lg rounded-xl border-2 border-white/20 hover:bg-red-500 transition-all z-50">Sair do Jogo</button>

      {/* 2. ÁREA PRINCIPAL (WRAPPER DO JOGO)
          - flex-1: Ocupa todo o espaço vertical que sobra depois do header.
          - flex items-center justify-center: Centraliza o filho (Game Container) na tela.
      */}
      <main className="flex-1 flex items-center justify-center w-full p-4 relative z-10">
        
        {/* GAME CONTAINER (O seu container original) */}
        <div className="bg-[rgba(0,28,95,0.9)] border border-brand-accent rounded-[20px] shadow-[0_10px_30px_rgba(6,182,212,0.15)] p-4 px-6 text-center w-[95%] max-w-[450px]">
        
            <img 
                src="images/jokenpo/logo-projeto.png" 
                alt="Logo Games CAF" 
                className="w-[100px] h-auto mb-1 mx-auto"
                style={{ filter: 'drop-shadow(0 0 8px #06B6D4)' }} 
            />

            <h1 className="text-[1.7em] mt-0 mb-1.5 animate-pulse-glow">JOKENPÔ</h1>
            
            <p className="text-[0.85em] text-[#e0e0e0] mt-[5px] mb-2">
                A máquina está tentando aprender seus padrões. Jogue para vencê-la!
            </p>

            {/* ÁREA DAS MÃOS */}
            <div className="flex justify-around items-center my-3 gap-[15px]">
            <div className="text-center">
                <span className={`block text-[55px] w-[75px] h-[75px] leading-[75px] mb-[5px] ${animando ? 'animate-shake' : ''}`}>
                    {maoUsuario}
                </span>
                <p className="text-[0.85em] font-bold">Você</p>
            </div>
            
            <p className="text-[1.5em] font-bold text-brand-accent">VS</p>
            
            <div className="text-center">
                <span className={`block text-[55px] w-[75px] h-[75px] leading-[75px] mb-[5px] ${animando ? 'animate-shake' : ''}`}>
                    {maoMaquina}
                </span>
                <p className="text-[0.85em] font-bold">Máquina</p>
            </div>
            </div>

            {/* MENSAGEM RESULTADO */}
            <div className="my-2 p-2 rounded-[10px] bg-brand-dark border border-brand-card min-h-[50px] flex items-center justify-center">
            <h2 className={`text-[1.2em] font-bold m-0 ${getCorMensagem()}`}>
                {mensagem}
            </h2>
            </div>

            {/* BOTÕES */}
            <div className="my-3 flex justify-center gap-2">
            {(['pedra', 'papel', 'tesoura'] as Jogada[]).map((opcao) => (
                <button 
                    key={opcao}
                    onClick={() => jogar(opcao)}
                    disabled={jogando}
                    className={`text-[0.95em] px-3.5 py-[7px] border-none rounded-[10px] font-bold transition-all shadow-md
                        ${jogando 
                            ? 'bg-[#555] text-[#999] cursor-not-allowed' 
                            : 'bg-brand-highlight text-brand-text cursor-pointer hover:bg-[#E65A36] hover:-translate-y-[3px]'
                        }`}
                >
                    {opcao.charAt(0).toUpperCase() + opcao.slice(1)} {emojis[opcao]}
                </button>
            ))}
            </div>

            {/* PLACAR */}
            <div className="mt-3 text-[1.0em] bg-brand-dark p-3 rounded-[10px] border border-brand-card">
            <h3 className="mt-0 mb-[5px] text-brand-accent text-[1.1em]">Placar</h3>
            <p className="m-0 text-[0.9em]">
                Você: <span className="font-bold">{placar.usuario}</span> | 
                Empates: <span className="font-bold">{placar.empate}</span> | 
                Máquina: <span className="font-bold">{placar.maquina}</span>
            </p>
            <button 
                onClick={reiniciarJogo}
                disabled={jogando}
                className={`mt-3 px-3 py-[7px] text-[0.85em] border-none rounded-lg font-bold transition-all shadow-sm
                    ${jogando
                        ? 'bg-[#555] text-[#999] cursor-not-allowed'
                        : 'bg-brand-accent text-brand-dark cursor-pointer hover:bg-[#05A0BB] hover:-translate-y-[2px]'
                    }`}
            >
                Reiniciar Jogo
            </button>
            </div>
        </div>

        {/* ELEMENTOS LATERAIS (Decoração) */}
      {/* Mudei para 'hidden lg:block' (visível em telas > 1024px) */}
      <div className="hidden lg:block pointer-events-none">
        
        {/* Logo Esquerda */}
        <img 
          src="/logo-projeto.png" 
          alt="Decoration Left" 
          className="fixed top-1/2 left-[50px] -translate-y-1/2 w-[180px] opacity-[0.15] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] -z-0 grayscale" 
        />
        
        {/* Logo Direita */}
        <img 
          src="/logo-projeto.png" 
          alt="Decoration Right" 
          className="fixed top-1/2 right-[50px] -translate-y-1/2 w-[180px] opacity-[0.15] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] -z-0 grayscale" 
        />
      </div>
      </main>

    </div>
  );
};

export default Jokenpo;