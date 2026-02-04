import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Certifique-se de ter o react-router-dom instalado

// --- Interfaces ---
interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
  velocityY?: number; // Para a gravidade do pulo
  src?: HTMLImageElement; // Para desenhar a imagem correta
}

const MarioJump: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const restartGameRef = useRef<() => void>(() => {});

  // Controle se o jogo começou ou se está em Game Over (para UI fora do canvas se precisar)
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 1. Carregamento de Assets ---
    const loadImg = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };

    // Use seus caminhos corretos aqui (assumindo src/assets movidos para public ou imports)
    // Se estiver na pasta public:
    const marioImg = loadImg('/images/mario/mario.gif'); // Nota: No canvas, GIF estático (primeiro frame)
    const pipeImg = loadImg('/images/mario/pipe.png');
    const cloudsImg = loadImg('/images/mario/clouds.png');
    const gameOverImg = loadImg('/images/mario/game-over.png');

    // --- 2. Variáveis de Estado (Mutable) ---
    let animationFrameId: number;
    let score = 0;
    let gameRunning = true;
    let frames = 0;

    // Configurações do Jogo
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12; // Força do pulo (negativo vai pra cima)
    const FLOOR_Y = canvas.height - 90; // Onde é o chão (ajuste conforme a altura do canvas)

    // Entidades
    let mario: Entity = {
      x: 50,
      y: FLOOR_Y,
      width: 80,  // Ajuste visual
      height: 80, // Ajuste visual
      velocityY: 0,
      src: marioImg
    };

    let pipe: Entity = {
      x: canvas.width,
      y: FLOOR_Y + 10, // Ajuste para alinhar ao chão
      width: 60,
      height: 80,
      speed: 6,
      src: pipeImg
    };

    let clouds: Entity = {
        x: canvas.width,
        y: 50,
        width: 550,
        height: 200, // altura estimada
        speed: 1.5,
        src: cloudsImg
    };

    // --- 3. Funções de Lógica ---
    const restartGame = () => {
      cancelAnimationFrame(animationFrameId);

      score = 0;
      setCurrentScore(0);
      gameRunning = true;
      setIsGameOver(false);
      
      // Reset posições
      mario.y = FLOOR_Y;
      mario.velocityY = 0;
      mario.src = marioImg; // Volta imagem original
      
      mario.width = 80;
      mario.height = 80;

      pipe.x = canvas.width;
      pipe.speed = 6;

      loop();
    };
    
    restartGameRef.current = restartGame;

    const jump = () => {
      // Só pula se estiver no chão
      if (mario.y >= FLOOR_Y) {
        mario.velocityY = JUMP_FORCE;
      }
    };

    const collide = (rect1: Entity, rect2: Entity) => {
      // Ajuste de hitbox (padding) para não ser injusto
      const padding = 15; 
      return (
        rect1.x < rect2.x + rect2.width - padding &&
        rect1.x + rect1.width > rect2.x + padding &&
        rect1.y < rect2.y + rect2.height - padding &&
        rect1.y + rect1.height > rect2.y + padding
      );
    };

    // --- 4. Controles ---
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lista de teclas que queremos bloquear a rolagem
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault(); // <--- O SEGREDO ESTÁ AQUI
      }

      if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        if (gameRunning) jump();
        else if (!gameRunning && e.key === 'Enter') restartGame();
      }
    };
    
    // Suporte a toque (Mobile)
    const handleTouch = () => {
        if (gameRunning) jump();
        else restartGame();
    }

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch);

    // --- 5. GAME LOOP ---
    const loop = () => {
      // Limpa a tela
      // Fundo degradê estilo CSS (Sky Blue)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(0.8, "#E0F6FF");
      gradient.addColorStop(0.8, "#1bca0b"); // Chão verde
      gradient.addColorStop(1, "#1bca0b");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Movimento das Nuvens (Parallax)
      clouds.x -= (clouds.speed || 1);
      if (clouds.x < -clouds.width) {
          clouds.x = canvas.width;
      }

      if (gameRunning) {
        // --- Atualiza Lógica ---
        
        // Física do Mario (Gravidade)
        mario.velocityY = (mario.velocityY || 0) + GRAVITY;
        mario.y += mario.velocityY;

        // Impedir que caia do chão
        if (mario.y >= FLOOR_Y) {
          mario.y = FLOOR_Y;
          mario.velocityY = 0;
        }

        // Movimento do Cano
        pipe.x -= (pipe.speed || 5);
        
        // Loop do cano
        if (pipe.x < -pipe.width) {
            pipe.x = canvas.width;
            score++;
            setCurrentScore(score);
            // Aumenta dificuldade a cada 5 pontos
            if (score % 5 === 0) pipe.speed = (pipe.speed || 5) + 1; 
        }


        // Colisão (Game Over)
        if (collide(mario, pipe)) {
            gameRunning = false;
            setIsGameOver(true);
            mario.src = gameOverImg; // Troca sprite
            // Pequeno ajuste visual na morte
            mario.width = 50; 
        }

        frames++;
      }

      // --- Desenha Elementos ---

      // 1. Nuvens (desenha duas vezes para loop infinito suave se quiser, aqui simplificado)
      if (clouds.src) ctx.drawImage(clouds.src, clouds.x, 50, clouds.width, 200);

      // 2. Cano
      if (pipe.src) ctx.drawImage(pipe.src, pipe.x, pipe.y, pipe.width, pipe.height);

      // 3. Mario
      if (mario.src) ctx.drawImage(mario.src, mario.x, mario.y, mario.width, mario.height);

      // 4. HUD (Score)
      ctx.fillStyle = "#333";
      ctx.font = "bold 20px Arial";
      ctx.fillText(`Score: ${score}`, 20, 40);



      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Array vazio = mount único

  const handleExit = () => {
    window.location.href = '/';
  };

  const handleRestartClick = () => {
    if (restartGameRef.current) {
        restartGameRef.current();
    }
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

      {/* ÁREA DO JOGO */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-12 min-h-[80vh]">
        
        {/* Container do Canvas com brilho */}
        <div className="relative group">
            {/* Glow effect atrás do canvas */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            
            <canvas 
                ref={canvasRef} 
                width={800} // Largura interna do jogo
                height={500} // Altura interna do jogo
                className="relative block bg-white rounded-md shadow-2xl cursor-pointer max-w-full h-auto border-4 border-[#333]"
            />
            {/* --- AQUI ESTÁ A MÁGICA: OVERLAY DE GAME OVER --- */}
            {isGameOver && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 rounded-md b animate-fadeIn">
                    <h2 className="text-6xl text-red-500 font-bold mb-4 drop-shadow-[0_2px_0_#fff]">GAME OVER</h2>
                    <p className="text-2xl text-white mb-8">Sua pontuação: {currentScore}</p>
                    
                    <button 
                        onClick={handleRestartClick}
                        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 border-4 border-white"
                    >
                        🔄 REINICIAR
                    </button>
                </div>
            )}
        </div>

        <p className="mt-6 text-gray-400 text-lg tracking-widest font-mono">
            PULAR: <span className="text-[#00aaff] font-bold">ESPAÇO</span> ou <span className="text-[#00aaff] font-bold">SETAS</span>
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

export default MarioJump;