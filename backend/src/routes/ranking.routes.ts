import { Router } from "express";
import { Ranking } from "../models/Ranking";
import { User } from "../models/User";
<<<<<<< HEAD
=======
import {db} from "../config/db";
>>>>>>> 77524ba (Add Files)
import session from 'express-session';

const router = Router();

/**
 * GET /api/ranking
 * Retorna ranking ordenado por vitórias dos usuários
 */
<<<<<<< HEAD
router.get("/", async (_req, res) => {
  try {
    const ranking = await User.find({}, { _id: 0 })
      .sort({ vitorias: -1 })
      .limit(50);
    res.json(ranking);
  } catch (err) {
    console.error(err);
=======
router.get("/jogos", async (_req, res) => {
  try {
    const rankings = await Ranking.find({}, { jogo: 1, _id: 0 });

    // remove duplicados
    const jogosUnicos = Array.from(
      new Map(rankings.map(item => [item.jogo, item])).values()
    );

    res.json(jogosUnicos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar lista de jogos" });
  }
});


router.get("/ranking_nome/:jogo/:dificuldade", async (req, res) => {
  try {
    const { jogo, dificuldade } = req.params;

    const rankingCollection = db.collection("ranking");

    const doc = await rankingCollection.findOne({ jogo });

    if (!doc) {
      return res.json([]);
    }

    if (!doc.dificuldades || !doc.dificuldades[dificuldade]) {
      return res.json([]);
    }

    const dados = [...doc.dificuldades[dificuldade]]
      .sort((a, b) => (b.pontuacao ?? 0) - (a.pontuacao ?? 0));

    res.json(dados);

  } catch (error) {
    console.error(error);
>>>>>>> 77524ba (Add Files)
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

<<<<<<< HEAD
=======
router.post("/salvar", async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ error: "Usuário não logado" });
    }

    const { jogo, dificuldade, pontuacao } = req.body;
    const { nome, email } = user;

    if (!jogo || !dificuldade) {
      return res.status(400).json({ error: "Jogo ou dificuldade ausentes" });
    }

    const rankingCollection = db.collection("ranking");

    await rankingCollection.updateOne(
      { jogo },
      {
        $push: {
          [`dificuldades.${dificuldade}`]: {
            nome,
            email,
            pontuacao,
            data: new Date().toISOString(),
          },
        },
      },
      { upsert: true }
    );

    res.json({ mensagem: "Resultado salvo no ranking!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar resultado" });
  }
});



>>>>>>> 77524ba (Add Files)
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