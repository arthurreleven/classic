import { Schema, model, Document } from "mongoose";

<<<<<<< HEAD
interface IJogador {
=======
export type Dificuldade = "facil" | "medio" | "dificil";

export interface IJogador {
>>>>>>> 77524ba (Add Files)
  nome: string;
  email: string;
  pontuacao: number;
  data: string;
}

export interface IRanking extends Document {
  jogo: string;
<<<<<<< HEAD
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
=======
  dificuldades: Record<Dificuldade, IJogador[]>;
}

const jogadorSchema = new Schema<IJogador>(
  {
    nome: String,
    email: String,
    pontuacao: Number,
    data: String,
  },
  { _id: false }
);

const rankingSchema = new Schema<IRanking>({
  jogo: { type: String, required: true },
  dificuldades: {
    type: Map,
    of: [jogadorSchema],
    default: {
      facil: [],
      medio: [],
      dificil: []
    }
  }
});

export const Ranking = model<IRanking>("Ranking", rankingSchema, "ranking");
>>>>>>> 77524ba (Add Files)
