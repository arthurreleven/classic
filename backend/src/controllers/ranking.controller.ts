import { Request, Response } from "express";
import { users, ranking } from "../config/db";
import { registrarResultado } from "../services/ranking.service";

export const getRanking = async (_req: Request, res: Response) => {
  const top = await users
    .find({}, { projection: { _id: 0 } })
    .sort({ vitorias: -1 })
    .toArray();

  res.json(top);
};

export const registrarJogoResultado = async (req: Request, res: Response) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const email = user.email;
    const nome = user.nome;

    const resultado = req.params.resultado;
    const { dificuldade } = req.body;

    if (!email) return res.status(401).json({ error: "Não logado" });

    if (!["vitoria", "derrota", "empate"].includes(resultado!))
      return res.status(400).json({ error: "Resultado inválido" });

    if (!["facil", "medio", "dificil"].includes(dificuldade))
      return res.status(400).json({ error: "Dificuldade inválida" });

    await registrarResultado(email, nome!, resultado!, dificuldade);

    const stats = await users.findOne({ email }, { projection: { _id: 0 } });

    res.json({ message: "Resultado registrado", stats });
  } catch (e) {
    res.status(500).json({ error: "Erro ao registrar resultado" });
  }
};

export const rankingPorJogo = async (req: Request, res: Response) => {
  const { jogo, dificuldade } = req.params;

  const doc = await ranking.findOne({ jogo });

  if (!doc || !doc.dificuldades?.[dificuldade!]) return res.json([]);

  const dados = [...doc.dificuldades[dificuldade!]].sort(
    (a, b) => (b.pontuacao ?? 0) - (a.pontuacao ?? 0)
  );

  res.json(dados);
};
