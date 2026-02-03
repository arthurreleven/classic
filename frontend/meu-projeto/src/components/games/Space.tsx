import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// --- Interfaces para Tipagem (TypeScript) ---
interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  life?: number;
  maxLife?: number;
  angle?: number; // Usado por mísseis/tiros do boss
  size?: number;  // Usado por corações/powerups
}

const SpaceHeroes: React.FC = () => {
  // Referência para manipular o Canvas diretamente (sem document.getElementById)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estado apenas para controle visual do Menu (não afeta o loop do jogo)
  const [activeMenu, setActiveMenu] = useState('jogar');

  // --- LÓGICA DO JOGO (Carrega apenas uma vez na montagem) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 1. Carregamento de Assets ---
    // Helper para carregar imagens
    const loadImg = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };

    // Caminhos absolutos (assumindo que estão na pasta /public)
    const bgImg = loadImg('/images/space/black.png');
    const shipImg = loadImg('/images/space/playerShip3_blue.png');
    const enemyImg = loadImg('/images/space/inimigo.png');
    const bossImg = loadImg('/images/space/ufoRed.png');
    const laserImg = loadImg('/images/space/laser.png');
    const enemyLaserImg = loadImg('/images/space/laser_inimigo.png');
    const bossMissileImg = loadImg('/images/space/missil_inimigo.png');
    const heartImg = loadImg('/images/space/vida.png');
    const powerImg = loadImg('/images/space/bonus.png');

    const laserSound = new Audio('/sounds/space/sfx_laser1.ogg');
    laserSound.volume = 0.3;

    // --- 2. Variáveis de Estado do Jogo (Mutable) ---
    // Usamos variáveis let em vez de useState para garantir performance (60 FPS)
    let animationFrameId: number;
    const intervalIds: NodeJS.Timeout[] = [];

    let player: Entity = { x: 180, y: 520, width: 40, height: 40, speed: 8, life: 100, maxLife: 100 };
    let bullets: Entity[] = [];
    let enemies: Entity[] = [];
    let enemyBullets: Entity[] = [];
    let bossMissiles: Entity[] = [];
    let hearts: Entity[] = [];
    let powers: Entity[] = [];
    let boss: Entity | null = null;

    let keys: { [key: string]: boolean } = {};
    let score = 0;
    let gameOver = false;
    let fireLevel = 1;

    // --- 3. Funções de Lógica ---
    const restartGame = () => {
      player.life = 100;
      player.x = 180;
      player.y = 520;
      score = 0;
      fireLevel = 1;
      boss = null;

      bullets = [];
      enemies = [];
      enemyBullets = [];
      bossMissiles = [];
      hearts = [];
      powers = [];

      gameOver = false;
      loop();
    };

    const checkBossSpawn = () => {
      if (score > 0 && score % 20 === 0 && !boss) {
        boss = {
          x: canvas.width / 2 - 80,
          y: -200,
          width: 160,
          height: 160,
          speed: 1,
          life: 300,
          maxLife: 300
        };
        enemies = [];
      }
    };

    const collide = (a: Entity, b: Entity) => {
      const aW = a.width || a.size || 0;
      const aH = a.height || a.size || 0;
      const bW = b.width || b.size || 0;
      const bH = b.height || b.size || 0;

      return (
        a.x < b.x + bW &&
        a.x + aW > b.x &&
        a.y < b.y + bH &&
        a.y + aH > b.y
      );
    };

    // --- 4. Controles ---
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (gameOver && e.key === 'Enter') restartGame();
    };
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- 5. Spawners (Intervals) ---
    // Inimigos
    intervalIds.push(setInterval(() => {
      if (!gameOver && !boss) {
        for (let i = 0; i < 3; i++) {
          enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: -Math.random() * 300,
            width: 50,
            height: 50,
            speed: 1.7,
            life: 3,
            maxLife: 3
          });
        }
      }
    }, 8000));

    // Vida
    intervalIds.push(setInterval(() => {
      if (!gameOver) {
        hearts.push({ x: Math.random() * (canvas.width - 30), y: -40, size: 30, width: 30, height: 30, speed: 2 });
      }
    }, 15000));

    // Bonus
    intervalIds.push(setInterval(() => {
      if (!gameOver) {
        powers.push({ x: Math.random() * (canvas.width - 30), y: -40, size: 30, width: 30, height: 30, speed: 2 });
      }
    }, 10000));

    // Tiro Player
    intervalIds.push(setInterval(() => {
      if (!gameOver) {
        const baseX = player.x + player.width / 2;
        const spread = 12;
        laserSound.currentTime = 0;
        laserSound.play().catch(() => {}); // Catch para evitar erros de autoplay

        for (let i = 0; i < fireLevel; i++) {
          bullets.push({
            x: baseX + (i - Math.floor(fireLevel / 2)) * spread,
            y: player.y,
            width: 6,
            height: 15,
            speed: 8
          });
        }
      }
    }, 250));

    // Tiro Inimigo
    intervalIds.push(setInterval(() => {
      enemies.forEach(e => {
        enemyBullets.push({ x: e.x + e.width / 2 - 3, y: e.y + e.height, width: 6, height: 15, speed: 5 });
      });
      if (boss) {
        for (let i = -2; i <= 2; i++) {
          enemyBullets.push({ x: boss.x + boss.width / 2, y: boss.y + boss.height, width: 6, height: 15, speed: 4, angle: i * 0.4 });
        }
      }
    }, 1200));

    // Mísseis Boss
    intervalIds.push(setInterval(() => {
      if (boss && !gameOver) {
        const activeBoss = boss; // <--- Cria uma referência segura aqui

        [-0.5, 0, 0.5].forEach(angle => {
          bossMissiles.push({ 
            x: activeBoss.x + activeBoss.width / 2 - 16, // Use activeBoss
            y: activeBoss.y + activeBoss.height,         // Use activeBoss
            width: 32, 
            height: 32, 
            speed: 2, 
            angle 
          });
        });
      }
    }, 6000));

    // --- 6. GAME LOOP (Renderização) ---
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Fallback: se a imagem não carregar, desenha preto
      try { ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); } catch (e) { ctx.fillStyle = 'black'; ctx.fillRect(0,0, canvas.width, canvas.height); }

      if (!gameOver) {
        if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
        if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
        if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
        if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
      }

      // Limites de Tela
      const limiteY = canvas.height / 2;
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
      player.y = Math.max(limiteY, Math.min(canvas.height - player.height, player.y));

      // HUD
      ctx.fillStyle = "cyan";
      ctx.font = "16px Arial";
      ctx.fillText("Pontos: " + score, 10, 20);
      ctx.fillText("Poder: " + fireLevel, 10, 40);

      // Barra Vida Player
      ctx.fillStyle = "red";
      ctx.fillRect(10, 50, 150, 10);
      ctx.fillStyle = "lime";
      ctx.fillRect(10, 50, ((player.life || 0) / (player.maxLife || 100)) * 150, 10);

      // Player
      ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);

      // Desenhar e mover Tiros Player
      bullets.forEach((b, i) => {
        b.y -= b.speed;
        ctx.drawImage(laserImg, b.x, b.y, b.width, b.height);
        if (b.y < 0) bullets.splice(i, 1);
        
        // Colisão com Inimigos
        enemies.forEach((e, ei) => {
            if (collide(b, e)) {
                bullets.splice(i, 1);
                if(e.life) e.life--;
                if ((e.life || 0) <= 0) {
                    enemies.splice(ei, 1);
                    score++;
                    checkBossSpawn();
                }
            }
        });
        // Colisão com Boss
        if (boss && collide(b, boss)) {
            bullets.splice(i, 1);
            if(boss.life) boss.life--;
            if ((boss.life || 0) <= 0) {
                boss = null;
                score += 10;
            }
        }
      });

      // Inimigos
      enemies.forEach((e, ei) => {
        e.y += e.speed;
        ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);
        
        // Barra vida inimigo
        ctx.fillStyle = "red"; ctx.fillRect(e.x, e.y - 8, e.width, 5);
        ctx.fillStyle = "lime"; ctx.fillRect(e.x, e.y - 8, ((e.life || 0) / (e.maxLife || 1)) * e.width, 5);
        
        if (e.y > canvas.height) enemies.splice(ei, 1);
      });

      // Boss
      if (boss) {
        if (boss.y < 40) boss.y += boss.speed;
        ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);
        
        // Barra vida boss
        ctx.fillStyle = "red"; ctx.fillRect(100, 5, 200, 10);
        ctx.fillStyle = "lime"; ctx.fillRect(100, 5, ((boss.life || 0) / (boss.maxLife || 1)) * 200, 10);
      }

      // Tiros Inimigos
      enemyBullets.forEach((b, i) => {
        b.y += b.speed;
        if (b.angle) b.x += Math.sin(b.angle) * 2;
        ctx.drawImage(enemyLaserImg, b.x, b.y, b.width, b.height);
        if (collide(b, player)) {
            enemyBullets.splice(i, 1);
            if(player.life) player.life -= 10;
            if ((player.life || 0) <= 0) gameOver = true;
        }
        if (b.y > canvas.height) enemyBullets.splice(i, 1);
      });

      // Mísseis Boss
      bossMissiles.forEach((m, i) => {
        m.y += m.speed;
        if (m.angle) m.x += Math.sin(m.angle) * 3;
        ctx.drawImage(bossMissileImg, m.x, m.y, m.width, m.height);
        if (collide(m, player)) {
            bossMissiles.splice(i, 1);
            if(player.life) player.life -= 25;
            if ((player.life || 0) <= 0) gameOver = true;
        }
        if (m.y > canvas.height) bossMissiles.splice(i, 1);
      });

      // PowerUps e Vida
      [hearts, powers].forEach((arr, typeIndex) => {
          arr.forEach((item, i) => {
             item.y += (item.speed || 2);
             const img = typeIndex === 0 ? heartImg : powerImg;
             const size = item.size || 30;
             ctx.drawImage(img, item.x, item.y, size, size);
             
             if(collide(item, player)) {
                 if (typeIndex === 0) player.life = Math.min(100, (player.life || 0) + 40);
                 else if (fireLevel < 5) fireLevel++;
                 arr.splice(i, 1);
             }
             if (item.y > canvas.height) arr.splice(i, 1);
          });
      });

      // Tela Game Over
      if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", 100, 280);
        ctx.font = "18px Arial";
        ctx.fillText("Pressione ENTER para reiniciar", 60, 320);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    // --- Cleanup (Ao sair da página) ---
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      intervalIds.forEach(clearInterval);
    };
  }, []); // Array vazio = roda apenas uma vez no mount

  const handleExit = () => {
    // Redireciona para a home
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

      {/* GAME AREA */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <canvas ref={canvasRef} id="gameCanvas" width={400} height={650} className="relative block border-[3px] border-[#00ffff] bg-[radial-gradient(circle_at_center,_#020024,_#000010)] shadow-[0_0_30px_rgba(0,255,255,0.2)] rounded-sm cursor-crosshair" />
        </div>
        <p className="mt-4 text-[#00eaff] text-xl tracking-widest drop-shadow-[0_0_8px_#00eaff]">
          MOVER: <span className="text-white">WASD</span> ou <span className="text-white">SETAS</span>
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

export default SpaceHeroes;