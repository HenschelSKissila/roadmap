# Rapport de vérification

Date : 27 octobre 2026.

## Contrôles
- **Syntaxe JavaScript : PASSÉE** avec `node --check` sur les 10 fichiers applicatifs (dont app.js/app-v2.js et sw.js).
- **URL Supabase : joignable, vérification limitée** : GET sans authentification sur `/rest/v1/` renvoie HTTP 401 (réponse attendue sans clé). Aucun accès en écriture n’a été tenté.
- **PostgreSQL, pgrest/stub et E2E : non exécutés**. PostgreSQL/psql, modules Playwright/pg et privilèges root sont absents; installation OS et Chromium demandés n’ont donc pas pu être réalisés. Suites fournies conservées sous `tests/`.
- **Console, captures 375/1280, test visuel de navigation et cache SW effectif : non validés** faute de navigateur. Les icônes locales figurent dans le précache déclaré du SW, vérification statique seulement.
- **Ressources** : manifest/icônes utilisent des chemins locaux relatifs pour sous-dossier et Netlify.

## Cours ajoutés
Comparaison `courses.json` (138 entrées) avec le catalogue source `data.js`, normalisation des titres et similarité (seuil 0,78). **29** entrées de la liste sont absentes du catalogue historique et ajoutées de manière additive :

- Process visualization-hmi-scada
- Advanced Programming Paradigms (PLC) IV 2019-10
- Electric Motors Control
- Industrial Automation Masterclass DCS, PLC, SCADA & SIS
- Matlab, Simulink and Stateflow
- Model-Based Development with 100 + Interview Questions
- ROLAND EPLAN
- Skillshare - Eplan Pro Panel - Let's 3D - Beginner Course - Class 1-5
- Advanced Servo Motion Mastery 1 (Servo PLC Programming)
- Automatique des systemes lineaires (linear systems control)
- Complete Control Systems Engineering Masterclass
- Edge Computing Essentials 2024-6
- Field Oriented Motor Control Development in Matlab Simulink
- Introduction to Control Systems for Engineers
- Learn Basics of Allen Bradley Micro Logix PLC in 1.5 Hours
- Learn Basics of Beckhoff TwinCAT3 PLC in 1.5 Hours
- Learn Siemens S7-1200 PLC & HMI from Scratch using TIA
- MATLAB for Engineering Students Part 1
- MATLAB for Engineering Students Part 2
- MATLAB Programming Simulink Beginner to Pro with ChatGPT
- PMSM Real-Time Vector Control (FOC) Simulation with Simulink
- Siemens Simatic Step 7 TIA Portal
- SIEMENS TIA PORTAL PLC Course Basic & Intermediate Pt1
- Switching Strategies for Power Converters PWM Techniques
- Undergraduate course on signals and Systems (Course-I)
- Undergraduate course on signals and systems (Course-II)
- Writing an Academic Thesis - Step-by-Step Guide for Students
- AutoCAD Electrical for Automation & Electrical Engineers
- Deep-Learning-A-Z-2025

Les trois noms demandés sont présents : ROLAND EPLAN, Deep-Learning-A-Z-2025 et PMSM Real-Time Vector Control (FOC) Simulation with Simulink. Métadonnées et durées non disponibles ne sont pas inventées (durée 0, détails à compléter). Les données déjà présentes restent intactes.

## Limites
- Le nombre exact de manquants est 29 selon la liste réellement disponible et le seuil de rapprochement; il diffère de l’estimation « environ 26 ».
- Les scripts E2E sources comprennent des attentes de versions antérieures (comptes exacts codés); ils n’ont pas été adaptés/exécutés.
- Le schéma idempotent fourni assemble les scripts v1/v2. À exécuter sur le Supabase dédié; l’endpoint seul ne prouve pas le schéma ou RLS installé.
