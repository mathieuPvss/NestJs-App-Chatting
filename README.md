# NestJs-App-Chatting

Une application de chat moderne construite avec NestJS pour le backend et Vue.js pour le frontend.

## 🚀 Technologies Utilisées

### Backend

- NestJS
- PostgreSQL
- TypeScript
- JWT pour l'authentification

### Frontend

- Vue.js
- Vite
- TypeScript

## 📋 Prérequis

- Docker et Docker Compose
- Node.js (version 23 ou supérieure)
- npm ou yarn

## 🔧 Installation

1. Clonez le repository :

```bash
git clone [URL_DU_REPO]
cd NestJs-App-Chatting
```

2. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
POSTGRES_USER=votre_utilisateur
POSTGRES_PASSWORD=votre_mot_de_passe
POSTGRES_DB=chat_db
POSTGRES_HOST=postgres
JWT_SECRET=votre_secret_jwt
NEST_PORT=3000
NEST_BACKEND_URL=http://localhost:3000
```

3. Lancez l'application avec Docker Compose :

```bash
docker-compose up -d
```

## 🔧 Seeds

1. Lancer le projet

```bash
docker-compose up -d
```

2. Lancer les seeds

```bash
docker exec -it backend_chatting sh -c "cd /app && npm run seed"
```

## 🌐 Accès aux Services

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Adminer (Gestion de la base de données) : http://localhost:8081
  - Système : PostgreSQL
  - Serveur : postgres
  - Utilisateur : [POSTGRES_USER]
  - Mot de passe : [POSTGRES_PASSWORD]
  - Base de données : [POSTGRES_DB]

## 📁 Structure du Projet

```
NestJs-App-Chatting/
├── backend/
│   └── app-chatting/     # Application NestJS
├── frontend/
│   └── vue-chat/        # Application Vue.js
├── compose.yaml         # Configuration Docker Compose
└── .env                # Variables d'environnement
```

## 🔍 Fonctionnalités

- Authentification des utilisateurs
- Chat en temps réel
- Gestion des messages
- Interface utilisateur moderne et responsive

## 🛠️ Développement

### Backend

```bash
cd backend/app-chatting
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend/vue-chat
npm install
npm run dev
```

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

[Mathieu Pannetrat, Gauthier Lo]
