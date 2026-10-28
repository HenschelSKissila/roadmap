# Fahrplan — henschel-roadmap

PWA de feuille de route pour la formation en **Automatisierungstechnik**. Elle regroupe parcours de cours, progression, projets, jalons, heures de travail et notes dans une interface sombre à accent ambre, utilisable sur mobile et ordinateur. Interface disponible en français, anglais et allemand.

## Fonctionnalités

- Navigation vers « Cette semaine », « Engagements », « Cours », « Progression », « Notes » et « Réglages ».
- Suivi des cours, des blocs, des jalons de projets, des heures de travail et des modules/notes.
- Authentification et synchronisation multi-appareils par Supabase; stockage local et file d’attente pour les changements hors ligne.
- Langues FR / EN / DE, import/export des données, interface installable comme PWA.
- Mise en cache des fichiers de l’application par service worker. L’API Supabase n’est pas mise en cache.

## Structure

- `index.html`, `styles.css` — application et présentation adaptative (navigation en bas sur mobile, rail latéral sur grand écran).
- `app.js`, `app-v2.js` — application, navigation, synchronisation et vues complémentaires.
- `data*.js`, `catalog-additions.js`, `catalog-meta.json`, `courses.json` — catalogue et données embarquées.
- `i18n*.js` — traductions FR / EN / DE.
- `config.js`, `supabase-schema.sql` — configuration client et schéma Supabase.
- `manifest.json`, `sw.js`, `icons/`, `install.js` — installation, icônes et fonctionnement PWA/hors ligne.
- `netlify.toml` — en-têtes et configuration Netlify.

## Créer le dépôt GitHub

Créer d’abord un dépôt vide nommé `henschel-roadmap` sur GitHub, sans README ni licence initialisés. Puis, depuis ce dossier :

```sh
git init
git add .
git commit -m "Initial commit: Fahrplan PWA"
git branch -M main
git remote add origin https://github.com/VOTRE-UTILISATEUR/henschel-roadmap.git
git push -u origin main
```

Remplacer `VOTRE-UTILISATEUR` par le nom du compte ou de l’organisation. Ne pas publier de secrets ni de clé Supabase `service_role`.

## Déploiement Netlify

1. Dans Netlify, importer le dépôt `henschel-roadmap` depuis GitHub.
2. Définir **Build command** vide et **Publish directory** à `.` (la racine du dépôt).
3. Déployer en HTTPS. Le fichier `netlify.toml` fournit les en-têtes du service worker, du manifeste et quelques en-têtes de sécurité.

## Configuration Supabase

1. Créer un projet Supabase et exécuter `supabase-schema.sql` dans **SQL Editor**. Ce schéma installe les tables, règles RLS, triggers et publication Realtime utilisés par l’application.
2. Renseigner dans `config.js` l’URL du projet et sa clé client publique/publishable :

   ```js
   window.SUPABASE_CONFIG = { url: "https://VOTRE-PROJET.supabase.co", anonKey: "VOTRE-CLE-PUBLIQUE" };
   ```

   Le navigateur nécessite une clé publique. **Ne jamais mettre une clé `service_role` dans ce dépôt.** Vérifier les réglages d’authentification (URL du site et redirections) dans Supabase pour le domaine Netlify choisi.

## Installer la PWA

- **iPhone / iPad :** ouvrir l’URL publiée dans Safari, toucher **Partager**, puis **Sur l’écran d’accueil**. L’installation iOS doit se faire depuis Safari.
- **Android :** ouvrir le site dans Chrome puis choisir **Installer l’application** ou **Ajouter à l’écran d’accueil** dans le menu/proposition du navigateur.
- **Ordinateur :** utiliser l’icône d’installation de Chrome/Edge dans la barre d’adresse ou l’option d’installation du navigateur.

Une première visite en ligne est requise pour récupérer la coque et les ressources locales. HTTPS est requis en production; `localhost` convient pour les essais locaux.

## Cache et mises à jour

Le service worker précache les fichiers énumérés dans `sw.js`. Lors d’une livraison qui modifie les ressources embarquées, incrémenter `CACHE_NAME` (par exemple `henschel-roadmap-v7`), puis publier. `activate` supprime les anciens caches de cette origine. Fermer puis rouvrir l’application installée ou recharger le site après publication pour activer la nouvelle version.

**Si la barre reste en haut sur mobile : fermer l’app installée, vider son cache / les données du site, puis la réinstaller depuis l’URL publiée.** Cette version déplace explicitement `#bottomnav` hors du header et applique les règles mobiles dans la feuille CSS externe.

## Tests locaux

Servir le dossier à la racine du site; éviter l’ouverture directe avec `file://` (les service workers y sont désactivés) :

```sh
python3 -m http.server 8765
```

Ouvrir ensuite `http://localhost:8765/`. Vérifier le changement des six onglets, les trois langues, l’authentification/Supabase (si configuré), le mode hors ligne après un premier chargement et l’installation PWA. Pour les modifications statiques, exécuter le contrôle d’intégrité sur les fichiers du site avec le script de vérification utilisé lors de la livraison; valider aussi les fichiers JS avec `node --check`.
