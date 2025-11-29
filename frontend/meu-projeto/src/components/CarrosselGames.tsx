import React from "react";
import { useKeenSlider } from "keen-slider/react";

interface GameCard {
  id: number;
  titulo: string;
  imagem?: string;
  link?: string;
}

export default function CarrosselGames({
  jogos,
  onSliderReady,
}: {
  jogos: GameCard[];
  onSliderReady?: (slider: any) => void;
}) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: {
      perView: 4,
      spacing: 25,
    },
    breakpoints: {
      "(max-width: 1200px)": { slides: { perView: 3, spacing: 18 } },
      "(max-width: 900px)": { slides: { perView: 2, spacing: 15 } },
      "(max-width: 600px)": { slides: { perView: 1, spacing: 12 } },
    },

    created(slider) {
      onSliderReady?.(slider);
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider">
      {jogos.map((jogo) => (
        <div key={jogo.id} className="keen-slider__slide">
          <div
            onClick={() => (window.location.href = jogo.link!)}
            className="w-full h-48 bg-gray-300 rounded-2xl cursor-pointer overflow-hidden border-4 border-transparent hover:border-blue-400 transition-all"
          >
            {jogo.imagem ? (
              <img
                src={jogo.imagem}
                alt={jogo.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black font-bold font-[anton]">
                {jogo.titulo}
              </div>
            )}
          </div>

          <p className="mt-3 text-xl" style={{ fontFamily: "Anton" }}>
            {jogo.titulo}
          </p>
        </div>
      ))}
    </div>
  );
}
