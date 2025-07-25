# Mini CRM – Vue 3 + Vite + Vuetify

Ce projet est un mini-CRM développé avec Vue 3, Vite et Vuetify.  
Il permet de gérer complètement une petite entreprise avec un système de gestion intégré.

## 📋 Fonctionnalités Principales

### 👥 Gestion des Utilisateurs
- Ajout, modification et suppression d'utilisateurs
- Recherche en temps réel par nom ou email
- Stockage local des données utilisateur
- Interface intuitive avec formulaires de validation

### 📦 Gestion des Articles
- Catalogue complet des produits
- Gestion des prix et du stock en temps réel
- Alertes automatiques pour stock faible (≤5 unités)
- Fonction de réapprovisionnement rapide
- Recherche et filtrage des articles
- Indicateurs visuels pour les articles en rupture

### 🛒 Gestion des Commandes
- Création de commandes avec sélection client et produits
- Vérification automatique de disponibilité des stocks
- Réduction automatique du stock lors des commandes
- Calcul automatique des totaux
- Historique complet des commandes
- Recherche par client ou produit
- Prévention des surventes

### 📊 Tableau de Bord Analytique
- **Statistiques en temps réel** :
  - Nombre total d'utilisateurs
  - Nombre de commandes
  - Chiffre d'affaires total
  - Articles en stock faible
- **Graphique "Commandes par mois"** avec données historiques
- **Alertes stock** avec liste détaillée des articles critiques
- **Dernières commandes** avec aperçu rapide
- **Accès rapide** aux différentes sections

### 🔍 Fonctionnalités de Recherche
- Recherche globale dans tous les modules
- Filtrage en temps réel lors de la saisie
- Recherche par nom, email, produit ou client
- Interface de recherche unifiée

### 📈 Gestion Avancée des Stocks
- **Suivi automatique** : Réduction lors des commandes
- **Alertes intelligentes** : Notifications visuelles pour stock faible
- **Réapprovisionnement** : Bouton dédié pour ajouter du stock
- **Validation** : Empêche les commandes dépassant le stock disponible
- **Historique** : Données d'exemple pré-chargées (Oct 2024 - Fév 2025)

### 🔐 Système d'Authentification
- Connexion sécurisée (admin/123456)
- Gestion de session avec localStorage
- Redirection automatique vers login si non connecté
- Déconnexion sécurisée

### 💾 Persistance des Données
- Stockage local avec localStorage
- Sauvegarde automatique de toutes les modifications
- Données historiques pré-chargées pour démonstration
- Pas de base de données externe requise

## 🛠️ Technologies Utilisées

- **Frontend** : Vue 3 (Composition API)
- **Build Tool** : Vite
- **UI Framework** : Vuetify 3
- **Graphiques** : Chart.js + vue-chartjs
- **Routage** : Vue Router
- **État** : Pinia
- **Styling** : SCSS/Sass

## 📱 Interface Utilisateur

- **Design responsive** adapté mobile et desktop
- **Interface moderne** avec Material Design (Vuetify)
- **Navigation intuitive** avec barre de navigation
- **Feedback visuel** avec alerts et indicateurs
- **Formulaires intelligents** avec validation en temps réel

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build pour production
npm run build
```

## 🔑 Accès à l'Application

- **URL** : http://localhost:5173 (ou port affiché)
- **Identifiants** :
  - Nom d'utilisateur : `admin`
  - Mot de passe : `123456`

## 📊 Données de Démonstration

L'application inclut des données historiques pré-chargées :
- **13 commandes** réparties d'octobre 2024 à février 2025
- **10 articles** avec stocks variés
- **Données réalistes** pour tester toutes les fonctionnalités


## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages principales de l'application
│   ├── Dashboard.vue   # Tableau de bord avec analytics
│   ├── Users.vue       # Gestion des utilisateurs
│   ├── Articles.vue    # Gestion des articles/stock
│   ├── Orders.vue      # Gestion des commandes
│   └── Login.vue       # Page de connexion
├── router/             # Configuration des routes
├── stores/             # Gestion d'état avec Pinia
└── assets/             # Ressources statiques
```

## 🔄 Flux de Travail Typique

1. **Connexion** avec admin/123456
2. **Ajout d'utilisateurs** (clients potentiels)
3. **Configuration des articles** avec prix et stock
4. **Création de commandes** pour les clients
5. **Suivi sur le dashboard** des ventes et stocks
6. **Réapprovisionnement** quand nécessaire

## 📈 Fonctionnalités Avancées

- **Prévention des erreurs** : Validation des stocks avant commande
- **Interface intelligente** : Champs désactivés si stock nul
- **Indicateurs visuels** : Couleurs pour stock faible/critique
- **Recherche performante** : Filtrage instantané
- **Données persistantes** : Aucune perte lors du rechargement
