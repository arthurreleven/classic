import { ranking } from "../config/db";

export const registrarResultado = async (
  email: string,
  nome: string,
  resultado: string,
  dificuldade: string
) => {
  const updateField = `${resultado}s`;

  await ranking.db.collection("users").updateOne(
    { email },
    { $inc: { [updateField]: 1 } }
  );

  if (resultado === "vitoria") {
    await ranking.updateOne(
      { jogo: "Jogo da Velha" },
      {
        $push: {
          [`dificuldades.${dificuldade}`]: {
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
};
