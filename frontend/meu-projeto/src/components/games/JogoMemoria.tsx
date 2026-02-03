import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Interface da Carta
interface Card {
  id: number;
  src: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const imagensOriginais = [
  "images/memoria/carta1.jpg", "images/memoria/carta2.jpg", "images/memoria/carta3.jpg", "images/memoria/carta4.jpg",
  "images/memoria/carta5.jpg", "images/memoria/carta6.jpg", "images/memoria/carta7.jpg", "images/memoria/carta8.jpg"
];

export default function JogoDaMemoria() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inicializar Jogo
  const shuffleCards = () => {
    const duplicatedImages = [...imagensOriginais, ...imagensOriginais];
    const shuffledCards = duplicatedImages
      .sort(() => Math.random() - 0.5)
      .map((img, index) => ({
        id: index,
        src: img,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setGameWon(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  // Lógica de Clique
  const handleCardClick = (clickedCard: Card) => {
    if (isProcessing || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      checkForMatch(newFlipped, newCards);
    }
  };

  const checkForMatch = (currentFlipped: Card[], currentCards: Card[]) => {
    const [card1, card2] = currentFlipped;
    if (card1.src === card2.src) {
      const matchedCards = currentCards.map(card => 
        card.src === card1.src ? { ...card, isMatched: true } : card
      );
      setCards(matchedCards);
      setFlippedCards([]);
      setIsProcessing(false);
    } else {
      setTimeout(() => {
        const resetCards = currentCards.map(card => 
          card.id === card1.id || card.id === card2.id 
            ? { ...card, isFlipped: false } 
            : card
        );
        setCards(resetCards);
        setFlippedCards([]);
        setIsProcessing(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleExit = () => {
    window.location.href = '/'; 
  };

  return (
    // Container Principal (Body simulado)
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-x-hidden">
      {/* HEADER */}
      <header className="w-ful bg-[#00020D] relative z-10">
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

      {/* Título Pulsante */}
      {/* Nota: Requer a configuração de keyframes 'pulsar' no tailwind.config */}
      <div className="absolute top-[80px] w-full text-center text-4xl font-bold text-[#00aaff] uppercase tracking-[0.15em] pointer-events-none animate-pulsar drop-shadow-[0_0_10px_#00aaff]">
        {/* Você pode remover animate-pulsar se não configurar o tailwind e deixar estático */}
      </div>

      {/* BOTÃO SAIR */}
      <button onClick={handleExit} className="fixed left-[30px] bottom-[30px] px-6 py-2 bg-red-600/80 text-white font-bold text-lg rounded-xl border-2 border-white/20 hover:bg-red-500 transition-all z-40">Sair do Jogo</button>


      {/* --- CONTAINER DO JOGO --- */}
      <div className="relative flex flex-col justify-center items-center gap-[30px]  py-10 px-[60px] rounded-[20px] shadow-[0_0_25px_#0088dd,inset_0_0_60px_#004466]">
        
        <h2 className="text-[3em] text-[#00aaff] uppercase tracking-[0.1em] drop-shadow-[0_0_10px_rgba(0,140,255,0.9)]">
          Jogo da Memória
        </h2>
        
        {/* TABULEIRO */}
        <div className="bg-[#06203d] p-5 rounded-[20px] shadow-[0_0_25px_#0088dd,inset_0_0_60px_#004466]">
          <div className="w-[430px] h-[430px] flex flex-wrap gap-[10px] [perspective:800px]">
            {cards.map((card) => (
              <div 
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`
                  relative w-[100px] h-[100px] bg-[#0a304d] rounded-xl cursor-pointer 
                  transition-transform duration-500 [transform-style:preserve-3d] shadow-[0_0_10px_rgba(0,140,255,0.25)]
                  ${card.isFlipped || card.isMatched ? '[transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]'}
                `}
              >
                <img 
                  src={card.src} 
                  alt="memory card" 
                  className="absolute inset-0 w-full h-full object-cover rounded-xl [backface-visibility:hidden] [transform:rotateY(0deg)]"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-[#00bfff] to-[#065a8f] rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
                ></div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={shuffleCards}
          className="py-[15px] px-[20px] text-[#ffffff] bg-[#00aaff] border-none text-[1.5em] tracking-[0.1em] uppercase cursor-pointer font-semibold rounded-[10px] transition-all duration-300 shadow-[0_0_15px_rgba(0,140,255,0.4)] hover:bg-[#0088dd] hover:shadow-[0_0_20px_rgba(0,140,255,0.8)]"
        >
          Reiniciar Jogo
        </button>
      </div>

      {/* --- MODAL VITÓRIA --- */}
      {gameWon && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[8px] flex justify-center items-center z-[2000] animate-zoomIn">
          <div className="bg-[#06203d] py-10 px-[60px] rounded-[20px] text-center shadow-[0_0_40px_rgba(0,140,255,0.6)]">
            <h1 className="text-[2.5em] mb-[25px] text-[#00aaff] drop-shadow-[0_0_12px_#00aaff]">
              🎉 Você Venceu! 🎉
            </h1>
            <button 
              onClick={shuffleCards}
              className="py-3 px-5 text-[1.2em] border-none rounded-[10px] bg-[#00aaff] text-[#ffffff] cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(0,140,255,0.6)] hover:bg-[#0088dd] hover:shadow-[0_0_25px_#00aaff]"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}