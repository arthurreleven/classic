import React from "react";

export default function Sobre() {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center px-6 py-20">
      
      {/* Título */}
      <h2 className="text-6xl font-[anton] text-center mb-14">
        Sobre
      </h2>

      {/* Conteúdo */}
      <div className="max-w-4xl text-center text-xl leading-relaxed space-y-6">
        <p>
          Nossa plataforma foi criada com o objetivo de oferecer uma experiência
          interativa e divertida através de jogos e desafios que utilizam 
          Inteligência Artificial.
        </p>

        <p>
          Aqui você encontra jogos dinâmicos, competitivos e atualizados
          constantemente para garantir diversão, aprendizado e desafios 
          estimulantes.
        </p>

        <p>
          Além disso, estamos sempre trabalhando para trazer novas funcionalidades,
          melhorias visuais e ampliar a variedade de jogos disponíveis.
        </p>

        <p className="font-semibold text-orange-400">
          Obrigado por fazer parte da nossa comunidade!
        </p>
      </div>

    </div>
  );
}
