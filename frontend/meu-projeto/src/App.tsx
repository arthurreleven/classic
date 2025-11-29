import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeInterface from "./HomeInterface.tsx";
import Sobre from "./components/Sobre";
import Conta from "./components/Conta.tsx";
import Ranking from "./components/Ranking.tsx";
import JogoDaVelha from "./components/JogoVelha.tsx";
import Dama from "./components/Dama.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeInterface />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/conta" element={<Conta />} />
        <Route path="/jogovelha" element={<JogoDaVelha />} />
        <Route path="/dama" element={<Dama />} />
      </Routes>
    </BrowserRouter>
  );
}
