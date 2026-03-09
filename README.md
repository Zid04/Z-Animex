# Z-Animex — Plateforme de suivi d’animes, séries et films

## Decriprion
Animex est une application web permettant de gérer et suivre des médias :
- Films
- Séries
- Animes

L’utilisateur peut :
- Ajouter des médias
- Gérer ses saisons et épisodes
- Suivre sa progression
- Ajouter aux favoris
- Gérer sa watchlist
- Noter les médias
- Commenter
- Ajouter des tags
- Voir les statistiques de progression

Le projet utilise **Laravel 12**, **React + Inertia**, **TypeScript**, **TailwindCSS**, et une architecture modulaire.

---

##  Technologies utilisées

### Backend
- Laravel 12.x
- Eloquent ORM
- Migrations & Seeders
- Validation Form Requests
- API Resources
- PHPUnit (tests)

### Frontend
- React
- Inertia.js
- TypeScript
- TailwindCSS
- Shadcn/UI
- Vite

### Outils
- Laravel Sail / Valet / XAMPP
- Git & GitHub
- MySQL / MariaDB

---

## Installation

### 1. Cloner le projet

bash
- git clone https://github.com/zid04/Z-Animex.git
- cd Z-Animex

### 2. Installer les dépendances PHP
bash
- composer install

### 3. Installer les dépendances JS
bash
- npm install

### 4. Copier le fichier d’environnement
bash
- cp .env.example .env

### 5. Générer la clé d’application
bash
-php artisan key:generate

### 6. Configurer la base de données
Dans .env :

Code
- DB_DATABASE=animex
- DB_USERNAME=root
- DB_PASSWORD=
### 7. Lancer les migrations
bash
- php artisan migrate
### 8. Lancer le serveur
Backend :

bash
- php artisan serve
Frontend :

bash
- npm run dev
 Tests
- Lancer tous les tests : 

bash
- php artisan test --testsuite=Feature --no-coverage

- Fonctionnalités principales
 Médias
CRUD complet

Types : film, série, anime

Tags & genres

Notes & moyenne

Commentaires

 Saisons & Épisodes
Ajout / édition / suppression

Marquer un épisode comme vu

Progression automatique

Favoris & Watchlist
Ajouter / retirer

Gestion par utilisateur

Progression
Calcul automatique

Barre de progression globale

Progression par saison
 Authentification
Laravel Fortify / Breeze / Jetstream (selon installation)

Middleware auth

Gestion des utilisateurs

### Déploiement

Build production
bash
npm run build
Optimisation Laravel
bash
php artisan optimize
  Contribuer
Fork le projet

Crée une branche : git checkout -b feature/ma-feature

Commit : git commit -m "Ajout de ma feature"

Push : git push origin feature/ma-feature

Ouvre une Pull Request


### Auteur
Veronique Zida Fanta Owona  
Développeur Full‑Stack  React