// src/routes/dama.routes.ts
import { Router } from 'express';
import DamaController from '../controllers/dama.controller';

const router = Router();

// Define a rota POST /jogar
router.post('/jogar', DamaController.jogar);

export default router;