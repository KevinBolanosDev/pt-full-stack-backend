import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'El servidor está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router;