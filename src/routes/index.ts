import { Router } from 'express';
import projectRoutes from './projectRoutes';
import mediaRoutes from './mediaRoutes';
import authRoutes from './authRoutes';
import { authenticate } from '../middleware/auth';

const router = Router();

// Routes publiques
router.use('/auth', authRoutes);

// Routes protégées
router.use('/projects', authenticate, projectRoutes);
router.use('/media', authenticate, mediaRoutes);

export default router;
