import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai"; // 1. Importação correta
import { config } from "dotenv";
config();

const router = Router();

// 2. Inicialize o cliente do GoogleGenAI
// Ele procurará automaticamente por uma variável de ambiente GEMINI_API_KEY ou GOOGLE_API_KEY
// É recomendado usar GEMINI_API_KEY no seu arquivo .env
const ai = new GoogleGenAI({});
console.log("CHAVE CONFIGURADA"); // Não podemos logar a chave diretamente por segurança

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ error: "Mensagem não enviada" });
    }

    // 3. Chamada para a API do Gemini
    const resposta = await ai.models.generateContent({
      model: "gemini-2.5-flash", // 4. Substitua o modelo (ex: gpt-4.1-mini) por um modelo Gemini
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Você é o Jamal, fala de forma divertida.", // 5. O prompt de "system" é incluído no primeiro texto do "user"
            },
            { text: mensagem },
          ],
        },
      ],
    });

    // 6. Extração da resposta
    const content = resposta.text;

    if (!content) {
      return res.status(500).json({ error: "Gemini não retornou conteúdo" });
    }
    // --------------------------

    return res.json({ resposta: content });
  } catch (error) {
    console.error("Erro no CHAT:", error);
    res.status(500).json({ error: "Erro ao conversar com IA" });
  }
});

export default router;