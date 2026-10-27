# Fahrplan · henschel-roadmap

Application web progressive de suivi de formation, projets, cours, heures et notes (FR / EN / DE). Interface sombre à grille technique, accent ambre, barre latérale sur ordinateur et navigation basse sur mobile.

## Déploiement

1. Exécuter `supabase-schema.sql` dans l’éditeur SQL du projet Supabase dédié. Le script crée les neuf tables, triggers, politiques RLS et publication Realtime.
2. `config.js` est préconfiguré avec l’URL et la clé **publique** publishable. Ne jamais remplacer par une clé `service_role`.
3. Publier ce dossier sur Netlify ou servir le dossier à la racine d’un serveur HTTP statique. Pour le test local : `python3 -m http.server 8765`.

Les neuf tables conservées sont `courses`, `blocs`, `settings`, `study_log`, `projects`, `milestones`, `project_courses`, `work_hours`, `modules`. Authentification Supabase par e-mail/mot de passe. RLS limite les données à `auth.uid()`. Le service worker met en cache les ressources locales et les icônes, jamais l’API Supabase.

## Installation

Chrome/Edge/Android : utiliser la proposition d’installation. iPhone/iPad : ouvrir dans Safari, toucher Partager puis « Sur l’écran d’accueil ». Le cœur PWA est servi hors ligne après la première visite.

## Données et sauvegardes

Le catalogue historique et les parcours existants sont préservés. Des titres du catalogue de formations fourni qui ne correspondaient pas par nom normalisé au catalogue source sont ajoutés de façon additive (durée inconnue laissée à 0 / estimée, détails à compléter); aucun cours existant n’est supprimé. Export/import et fonctions de synchronisation restent disponibles dans Réglages.

## Tests

Le dossier `tests/` contient le banc d’essai Postgres/PostgREST/stub et les suites E2E fournies. Voir `RAPPORT-VERIFICATION.md` pour les résultats réellement exécutés et les limites.
