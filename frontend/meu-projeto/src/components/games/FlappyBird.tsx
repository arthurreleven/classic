import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; 

export const FlappyBird: React.FC = () => {
  // --- Referências ---
  const birdRef = useRef<HTMLImageElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const scoreValRef = useRef<HTMLSpanElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<'Start' | 'Play' | 'End'>('Start');

  const soundPoint = useRef(typeof Audio !== "undefined" ? new Audio('/sounds/flappy/point.mp3') : null);
  const soundDie = useRef(typeof Audio !== "undefined" ? new Audio('/sounds/flappy/die.mp3') : null);

  // --- CONFIGURAÇÃO DE ESTILOS ---
  // AUMENTAMOS O TAMANHO DOS CANOS PARA COMPENSAR A TELA GRANDE
  // left-full = começa fora da tela à direita
  // --- CONFIGURAÇÃO DE ESTILOS ---
  const PIPE_WIDTH = 100; // Ajustei para ficar mais largo, parecido com o "6vw" do antigo
  // 1. A Borda (border: 5px solid black) vira Tailwind: border-[5px] border-black
  // 2. A Sombra (box-shadow) é o shadow-lg
  const PIPE_CLASS = `absolute left-full w-[${PIPE_WIDTH}px] h-[70%] border-[5px] border-black z-30 shadow-lg`;
  // 3. O Fundo (background) vira essa string exata do seu CSS antigo
  const PIPE_BG_STYLE = "radial-gradient(circle, lightgreen 50%, green)";

  useEffect(() => {
    let birdDy = 0;
    let score = 0;
    let isGamePlaying = false;
    
    const moveSpeed = 4;
    const gravity = 0.4; 
    const pipeGap = 35; 
    let pipeSeperation = 0;
    
    let moveReqId: number;
    let gravityReqId: number;
    let pipeReqId: number;

    const gameOver = () => {
      isGamePlaying = false;
      setGameState('End');
      
      // --- DESTRAVA O SCROLL AO MORRER ---
      document.body.style.overflow = 'auto'; 
      
      if (messageRef.current) {
        messageRef.current.innerHTML = '<div class="text-red-500 text-4xl font-bold font-bangers">GAME OVER</div><span class="block text-lg mt-4 text-white/90">Pressione ENTER para reiniciar</span>';
        messageRef.current.classList.remove('hidden');
      }
      
      if (soundDie.current) soundDie.current.play();
      if (birdRef.current) birdRef.current.style.display = 'none';
    };

    const move = () => {
      if (!isGamePlaying || !gameContainerRef.current) return;
      // ... (código do move permanece igual) ...
      // Para economizar espaço, mantenha a lógica do move() que você já tem aqui
      // Apenas certifique-se de copiar o conteúdo da versão anterior
      const pipes = gameContainerRef.current.querySelectorAll('[data-pipe="true"]');
      const birdProps = birdRef.current?.getBoundingClientRect();

      if (!birdProps) return;

      pipes.forEach((element: any) => {
        const pipeProps = element.getBoundingClientRect();
        let currentLeft = parseFloat(element.style.left);
        if (isNaN(currentLeft)) currentLeft = gameContainerRef.current!.offsetWidth;

        const containerLeft = gameContainerRef.current!.getBoundingClientRect().left;
        if (pipeProps.right < containerLeft) {
             element.remove();
             return;
        } 

        if (
            birdProps.left < pipeProps.left + pipeProps.width &&
            birdProps.left + birdProps.width > pipeProps.left &&
            birdProps.top < pipeProps.top + pipeProps.height &&
            birdProps.top + birdProps.height > pipeProps.top
        ) {
            gameOver();
            return;
        }

        if (
            pipeProps.right < birdProps.left &&
            pipeProps.right + moveSpeed >= birdProps.left &&
            element.getAttribute('data-score') === '1'
        ) {
            score++;
            if (scoreValRef.current) scoreValRef.current.innerText = score.toString();
            if (soundPoint.current) soundPoint.current.play();
        }
        element.style.left = (element.offsetLeft - moveSpeed) + 'px';
      });
      moveReqId = requestAnimationFrame(move);
    };

    const applyGravity = () => {
      if (!isGamePlaying || !birdRef.current || !gameContainerRef.current) return;
      
      birdDy = birdDy + gravity;

      const birdProps = birdRef.current.getBoundingClientRect();
      const containerProps = gameContainerRef.current.getBoundingClientRect();

      if (birdProps.top <= containerProps.top || birdProps.bottom >= containerProps.bottom) {
        gameOver();
        return;
      }

      birdRef.current.style.top = (birdRef.current.offsetTop + birdDy) + 'px';
      gravityReqId = requestAnimationFrame(applyGravity);
    };

    const createPipe = () => {
      // ... (código do createPipe permanece igual) ...
      // Copie a lógica do createPipe da resposta anterior
      if (!isGamePlaying) return;

      if (pipeSeperation > 115) { 
        pipeSeperation = 0;
        const pipePosi = Math.floor(Math.random() * 40) + 10; 

        if (gameContainerRef.current) {
            const containerWidth = gameContainerRef.current.offsetWidth;
            const pipeInv = document.createElement('div');
            pipeInv.className = PIPE_CLASS;
            pipeInv.style.background = PIPE_BG_STYLE;
            pipeInv.style.top = (pipePosi - 70) + '%'; 
            pipeInv.style.left = containerWidth + 'px';
            pipeInv.setAttribute('data-pipe', 'true');
            gameContainerRef.current.appendChild(pipeInv);

            const pipe = document.createElement('div');
            pipe.className = PIPE_CLASS;
            pipe.style.background = PIPE_BG_STYLE;
            pipe.style.top = (pipePosi + pipeGap) + '%';
            pipe.style.left = containerWidth + 'px';
            pipe.setAttribute('data-pipe', 'true');
            pipe.setAttribute('data-score', '1');
            gameContainerRef.current.appendChild(pipe);
        }
      }
      pipeSeperation++;
      pipeReqId = requestAnimationFrame(createPipe);
    };

    const startGame = () => {
      // --- TRAVA O SCROLL AO INICIAR ---
      // Isso impede fisicamente que a página role enquanto joga
      document.body.style.overflow = 'hidden';

      if (gameContainerRef.current) {
         gameContainerRef.current.querySelectorAll('[data-pipe="true"]').forEach((e) => e.remove());
      }
      
      isGamePlaying = true;
      birdDy = 0;
      score = 0;
      setGameState('Play');

      if (birdRef.current) {
        birdRef.current.style.display = 'block';
        birdRef.current.style.top = '40%'; 
      }
      if (messageRef.current) {
        messageRef.current.classList.add('hidden');
      }
      if (scoreValRef.current) scoreValRef.current.innerText = '0';

      requestAnimationFrame(move);
      requestAnimationFrame(applyGravity);
      requestAnimationFrame(createPipe);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // --- CORREÇÃO ROBUSTA DE SCROLL ---
      // Verifica todas as variações possíveis da tecla de espaço e setas
      if (
        e.code === 'Space' || 
        e.key === ' ' || 
        e.code === 'ArrowUp' || 
        e.code === 'ArrowDown' ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
          if (!isGamePlaying) startGame();
      }
      
      // Pulo: Aceita 'Space', 'ArrowUp' ou a string ' '
      if ((e.code === 'ArrowUp' || e.code === 'Space' || e.key === ' ') && isGamePlaying) {
        if(birdRef.current) birdRef.current.src = 'images/flappy/Bird-2.png';
        birdDy = -7.6;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.code === 'ArrowUp' || e.code === 'Space' || e.key === ' ') && isGamePlaying) {
        if(birdRef.current) birdRef.current.src = 'images/flappy/Bird.png';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(moveReqId);
      cancelAnimationFrame(gravityReqId);
      cancelAnimationFrame(pipeReqId);
      
      // GARANTE QUE O SCROLL VOLTE AO SAIR DA PÁGINA
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleExit = () => {
      window.location.href = '/';
  };

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-x-hidden">
      
      {/* HEADER */}
      <header className="w-full bg-[#00020D] relative z-10">
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
      <button onClick={handleExit} className="fixed left-[30px] bottom-[30px] px-6 py-2 bg-red-600/80 text-white font-bold text-lg rounded-xl border-2 border-white/20 hover:bg-red-500 transition-all z-40">Sair do Jogo</button>

      {/* ▬▬▬ ÁREA DO JOGO (GRANDE) ▬▬▬ */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4">        
        <div className="relative group w-[95%] max-w-[1200px]">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            {/* CONTAINER PRINCIPAL DO JOGO */}
            {/* Altura: 75vh (bem grande) | Largura: 100% do pai (limitado a 1200px) */}
            <div 
                ref={gameContainerRef}
                className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] overflow-hidden 
                bg-[url('images/flappy/background-img.jpeg')] bg-cover bg-center bg-no-repeat
                border-[4px] border-[#00ffff] rounded-lg shadow-[0_0_40px_rgba(0,255,255,0.3)]"
                >
                  
                {/* Overlay Escuro para contraste */}
                <div className="absolute inset-0 bg-black/20 z-0"></div>

                {/* Logo Central */}
                {gameState === 'Start' && (
                    <img 
                        src="images/flappy/logo.png" 
                        className="absolute top-1/2 left-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2 opacity-20 rotate-[-10deg] z-10" 
                        alt="Logo Start" 
                    />
                )}

                {/* Pássaro (Tamanho fixo 60px para não deformar em telas grandes) */}
                <img 
                    ref={birdRef} 
                    src="images/flappy/Bird.png" 
                    alt="bird" 
                    className="absolute w-[70px] h-auto left-[15%] z-20 hidden drop-shadow-lg" 
                    id="bird-1" 
                />

                {/* Mensagens */}
                <div 
                    ref={messageRef}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                bg-black/85 border border-[#00e5ff] text-[#00e5ff] py-10 px-16 rounded-2xl 
                                text-center shadow-[0_0_30px_rgba(0,229,255,0.5)] z-50 whitespace-nowrap
                                ${gameState !== 'Start' && gameState !== 'End' ? 'hidden' : ''}`}
                >
                    {gameState === 'Start' && (
                    <>
                        <div className="text-4xl font-bold tracking-[0.2em] mb-2 font-mono">FLAPPY BIRD</div>
                        <span className="block text-sm text-white/80 uppercase tracking-widest animate-pulse">Pressione ENTER para iniciar</span>
                    </>
                    )}
                </div>

                {/* Pontuação */}
                <div className="absolute top-6 w-full text-center z-40 pointer-events-none select-none">
                    <span className="text-6xl font-black text-white drop-shadow-[4px_4px_0_#000]">
                        <span ref={scoreValRef} className="text-yellow-400">0</span>
                    </span>
                </div>

            </div>
        </div>

        {/* Instruções */}
        <p className="mt-4 text-[#00eaff] text-xl tracking-widest drop-shadow-[0_0_8px_#00eaff] bg-black/60 px-6 py-2 rounded-full border border-[#00eaff]/30">
            PULAR: <span className="text-white font-bold mx-1">ESPAÇO</span> ou <span className="text-white font-bold mx-1">SETA CIMA</span>
        </p>

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

        {/* Textos GAMES / CAF (Fundo) */}
        <h3 className="fixed top-1/2 -translate-y-1/2 left-[30px] text-[4rem] font-bold text-[#ffffff]/5 tracking-[10px] select-none rotate-90 -z-10">
          GAMES
        </h3>
        <h3 className="fixed top-1/2 -translate-y-1/2 right-[30px] text-[4rem] font-bold text-[#00c8ff]/5 tracking-[10px] select-none -rotate-90 -z-10">
          CAF
        </h3>
      </div>
    </div>
  );
};

export default FlappyBird;