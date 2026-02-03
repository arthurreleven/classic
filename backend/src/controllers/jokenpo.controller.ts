import { Request, Response } from 'express';
import JokenpoService from '../services/jokenpo.service';

class JokenpoController {
    public play(req: Request, res: Response): Response {
        try {
            const { escolha_usuario } = req.body;

            if (!escolha_usuario) {
                return res.status(400).json({ erro: 'Jogada não enviada' });
            }

            // Chama o serviço que contém a lógica da IA
            const jogadaMaquina = JokenpoService.processarJogo(escolha_usuario);

            return res.json({
                jogada_maquina: jogadaMaquina
            });

        } catch (error) {
            console.error("Erro no controller:", error);
            return res.status(500).json({ erro: 'Erro interno no servidor' });
        }
    }
}

export default new JokenpoController();