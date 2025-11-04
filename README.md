# Dashboard Sales Indépendant 📊

**Dashboard de gestion des rendez-vous commerciaux** développé pour Media Start, permettant de visualiser et gérer les rendez-vous quotidiens des équipes de vente avec intégration Google Sheets et chatbot d'assistance.

## 🚀 Fonctionnalités

### Dashboard Principal
- **Affichage des RDV du jour** : Visualisation en temps réel des rendez-vous quotidiens
- **Groupement par commercial** : Organisation automatique par membre de l'équipe sales
- **Statuts des rendez-vous** : Suivi des phases (Nouveau, En cours, Terminé, Annulé)
- **Interface responsive** : Compatible desktop, tablette et mobile
- **Mise à jour automatique** : Synchronisation en temps réel avec Google Sheets

### Intégrations
- **Google Sheets API** : Connexion directe avec les données de prospection
- **NextAuth.js** : Authentification sécurisée
- **Chatbot intégré** : Assistant IA pour analyser les rendez-vous
- **Webhook N8N** : Intégration avec les workflows d'automatisation

### Sécurité
- **Authentification obligatoire** : Accès protégé via NextAuth
- **Middleware de sécurité** : Protection des routes sensibles
- **Gestion des sessions** : Déconnexion automatique et sécurisée

## 🛠️ Stack Technique

- **Framework** : Next.js 16.0.1 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **Authentification** : NextAuth.js v4.24.13
- **API Integration** : Google Sheets API v164.1.0
- **UI** : React 19.2.0 avec hooks personnalisés
- **Linting** : ESLint avec configuration Next.js

## 📁 Structure du Projet

```
dashboard-inde/
├── app/
│   ├── auth/signin/          # Pages d'authentification
│   ├── globals.css           # Styles globaux Tailwind
│   ├── layout.tsx            # Layout principal avec providers
│   └── page.tsx              # Dashboard principal
├── components/
│   └── ChatbotWidget.tsx     # Widget chatbot intégré
├── context/
│   └── ChatbotContext.tsx    # Contexte React pour le chatbot
├── pages/api/
│   ├── auth/                 # Configuration NextAuth
│   ├── chatbot-webhook.ts    # Webhook pour intégration N8N
│   └── get-sheet.ts          # API Google Sheets
├── types/                    # Définitions TypeScript
├── middleware.ts             # Protection des routes
└── test-gsheet.js           # Script de test API Google Sheets
```

## ⚙️ Configuration

### Variables d'environnement requises

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Credentials Google Sheets

Créer le fichier `credentials/service-account.json` avec les clés de service Google Cloud :

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm, yarn, pnpm ou bun
- Accès Google Sheets API
- Compte Google Cloud avec service account configuré

### Installation

```bash
# Cloner le repository
git clone https://github.com/Jimmyjoe13/dashboard-inde.git
cd dashboard-inde

# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### Configuration

1. **Créer le fichier `.env.local`** avec les variables d'environnement
2. **Ajouter les credentials Google** dans `credentials/service-account.json`
3. **Configurer l'ID du Google Sheet** dans `pages/api/get-sheet.ts`

### Lancement

```bash
# Mode développement
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build et Production

```bash
# Build de production
npm run build
npm run start

# Linting
npm run lint
```

## 📊 Intégration Google Sheets

### Format des données attendu

Le sheet "RDV" doit contenir les colonnes suivantes :
- **ID** : Identifiant unique du rendez-vous
- **Date de prise de RDV du lead** : Date de création du lead
- **Sales (M/S)** : Nom du commercial assigné
- **Contact** : Nom du contact client
- **Date du RDV** : Date du rendez-vous (format DD/MM/YYYY)
- **Heure du RDV** : Heure du rendez-vous
- **Nom de la campagne** : Campagne marketing associée
- **Nom de l'entreprise** : Entreprise cliente
- **Phase du RDV** : Statut (Nouveau, En cours, Terminé, Annulé)
- **Phase de la transaction** : Étape commerciale
- **Prix TTC** : Montant de la transaction

### Configuration du service account

1. Activer Google Sheets API dans Google Cloud Console
2. Créer un service account et télécharger les credentials JSON
3. Partager le Google Sheet avec l'email du service account
4. Donner les permissions de lecture au service account

## 🤖 Fonctionnalités Chatbot

Le chatbot intégré permet :
- **Analyse des rendez-vous** : Consultation des détails d'un RDV
- **Suggestions d'actions** : Recommandations basées sur les données
- **Intégration N8N** : Déclenchement d'workflows automatisés
- **Historique des interactions** : Suivi des conversations

## 🔒 Sécurité et Authentification

- **Protection des routes** : Middleware NextAuth sur toutes les pages
- **Sessions sécurisées** : Gestion des tokens JWT
- **Redirection automatique** : Vers `/auth/signin` si non authentifié
- **Déconnexion sécurisée** : Nettoyage des sessions

## 📱 Responsive Design

- **Mobile First** : Optimisé pour tous les écrans
- **Grille adaptative** : Colonnes automatiques selon la taille d'écran
- **Interactions tactiles** : Hover effects et transitions fluides
- **Typographie responsive** : Tailles adaptées aux devices

## 🔧 API Endpoints

### GET `/api/get-sheet`
Récupère les données du Google Sheet formatées pour l'affichage.

**Response:**
```json
{
  "data": [
    ["ID", "Date de prise de RDV", "Sales", "Contact", ...],
    ["1", "01/11/2025", "Jimmy Joe", "Client Test", ...]
  ]
}
```

### POST `/api/chatbot-webhook`
Webhook pour intégration avec N8N et autres services d'automatisation.

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub à Vercel
2. Ajouter les variables d'environnement
3. Configurer les credentials Google en tant que variables sécurisées
4. Déployer automatiquement

### Autres plateformes

Compatible avec :
- **Netlify** : Avec fonctions serverless
- **AWS Amplify** : Déploiement continu
- **Railway** : Configuration Docker automatique
- **VPS classique** : Avec PM2 et Nginx

## 📈 Métriques et Monitoring

- **Performance** : Optimisations Next.js intégrées
- **SEO** : Meta tags et structure optimisée
- **Analytics** : Prêt pour Google Analytics
- **Error Tracking** : Gestion d'erreurs robuste

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Projet privé - Media Start © 2025

## 👥 Équipe

- **Développeur** : Jimmy Joe (Jimmyjoe13)
- **Client** : Media Start
- **Contexte** : Dashboard de gestion commerciale

## 📞 Support

Pour toute question ou support technique, contacter l'équipe de développement Media Start.

---

**Développé avec ❤️ pour optimiser les performances commerciales de Media Start**