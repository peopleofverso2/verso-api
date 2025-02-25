import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { validateProject } from '../middleware/validators';

const router = Router();
const projectController = new ProjectController();

// GET /api/projects - Liste des projets
router.get('/', projectController.list);

// GET /api/projects/:id - Récupérer un projet
router.get('/:id', projectController.getById);

// POST /api/projects - Créer un projet
router.post('/', validateProject, projectController.create);

// PUT /api/projects/:id - Mettre à jour un projet
router.put('/:id', validateProject, projectController.update);

// DELETE /api/projects/:id - Supprimer un projet
router.delete('/:id', projectController.delete);

export default router;
