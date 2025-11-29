import { Schema, model, Document } from "mongoose";

interface IJogador {
  nome: string;
  email: string;
  pontuacao: number;
  data: string;
}

export interface IRanking extends Document {
  jogo: string;
  dificuldades: {
    facil: IJogador[];
    medio?: IJogador[];
    dificil?: IJogador[];
  };
}

const rankingSchema = new Schema<IRanking>({
  jogo: { type: String, required: true },
  dificuldades: {
    facil: [
      {
        nome: String,
        email: String,
        pontuacao: Number,
        data: String,
      },
    ],
    medio: [
      {
        nome: String,
        email: String,
        pontuacao: Number,
        data: String,
      },
    ],
    dificil: [
      {
        nome: String,
        email: String,
        pontuacao: Number,
        data: String,
      },
    ],
  },
});

export const Ranking = model<IRanking>("Ranking", rankingSchema);