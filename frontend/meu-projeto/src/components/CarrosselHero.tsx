import React, { useState, useEffect } from "react";

export function CarrosselHero() {
  const imagens = [
    "/images/hero/1.jpg",
    "/images/hero/2.jpg",
    "/images/hero/3.jpg",
    "/images/hero/4.jpg",
    "/images/hero/5.jpg",
    "/images/hero/6.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  
  return (
      <div className="w-full flex flex-col items-center">

    {/* CARROSSEL */}
    <div className="relative max-w-[770px] w-full h-[380px]
                overflow-hidden border-4 border-orange-500
                rounded-xl bg-black">

      {imagens.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover
                      transition-opacity duration-1000 ease-in-out
                      ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>

    {/* INDICADORES */}
    <div className="mt-4 flex justify-center gap-3">
      {imagens.map((_, i) => (
        <button
          key={i}
          onClick={() => setIndex(i)}
          className={`
            rounded-full transition-all
            ${i === index
              ? "w-4 h-4 bg-orange-500 shadow-[0_0_8px_rgba(255,140,0,1)]"
              : "w-3 h-3 bg-white/40"}
          `}
        />
      ))}
    </div>

  </div>
  );
}
