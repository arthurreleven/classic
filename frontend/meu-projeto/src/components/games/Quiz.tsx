import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- TIPAGEM DOS DADOS ---
type Level = 'easy' | 'medium' | 'hard' | 'expert';

interface Question {
  question: string;
  options: string[];
  answer: number;
}

// --- BANCO DE PERGUNTAS ---
const QUESTIONS_DB: Record<Level, Question[]> = {
  easy: [
    { question: "Qual linguagem é usada para estilizar páginas web?", options: ["Python", "CSS", "Java", "C++"], answer: 1 },
    { question: "Qual dessas é uma linguagem de programação?", options: ["HTML", "CSS", "JavaScript", "Photoshop"], answer: 2 },
    { question: "Qual símbolo representa 'menor ou igual'?", options: ["<=", ">=", "=<", "=>"], answer: 0 },
    { question: "Qual dessas é um banco de dados?", options: ["MySQL", "Illustrator", "Premiere", "Chrome"], answer: 0 },
    { question: "Qual protocolo é usado para acessar páginas web?", options: ["FTP", "SMTP", "HTTP", "SSH"], answer: 2 }
  ],
  medium: [
    { question: "Qual dessas é uma framework de Python?", options: ["Flask", "React", "Figma", "jQuery"], answer: 0 },
    { question: "Qual comando exibe texto no console em JavaScript?", options: ["print()", "console.log()", "echo()", "show()"], answer: 1 },
    { question: "Qual desses formatos é uma imagem?", options: ["PNG", "TXT", "MP3", "SQL"], answer: 0 },
    { question: "O que significa 'CPU'?", options: ["Centro de Processamento Universal", "Unidade Central de Processamento", "Controle Primário Único", "Central de Programas Utilitários"], answer: 1 },
    { question: "Qual destes é um sistema operacional?", options: ["Windows", "Chrome", "Discord", "YouTube"], answer: 0 }
  ],
  hard: [
    { question: "Qual linguagem é usada no backend?", options: ["Python", "Photoshop", "Excel", "Canva"], answer: 0 },
    { question: "Qual tag HTML cria um parágrafo?", options: ["<div>", "<p>", "<span>", "<br>"], answer: 1 },
    { question: "Qual comando cria uma variável em JavaScript?", options: ["var", "create", "int", "new"], answer: 0 },
    { question: "Qual desses é um tipo de dado?", options: ["String", "Monitor", "Teclado", "Mouse"], answer: 0 },
    { question: "Qual desses controla o estilo visual de um site?", options: ["CSS", "Node.js", "Python", "Git"], answer: 0 }
  ],
  expert: [
    { question: "Qual a complexidade de tempo do QuickSort no pior caso?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 2 },
    { question: "No Python, o que faz o comando 'yield'?", options: ["Finaliza a função", "Transforma a função em um generator", "Cria uma thread", "Retorna múltiplos valores"], answer: 1 },
    { question: "Qual desses é um algoritmo de rede neural?", options: ["K-Means", "CNN", "DBSCAN", "Apriori"], answer: 1 },
    { question: "O que significa ACID em bancos de dados?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Control, Integrity, Data", "Active, Connected, Indexed, Database", "Acesso, Controle, Índice, Dados"], answer: 0 },
    { question: "No JavaScript, Promises seguem qual padrão?", options: ["Observer", "Factory", "Future", "Adapter"], answer: 2 }
  ]
};

const Quiz: React.FC = () => {
  // --- ESTADOS ---
  const [currentLevel, setCurrentLevel] = useState<Level>('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'quiz' | 'modal' | 'result'>('quiz');

  // --- LÓGICA ---
  const currentQuestionsList = QUESTIONS_DB[currentLevel];
  const currentQuestionData = currentQuestionsList[currentQuestionIndex];

  const getNextLevelName = (level: Level): Level | null => {
    if (level === 'easy') return 'medium';
    if (level === 'medium') return 'hard';
    if (level === 'hard') return 'expert';
    return null; 
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuestionData.answer) setScore(prev => prev + 10);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < currentQuestionsList.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const nextLvl = getNextLevelName(currentLevel);
      if (nextLvl) setGameState('modal');
      else setGameState('result');
    }
  };

  const handleLevelChoice = (choice: boolean) => {
    if (choice) {
      const nextLvl = getNextLevelName(currentLevel);
      if (nextLvl) {
        setCurrentLevel(nextLvl);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setGameState('quiz');
      }
    } else {
      setGameState('result');
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentLevel('easy');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setGameState('quiz');
  };

  const handleExit = () => {
    window.location.href = '/';
  };

  // --- RENDERIZAÇÃO ---
  return (
    // Body / Wrapper Global
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

      {/* LOGOS DECORATIVAS LATERAIS (Hidden em telas menores que 1024px para imitar o media query) */}
      <div className="hidden lg:block">
        <img 
            src="../images/logo.png" 
            alt="logo esquerda" 
            className="fixed top-[58%] left-[90px] -translate-y-1/2 w-[160px] opacity-[0.18] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] -z-10" 
        />
        <img 
            src="../images/logo.png" 
            alt="logo direita" 
            className="fixed top-[58%] right-[90px] -translate-y-1/2 w-[160px] opacity-[0.18] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] -z-10" 
        />
      </div>

      {/* TÍTULOS LATERAIS (GAMES / CAF) */}
      <div className="hidden lg:block">
        <h3 className="fixed top-[35%] left-[85px] text-[2em] font-bold text-[#00c8ff] drop-shadow-[0_0_15px_#00aaff] tracking-[2px] opacity-90 -z-10">
          GAMES
        </h3>
        <h3 className="fixed top-[35%] right-[125px] text-[2em] font-bold text-[#00c8ff] drop-shadow-[0_0_15px_#00aaff] tracking-[2px] opacity-90 -z-10">
          CAF
        </h3>
      </div>

      {/* BOTÃO SAIR */}
      <button onClick={handleExit} className="fixed left-[30px] bottom-[30px] px-6 py-2 bg-red-600/80 text-white font-bold text-lg rounded-xl border-2 border-white/20 hover:bg-red-500 transition-all z-40">Sair do Jogo</button>


      {/* QUIZ CONTAINER */}
      <div className="w-full max-w-[420px] mx-auto mt-[70px] bg-[#06203d] p-[35px_30px] rounded-[20px] text-center shadow-[0_0_30px_#00aaff]">
        <h2 className="text-[2.2em] mb-4 text-[#00c8ff] drop-shadow-[0_0_15px_#00aaff]">
          Quiz Game
        </h2>

        {gameState === 'quiz' && (
          <div id="quiz-box">
            <h2 className="text-[1.3em] mb-4">
              {currentQuestionData.question}
            </h2>
            
            <div className="flex flex-col gap-2.5">
              {currentQuestionData.options.map((option, index) => {
                // Definição das cores baseada no estado
                let bgClass = "bg-[#0a3050] hover:bg-[#004c80]";
                
                if (selectedOption !== null) {
                   if (index === currentQuestionData.answer) {
                     bgClass = "!bg-green-500"; // Tailwind green-500
                   } else if (index === selectedOption) {
                     bgClass = "!bg-red-500";   // Tailwind red-500
                   }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={`
                      w-full p-3 border-none rounded-xl text-white text-base cursor-pointer 
                      transition-all duration-200 shadow-[0_0_10px_rgba(0,170,255,0.25)]
                      disabled:cursor-default disabled:opacity-90
                      ${bgClass}
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <button 
                onClick={handleNextQuestion}
                className="mt-5 px-[30px] py-3 bg-[#00aaff] border-none rounded-[15px] text-black text-base font-bold cursor-pointer shadow-[0_0_15px_rgba(0,170,255,0.6)] hover:bg-[#33bbff]"
              >
                Próxima
              </button>
            )}
          </div>
        )}

        {/* TELA DE RESULTADO */}
        {gameState === 'result' && (
          <div className="animate-fade-in">
            <h2 className="text-xl text-[#00e5ff] mb-4">Resultado Final</h2>
            <p className="text-lg mb-4">Você fez {score} pontos!</p>
            <button 
              onClick={restartQuiz}
              className="mt-2 px-[30px] py-3 bg-[#00aaff] border-none rounded-[15px] text-black text-base font-bold cursor-pointer shadow-[0_0_15px_rgba(0,170,255,0.6)] hover:scale-105 transition-transform"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE NÍVEL */}
      {gameState === 'modal' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000]">
          <div className="bg-[#06203d] p-[25px_30px] rounded-[20px] text-center shadow-[0_0_25px_#00aaff] w-[90%] max-w-[320px]">
            <h2 className="text-[1.3em] mb-4 text-[#00e5ff]">
              Ir para o nível {getNextLevelName(currentLevel)}?
            </h2>

            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => handleLevelChoice(true)}
                className="w-[120px] p-2.5 border-none rounded-xl text-[15px] font-bold cursor-pointer bg-[#00e5ff] text-black hover:brightness-110"
              >
                Sim
              </button>
              <button 
                onClick={() => handleLevelChoice(false)}
                className="w-[120px] p-2.5 border-none rounded-xl text-[15px] font-bold cursor-pointer bg-[#ff6b6b] text-black hover:brightness-110"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
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

export default Quiz;