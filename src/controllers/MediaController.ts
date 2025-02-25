import { Request, Response } from 'express';
import Media, { IMedia } from '../models/Media';
import { createLogger } from '../utils/logger';
import { generateThumbnail } from '../utils/mediaUtils';

const logger = createLogger('MediaController');

export class MediaController {
  // Uploader un média
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { buffer, mimetype, originalname, size } = req.file;
      const mediaType = mimetype.startsWith('video/') ? 'video' : 
                       mimetype.startsWith('image/') ? 'image' : 
                       mimetype.startsWith('audio/') ? 'audio' : 'pov';

      // Générer un thumbnail pour les vidéos
      let dimensions;
      if (mediaType === 'video') {
        const thumbnail = await generateThumbnail(buffer);
        dimensions = thumbnail.dimensions;
      }

      const media = await Media.create({
        mediaId: Date.now().toString(),
        userId: req.user.id,
        metadata: {
          type: mediaType,
          mimeType: mimetype,
          name: originalname,
          size,
          dimensions,
          tags: req.body.tags || []
        },
        file: {
          data: buffer,
          contentType: mimetype
        }
      });

      logger.info(`Media uploaded: ${media.mediaId}`);
      res.status(201).json({
        mediaId: media.mediaId,
        metadata: media.metadata
      });
    } catch (error) {
      logger.error('Error uploading media:', error);
      res.status(500).json({ error: 'Error uploading media' });
    }
  }

  // Récupérer un média
  async getById(req: Request, res: Response) {
    try {
      const media = await Media.findOne({ 
        mediaId: req.params.id,
        userId: req.user.id
      });

      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      res.set('Content-Type', media.file.contentType);
      res.send(media.file.data);
    } catch (error) {
      logger.error(`Error getting media ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error retrieving media' });
    }
  }

  // Récupérer les métadonnées d'un média
  async getMetadata(req: Request, res: Response) {
    try {
      const media = await Media.findOne({ 
        mediaId: req.params.id,
        userId: req.user.id
      }).select('metadata');

      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      res.json(media.metadata);
    } catch (error) {
      logger.error(`Error getting media metadata ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error retrieving media metadata' });
    }
  }

  // Supprimer un média
  async delete(req: Request, res: Response) {
    try {
      const media = await Media.findOneAndDelete({
        mediaId: req.params.id,
        userId: req.user.id
      });

      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      logger.info(`Media deleted: ${req.params.id}`);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting media ${req.params.id}:`, error);
      res.status(500).json({ error: 'Error deleting media' });
    }
  }

  // Lister les médias d'un utilisateur
  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const query: any = { userId: req.user.id };
      
      // Filtrage par type
      if (req.query.type) {
        query['metadata.type'] = req.query.type;
      }

      // Filtrage par tags
      if (req.query.tags) {
        const tags = (req.query.tags as string).split(',');
        query['metadata.tags'] = { $all: tags };
      }

      const media = await Media.find(query)
        .select('mediaId metadata')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Media.countDocuments(query);

      res.json({
        media,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error listing media:', error);
      res.status(500).json({ error: 'Error listing media' });
    }
  }
}
