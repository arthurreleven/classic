import { Router } from "express";
import { Ranking } from "../models/Ranking";
import { User } from "../models/User";
import session from 'express-session';

const router = Router();

/**
 * GET /api/ranking
 * Retorna ranking ordenado por vitórias dos usuários
 */
router.get("/", async (_req, res) => {
  try {
    const ranking = await User.find({}, { _id: 0 })
      .sort({ vitorias: -1 })
      .limit(50);
    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

/**
 * POST /api/resultado/:resultado
 * Atualiza as estatísticas do usuário e salva no ranking do jogo da velha
 */
router.post("/resultado/:resultado", async (req, res) => {
  try {
    const { resultado } = req.params;
    
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ error: "Usuário não logado" });
    }

    const { email, nome } = user;


    if (!["vitoria", "derrota", "empate"].includes(resultado)) {
      return res.status(400).json({ error: "Resultado inválido" });
    }

    // Atualiza estatísticas
    const incField: Record<string, number> = {};
    incField[`${resultado}s`] = 1;
    await User.updateOne({ email }, { $inc: incField });

    // Se for vitória, adiciona ao ranking do jogo da velha (modo fácil)
    if (resultado === "vitoria") {
      await Ranking.updateOne(
        { jogo: "Jogo da Velha" },
        {
          $push: {
            "dificuldades.facil": {
              nome,
              email,
              pontuacao: 5,
              data: new Date().toISOString(),
            },
          },
        },
        { upsert: true }
      );
    }

    const stats = await User.findOne({ email }, { _id: 0 });
    res.json({ message: "Resultado registrado com sucesso", stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar resultado" });
  }
});

export default router;