import { Router } from 'express';
import { MediaController } from '../controllers/MediaController';
import multer from 'multer';
import { validateMedia } from '../middleware/validators';

const router = Router();
const mediaController = new MediaController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  }
});

// GET /api/media - Liste des médias
router.get('/', mediaController.list);

// GET /api/media/:id - Récupérer un média
router.get('/:id', mediaController.getById);

// GET /api/media/:id/metadata - Récupérer les métadonnées d'un média
router.get('/:id/metadata', mediaController.getMetadata);

// POST /api/media - Upload un média
router.post('/', upload.single('file'), validateMedia, mediaController.upload);

// DELETE /api/media/:id - Supprimer un média
router.delete('/:id', mediaController.delete);

export default router;
