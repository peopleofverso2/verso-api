import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';
import { createLogger } from '../utils/logger';

const logger = createLogger('ProjectController');

export class ProjectController {
  // Créer un nouveau projet
  async create(req: Request, res: Response) {
    try {
      const projectData = {
        ...req.body,
        userId: req.user.id // Ajouté par le middleware d'authentification
      };

      const project = await Project.create(projectData);
      logger.info(`Project created: ${project.projectId}`);
      
      res.status(201).json(project);
    } catch (error) {
      logger.error('Error creating project:', error);
      res.status(500).json({ error: 'Error creating project' });
    }
  }

  // Récupérer un projet par son ID
  async getById(req: Request, res: Response) {
    try {
      const project = await Project.findOne({ 
        projectId: req.params.id,
        $or: [
          { userId: req.user.id },
          { isPublic: true }
        ]
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      logger.error(`Error getting project ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error retrieving project' });
    }
  }

  // Mettre à jour un projet
  async update(req: Request, res: Response) {
    try {
      const project = await Project.findOneAndUpdate(
        { 
          projectId: req.params.id,
          userId: req.user.id
        },
        req.body,
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      logger.info(`Project updated: ${project.projectId}`);
      res.json(project);
    } catch (error) {
      logger.error(`Error updating project ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error updating project' });
    }
  }

  // Supprimer un projet
  async delete(req: Request, res: Response) {
    try {
      const project = await Project.findOneAndDelete({
        projectId: req.params.id,
        userId: req.user.id
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      logger.info(`Project deleted: ${req.params.id}`);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting project ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error deleting project' });
    }
  }

  // Lister les projets d'un utilisateur
  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const projects = await Project.find({ userId: req.user.id })
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 });

      const total = await Project.countDocuments({ userId: req.user.id });

      res.json({
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error listing projects:', error);
      res.status(500).json({ error: 'Error listing projects' });
    }
  }
}
