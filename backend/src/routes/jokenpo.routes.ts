import { Router } from 'express';
import JokenpoController from '../controllers/jokenpo.controller';

const router = Router();

// Define a rota POST /play
router.post('/play', JokenpoController.play);

export default router;