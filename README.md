# Verso API

API backend pour l'application Verso, permettant la gestion et la diffusion de POVs (Points of View) interactifs.

## Fonctionnalités

- Gestion des POVs (création, lecture, mise à jour)
- Chargement optimisé des nœuds et médias
- Support du streaming vidéo
- API RESTful avec documentation Swagger

## Technologies

- Node.js
- Express
- TypeScript
- MongoDB
- Docker

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/verso-db
NODE_ENV=development
```

## API Endpoints

### POV

- `GET /api/v1/povs/:povId/nodes/:nodeId/with-neighbors` - Récupérer un nœud et ses voisins
- `POST /api/v1/povs` - Créer un nouveau POV

## Docker

```bash
# Build l'image
docker build -t verso-api .

# Lancer le conteneur
docker run -p 3000:3000 verso-api
```

## Déploiement

L'application est configurée pour être déployée sur Render.com.

## License

MIT
