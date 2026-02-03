import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeInterface from "./HomeInterface.tsx";
import Sobre from "./components/Sobre";
import Conta from "./components/Conta.tsx";
import Ranking from "./components/Ranking.tsx";
<<<<<<< HEAD
import JogoDaVelha from "./components/JogoVelha.tsx";
import Dama from "./components/Dama.tsx";
=======
import JogoDaVelha from "./components/games/JogoVelha.tsx";
import Dama from "./components/games/Dama.tsx";
import SpaceHeroes from "./components/games/Space.tsx";
import MarioJump from "./components/games/MarioJump.tsx";
import Quiz from "./components/games/Quiz.tsx";
import FlappyBird from "./components/games/FlappyBird.tsx";
import JogoDaMemoria from "./components/games/JogoMemoria.tsx";
import Jokenpo from "./components/games/Jokenpo.tsx";
import Suporte from "./components/Suporte.tsx";
import LabIA from "./components/LabIA.tsx";
import Login from "./components/Login.tsx";
import NovaSenha from "./components/NovaSenha.tsx";
import EsqueceuSenha from "./components/EsqueceuSenha.tsx";
import Cadastro from "./components/Cadastro.tsx";
>>>>>>> 77524ba (Add Files)

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
<<<<<<< HEAD
=======
        <Route path="/space" element={<SpaceHeroes />} />
        <Route path="/mario" element={<MarioJump />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flappy" element={<FlappyBird />} />
        <Route path="/memoria" element={<JogoDaMemoria />} />
        <Route path="/jokenpo" element={<Jokenpo />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/labia" element={<LabIA />} />
        <Route path="/login" element={<Login />} />
        <Route path="/novasenha" element={<NovaSenha />} />
        <Route path="/esqueceusenha" element={<EsqueceuSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
>>>>>>> 77524ba (Add Files)
      </Routes>
    </BrowserRouter>
  );
}
