// src/controllers/DamaController.ts
import { Request, Response } from 'express';
import DamaService from '../services/dama.service';

class DamaController {
  public jogar(req: Request, res: Response): Response {
    try {
      const { board, nivel } = req.body;

      if (!board || !Array.isArray(board)) {
        return res.status(400).json({ error: 'Board inválido ou não fornecido.' });
      }

      // Chama o serviço
      const jogada = DamaService.escolherJogada(board, nivel || 'facil');
      
      return res.json(jogada);
    } catch (error) {
      console.error("Erro no DamaController:", error);
      return res.status(500).json({ error: 'Erro interno ao processar jogada.' });
    }
  }
}

export default new DamaController();