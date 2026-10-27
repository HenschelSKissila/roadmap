// Généré automatiquement — catalogue priorisé (durées vérifiées sur Udemy quand hours_verified = true)
window.SEED = {
  "settings": {
    "weekly_hours": 8,
    "practice_factor": 1.8
  },
  "blocs": [
    {
      "id": "b0",
      "priority": 1,
      "color": "#ff5f5f",
      "name": "Urgent — Job Beckhoff (IALB)",
      "subtitle": "Opérationnel comme programmeur PLC Beckhoff / CODESYS dès la prise de poste"
    },
    {
      "id": "b2",
      "priority": 2,
      "color": "#ffb020",
      "name": "SPS & lignes de production",
      "subtitle": "Ce qui te rend recrutable comme Automatisierungs- / Inbetriebnahmeingenieur"
    },
    {
      "id": "b5",
      "priority": 3,
      "color": "#f472b6",
      "name": "Antriebstechnik & Leistungselektronik",
      "subtitle": "Le cœur de l'IALB : variateurs, moteurs, convertisseurs, motion control"
    },
    {
      "id": "b1",
      "priority": 4,
      "color": "#5b9dff",
      "name": "Regelungstechnik — Projekt & Masterarbeit (IALB)",
      "subtitle": "Modélisation, simulation, synthèse de régulateurs, HIL"
    },
    {
      "id": "b4",
      "priority": 5,
      "color": "#4ade80",
      "name": "SCADA · Réseaux · Industrie 4.0",
      "subtitle": "Supervision, bus de terrain, IoT industriel"
    },
    {
      "id": "b3",
      "priority": 6,
      "color": "#2dd4bf",
      "name": "Différenciation ingénieur",
      "subtitle": "POO automate, SCL, commande prédictive et logique floue"
    },
    {
      "id": "b8",
      "priority": 7,
      "color": "#c084fc",
      "name": "CAO électrique & armoires",
      "subtitle": "EPLAN, Pro Panel, AutoCAD Electrical, schémas industriels"
    },
    {
      "id": "b6",
      "priority": 8,
      "color": "#38bdf8",
      "name": "Fondations & outils",
      "subtitle": "Maths du signal, MATLAB, Python, C, rédaction académique"
    },
    {
      "id": "b7",
      "priority": 9,
      "color": "#fbbf24",
      "name": "Energietechnik & réseaux électriques",
      "subtitle": "Socle Energietechnik — utile mais non prioritaire pour l'automatisation"
    },
    {
      "id": "b9",
      "priority": 10,
      "color": "#6b7280",
      "name": "Hors trajectoire / plus tard",
      "subtitle": "Bon à avoir, mais ne sert pas ton objectif Automatisierungsingenieur maintenant"
    },
    {
      "id": "b10",
      "priority": 11,
      "color": "#94a3b8",
      "name": "Langues & rédaction",
      "subtitle": "Allemand, anglais, écriture académique — utile, mais hors du parcours technique"
    }
  ],
  "courses": [
    {
      "num": 10,
      "title": "Beckhoff TwinCAT 3 — PLC Programming Basics",
      "bloc": "b0",
      "hours": 1.4,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/learn-basics-of-beckhoff-twincat3-plc-in-15-hours/",
      "objective": "Créer un projet TwinCAT 3 de bout en bout : installation, configuration E/S, compilation, mise en service.",
      "skills": [
        "Environnement TwinCAT 3 (XAE/XAR)",
        "Communication PC ↔ automate/simulateur",
        "Ladder : branches, verrouillage",
        "Timers, compteurs, comparateurs",
        "Move et conversions de données",
        "Premier projet complet"
      ],
      "why": "Prise en main du jour 1 à l'IALB : c'est l'outil que tu ouvriras tous les jours.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 43,
      "title": "Introduction to Structured Text Programming in TwinCAT 3",
      "bloc": "b0",
      "hours": 2.1,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/introduction-to-beckhoff-twincat-3/",
      "objective": "Écrire du Structured Text propre sous TwinCAT : déclarations, conditions, POU, bibliothèques.",
      "skills": [
        "Déclaration de variables (VAR, VAR_GLOBAL)",
        "IF / CASE / boucles",
        "PROGRAM, FUNCTION, FUNCTION_BLOCK",
        "Utilisation des bibliothèques Beckhoff",
        "Spécificités automates Beckhoff"
      ],
      "why": "Le ST est le langage attendu à l'IALB ; ce cours est le plus court chemin vers du code lisible.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 8,
      "title": "Basic CODESYS — PLC Programming in Structured Text",
      "bloc": "b0",
      "hours": 1.9,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/basic-codesys-plc-programming-in-structured-text/",
      "objective": "Écrire son premier programme CODESYS en Structured Text et le visualiser, sans matériel.",
      "skills": [
        "Premier programme et visualisation",
        "Variables sous CODESYS",
        "Opérateurs du Structured Text",
        "Structures de contrôle (IF, CASE, boucles)",
        "Simulateur gratuit"
      ],
      "why": "Deux heures pour poser la syntaxe ST avant d'ouvrir TwinCAT : le point d'entrée le moins coûteux du bloc.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 200,
      "title": "PLC Programming — Learn the Basics with CODESYS",
      "bloc": "b0",
      "hours": 7.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-learn-the-basics-with-codesys/",
      "objective": "Poser des bases IEC 61131-3 solides et écrire une application automate complète depuis zéro.",
      "skills": [
        "Norme IEC 61131-3",
        "Les 5 langages normalisés",
        "Machines à états (state machines)",
        "Modularité du code",
        "Environnement CODESYS"
      ],
      "why": "TwinCAT 3 est un dérivé de CODESYS : tout ce que tu apprends ici se transpose directement à Beckhoff.",
      "flag": null,
      "sort_order": 40
    },
    {
      "num": 82,
      "title": "PLC Programming With Structures (UDT / DUT) in CODESYS",
      "bloc": "b0",
      "hours": 3.9,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-with-structures/",
      "objective": "Structurer les données (UDT/DUT, tableaux, énumérations) pour un code modulaire et réutilisable.",
      "skills": [
        "Création et usage des structures",
        "Tableaux de structures",
        "Modification et versionnage des UDT",
        "Structures ↔ IHM / SCADA",
        "Intégration dans un projet réel"
      ],
      "why": "Première chose que relèvera un relecteur de code à l'institut : des données structurées, pas 300 variables globales.",
      "flag": null,
      "sort_order": 50
    },
    {
      "num": 201,
      "title": "PLC Programming — Structured Programming and Design Patterns",
      "bloc": "b0",
      "hours": 15.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-structured-programming-and-design-patterns/",
      "objective": "Écrire du code automate réutilisable via des patrons de conception, sur deux machines complètes.",
      "skills": [
        "Structures de données avancées IEC 61131-3",
        "Patron « Generic Device »",
        "Gestion centralisée des signaux",
        "Projet : machine de tri",
        "Projet : ligne d'embouteillage et bouchonnage"
      ],
      "why": "C'est le cours qui fait passer de « ça marche » à « c'est maintenable » — exactement ce qu'on attend d'un HiWi ingénieur.",
      "flag": null,
      "sort_order": 60
    },
    {
      "num": 202,
      "title": "PLC Programming — Basics of Simulation with CODESYS",
      "bloc": "b0",
      "hours": 4.9,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-basics-of-simulation-with-codesys/",
      "objective": "Simuler un procédé mécatronique en ST pour tester son programme sans matériel.",
      "skills": [
        "Composants de simulation réutilisables",
        "Simulation de station de remplissage",
        "Simulation de convoyeur et suivi produit",
        "Intégration simulation ↔ programme automate"
      ],
      "why": "Indispensable à l'IALB : tu pourras développer et déboguer sans monopoliser un banc d'essai.",
      "flag": null,
      "sort_order": 70
    },
    {
      "num": 9,
      "title": "Beckhoff TwinCAT 3 — HMI Designing",
      "bloc": "b0",
      "hours": 2.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/beckhoff-twincat3-hmi-designing/",
      "objective": "Construire une IHM TwinCAT HMI liée au programme automate.",
      "skills": [
        "Boutons, voyants, listes déroulantes",
        "Images et jauges",
        "Animation et mouvement",
        "Projet : unité de traitement chimique",
        "Projet : commande de moteurs"
      ],
      "why": "Utile dès qu'un banc IALB doit être piloté par quelqu'un d'autre que toi.",
      "flag": "optionnel",
      "sort_order": 80
    },
    {
      "num": 52,
      "title": "Learn Siemens PLC & HMI — TIA Portal V20 Complete Course",
      "bloc": "b2",
      "hours": 15.9,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-plc-mastery-tia-portal-v20-from-zero-to-hero/",
      "objective": "Maîtriser la chaîne Siemens complète sur la dernière version : S7-1200/1500, WinCC, PID, alarmes.",
      "skills": [
        "Câblage automate et bases de commande",
        "Installation et configuration TIA V20",
        "Jeu d'instructions TIA",
        "Régulateur PID",
        "IHM WinCC",
        "Alarmes et sécurité"
      ],
      "why": "Siemens est la langue commune de l'industrie allemande : sans TIA Portal, la moitié des offres te sont fermées.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 203,
      "title": "Siemens TIA Portal for S7-1200 PLC Programming (PLC-SCADA-10)",
      "bloc": "b2",
      "hours": 27.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-tia-portal-for-s7-1200-plc-programming/",
      "objective": "Couvrir en profondeur la programmation S7-1200 avec projets en direct.",
      "skills": [
        "Matériel S7-1200",
        "Tags et adressage",
        "Verrouillage / interverrouillage",
        "Move, comparateurs, fonctions mathématiques",
        "Temporisations",
        "Projets guidés"
      ],
      "why": "Le volume le plus complet de ta bibliothèque sur S7-1200 — à garder comme référence plus que comme cours linéaire.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 204,
      "title": "SIEMENS TIA Portal — Advanced Level, Factory IO PLC Course Pt.2",
      "bloc": "b2",
      "hours": 18.6,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-tia-portal-advanced-level-factory-io-plc-course-pt2/",
      "objective": "Passer au niveau industriel : analogique, PID, serveur web, communication automate ↔ automate, Factory IO.",
      "skills": [
        "Signaux analogiques et mise à l'échelle",
        "Configuration Factory IO",
        "Introduction au PID",
        "Serveur web de l'automate",
        "Communication PLC ↔ PLC",
        "Accès distant",
        "IHM animée"
      ],
      "why": "Factory IO simule une vraie ligne de production : c'est le plus proche d'une mise en service que tu puisses faire chez toi.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 205,
      "title": "Learn Siemens TIA Portal, S7-1200 PLC & WinCC HMI by Scratch",
      "bloc": "b2",
      "hours": 12.5,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-and-hmi-with-tia-portal-s7-1200-plc-wincc/",
      "objective": "Parcours structuré du zéro jusqu'au SCL, au PID analogique et à Factory I/O.",
      "skills": [
        "Installation et vue d'ensemble TIA",
        "Ladder complet (bits, timers, compteurs, math)",
        "FBD et SCL",
        "Programmation analogique et PID",
        "IHM WinCC",
        "Intégration Factory I/O"
      ],
      "why": "Bonne redondance avec le cours V20 : utilise-le comme révision rapide, pas comme second parcours complet.",
      "flag": "si besoin",
      "sort_order": 40
    },
    {
      "num": 206,
      "title": "Complete Plant Design with PLC, HMI and Field Devices",
      "bloc": "b2",
      "hours": 24.5,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/complete-plant-design-with-plc-hmi-and-field-devices/",
      "objective": "Concevoir une installation complète : comptage E/S, choix automate, instruments, variateurs, vannes, câblage.",
      "skills": [
        "Comptage E/S et équipements",
        "Bilan de puissance et compensation du cos φ",
        "Choix de l'automate et des instruments",
        "Circuits de commande moteur",
        "Variateurs de vitesse",
        "Vannes de régulation",
        "Câblage et matériel"
      ],
      "why": "C'est le cours « vision d'ensemble » : il relie ce que tu sais faire (code) à ce qu'on te demandera de dimensionner.",
      "flag": null,
      "sort_order": 50
    },
    {
      "num": 207,
      "title": "Complete PLC Allen Bradley Studio 5000 / RSLogix 5000",
      "bloc": "b2",
      "hours": 22.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/complete-plc-allen-bradley-studio-5000-rslogix-5000-course/",
      "objective": "Programmer l'écosystème Rockwell de zéro jusqu'au niveau avancé.",
      "skills": [
        "Réseau et matériel Allen Bradley",
        "Instructions de base et avancées",
        "Premier programme terrain",
        "Programmation avancée",
        "IHM Rockwell"
      ],
      "why": "Deuxième plateforme après Siemens : ouvre les postes chez les intégrateurs travaillant pour l'automobile et l'agroalimentaire.",
      "flag": "si besoin",
      "sort_order": 60
    },
    {
      "num": 208,
      "title": "Learn Industrial Automation with 7+ Real Projects using PLC",
      "bloc": "b2",
      "hours": 10,
      "hours_verified": false,
      "url": "https://www.udemy.com/course/learn-industrial-automation-with-5-real-projects-using-plc/",
      "objective": "Enchaîner des projets d'automatisation complets plutôt que des exercices isolés.",
      "skills": [
        "Cahier des charges → programme",
        "Séquences industrielles",
        "Diagnostic et défauts",
        "Projets multi-plateformes"
      ],
      "why": "Le format projet est ce qui remplit un portfolio d'entretien : tu montres, tu ne racontes pas.",
      "flag": null,
      "sort_order": 70
    },
    {
      "num": 209,
      "title": "PLC — Programmable Logic Controller from Industry Practice",
      "bloc": "b2",
      "hours": 2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-course-industry-practice/",
      "objective": "Revoir vite les fondamentaux automate avec des programmes types du terrain.",
      "skills": [
        "Schéma-bloc d'un automate",
        "Langages normalisés",
        "Timers, compteurs, comparateurs",
        "Programmes de base à reproduire"
      ],
      "why": "Format court : parfait comme révision avant un entretien technique.",
      "flag": null,
      "sort_order": 80
    },
    {
      "num": 210,
      "title": "Introduction to PLC — Programmable Logic Controllers Basics",
      "bloc": "b2",
      "hours": 4.8,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/programmable-logic-controllers/",
      "objective": "Comprendre le matériel automate et la logique à relais avant d'écrire une ligne de code.",
      "skills": [
        "Types d'automates et matériel",
        "Ladder et portes logiques",
        "Exercices : simulation de porte",
        "Exercice : cuve de mélange avec séquences et verrouillages"
      ],
      "why": "À cocher rapidement : tu connais déjà l'essentiel, garde-le pour combler les trous.",
      "flag": "si besoin",
      "sort_order": 90
    },
    {
      "num": 211,
      "title": "Principles of PLC's Ladder Logic (LD) Programming",
      "bloc": "b2",
      "hours": 7.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/principles-of-plcs-ladder-logic-programming/",
      "objective": "Maîtriser le Ladder — le langage que tu liras chez le client même si tu écris en ST.",
      "skills": [
        "Logique à relais → Ladder",
        "Instructions Ladder",
        "Conception d'applications automate",
        "Simulateurs alternatifs",
        "Matériel SLC500"
      ],
      "why": "En mise en service, 80 % du code existant est en Ladder : savoir le lire est non négociable.",
      "flag": null,
      "sort_order": 100
    },
    {
      "num": 212,
      "title": "PLC and HMI Development with Siemens TIA Portal 2022",
      "bloc": "b2",
      "hours": 9,
      "hours_verified": false,
      "url": null,
      "objective": "Développer conjointement le programme automate et l'IHM sous TIA Portal.",
      "skills": [
        "Projet TIA intégré PLC + HMI",
        "Écrans et navigation",
        "Tags partagés",
        "Alarmes IHM"
      ],
      "why": "Recouvre en grande partie le cours V20 — à traiter en accéléré.",
      "flag": "si besoin",
      "sort_order": 110
    },
    {
      "num": 213,
      "title": "PLC Programming in Siemens TIA Portal",
      "bloc": "b2",
      "hours": 7,
      "hours_verified": false,
      "url": null,
      "objective": "Consolider la programmation TIA Portal sur des cas classiques.",
      "skills": [
        "Blocs OB/FB/FC/DB",
        "Instructions standard",
        "Structuration d'un projet"
      ],
      "why": "Doublon partiel : sert de rattrapage ciblé.",
      "flag": "si besoin",
      "sort_order": 120
    },
    {
      "num": 214,
      "title": "Siemens TIA Portal — PLC Programming Basics",
      "bloc": "b2",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Reprendre les bases TIA Portal pas à pas.",
      "skills": [
        "Création de projet",
        "Configuration matérielle",
        "Ladder de base",
        "Test en ligne"
      ],
      "why": "Niveau d'entrée : à survoler.",
      "flag": "si besoin",
      "sort_order": 130
    },
    {
      "num": 215,
      "title": "Siemens TIA Portal — S7-1200 PLC Basics",
      "bloc": "b2",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Découvrir le S7-1200 et sa configuration matérielle.",
      "skills": [
        "Gamme S7-1200",
        "Modules E/S",
        "Adressage",
        "Premiers blocs"
      ],
      "why": "Niveau d'entrée : à survoler.",
      "flag": "si besoin",
      "sort_order": 140
    },
    {
      "num": 216,
      "title": "Siemens TIA Portal — HMI Basics",
      "bloc": "b2",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Créer une IHM Siemens simple et la lier à l'automate.",
      "skills": [
        "Écrans et objets",
        "Liaison tags",
        "Navigation",
        "Alarmes simples"
      ],
      "why": "Complément court au bloc SCADA.",
      "flag": "si besoin",
      "sort_order": 150
    },
    {
      "num": 217,
      "title": "Siemens TIA Portal — S7-1200 PLC & WinCC Advanced (Level 2)",
      "bloc": "b2",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Monter d'un cran sur S7-1200 + WinCC Advanced.",
      "skills": [
        "Blocs de fonction paramétrés",
        "Analogique et mise à l'échelle",
        "Recettes",
        "Archivage WinCC"
      ],
      "why": "Utile après le cours V20, pour l'archivage et les recettes.",
      "flag": null,
      "sort_order": 160
    },
    {
      "num": 218,
      "title": "Learn Siemens S7-1200 PLC in TIA Portal",
      "bloc": "b2",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Parcours S7-1200 orienté pratique.",
      "skills": [
        "Configuration matérielle",
        "Instructions courantes",
        "Mise au point en ligne"
      ],
      "why": "Doublon : à garder en réserve.",
      "flag": "si besoin",
      "sort_order": 170
    },
    {
      "num": 219,
      "title": "SIMATIC PLC Programming with Hands-On Projects",
      "bloc": "b2",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Appliquer SIMATIC sur des projets guidés.",
      "skills": [
        "Projets SIMATIC pas à pas",
        "Séquenceurs",
        "Gestion des défauts"
      ],
      "why": "Format projet, bon pour le portfolio.",
      "flag": null,
      "sort_order": 180
    },
    {
      "num": 220,
      "title": "Programmer des automates Siemens sur TIA en LAD/FBD (FR)",
      "bloc": "b2",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Reprendre LAD et FBD en français pour verrouiller le vocabulaire technique.",
      "skills": [
        "Ladder (LAD)",
        "Logigramme (FBD)",
        "Blocs d'organisation",
        "Vocabulaire normalisé FR"
      ],
      "why": "Utile pour ancrer les termes en français avant de les traduire en allemand (Verriegelung, Ablaufkette…).",
      "flag": "optionnel",
      "sort_order": 190
    },
    {
      "num": 221,
      "title": "Learn Siemens S7-300 PLC & WinCC HMI/SCADA in TIA Portal",
      "bloc": "b2",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Travailler la génération S7-300, encore très présente dans le parc installé.",
      "skills": [
        "Matériel S7-300",
        "Migration vers TIA",
        "WinCC associé"
      ],
      "why": "Beaucoup de machines allemandes tournent encore en S7-300 : utile en rétrofit et maintenance.",
      "flag": "si besoin",
      "sort_order": 200
    },
    {
      "num": 222,
      "title": "Learn Siemens S7-300 PLC, SIMATIC Manager Step 7 & WinCC HMI",
      "bloc": "b2",
      "hours": 9,
      "hours_verified": false,
      "url": null,
      "objective": "Maîtriser l'ancien environnement Step 7 (SIMATIC Manager).",
      "skills": [
        "SIMATIC Manager",
        "Step 7 classique",
        "WinCC flexible",
        "Diagnostic sur parc ancien"
      ],
      "why": "Compétence de niche mais recherchée en rétrofit d'installations existantes.",
      "flag": "si besoin",
      "sort_order": 210
    },
    {
      "num": 223,
      "title": "Learn Siemens PLC from Scratch Using SIMATIC Manager",
      "bloc": "b2",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Découvrir Step 7 classique depuis zéro.",
      "skills": [
        "Projet SIMATIC Manager",
        "Blocs OB/FB/FC",
        "Tables de variables"
      ],
      "why": "Doublon avec le cours précédent.",
      "flag": "si besoin",
      "sort_order": 220
    },
    {
      "num": 224,
      "title": "Siemens SIMATIC Step 7 & WinCC HMI",
      "bloc": "b2",
      "hours": 7,
      "hours_verified": false,
      "url": null,
      "objective": "Coupler Step 7 et WinCC sur une application type.",
      "skills": [
        "Step 7",
        "WinCC",
        "Liaison automate ↔ supervision"
      ],
      "why": "Doublon : réserve.",
      "flag": "si besoin",
      "sort_order": 230
    },
    {
      "num": 225,
      "title": "Learn Allen Bradley MicroLogix PLC Programming from Scratch",
      "bloc": "b2",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Découvrir la gamme compacte Rockwell.",
      "skills": [
        "MicroLogix",
        "RSLogix 500",
        "Ladder Rockwell"
      ],
      "why": "Complément mineur au cours Studio 5000.",
      "flag": "optionnel",
      "sort_order": 240
    },
    {
      "num": 226,
      "title": "Everything About PLC Programming with Examples",
      "bloc": "b2",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Balayer les instructions automate par l'exemple.",
      "skills": [
        "Catalogue d'instructions",
        "Exemples commentés",
        "Cas industriels courts"
      ],
      "why": "Recueil d'exemples : bon en consultation ponctuelle.",
      "flag": "si besoin",
      "sort_order": 250
    },
    {
      "num": 227,
      "title": "Industrial Instrumentation Maintenance Engineer",
      "bloc": "b2",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Comprendre l'entretien et l'étalonnage des instruments de mesure.",
      "skills": [
        "Étalonnage capteurs",
        "Boucles 4-20 mA",
        "Diagnostic instrument",
        "Maintenance préventive"
      ],
      "why": "Utile en mise en service : tu sauras si le défaut vient du capteur ou du code.",
      "flag": "optionnel",
      "sort_order": 260
    },
    {
      "num": 228,
      "title": "Instrumentation and Control Engineering Bootcamp",
      "bloc": "b2",
      "hours": 8.6,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/instrumentation-and-control-engineering-bootcamp/",
      "objective": "Couvrir les quatre piliers : instruments de mesure, vannes de régulation, actionneurs, SCADA.",
      "skills": [
        "Mesure de température, pression, niveau, débit",
        "Vannes de régulation et actionneurs",
        "Composants d'une vanne industrielle",
        "Introduction SCADA"
      ],
      "why": "La partie mesure te manque venant du génie électrique : c'est le complément le plus rentable.",
      "flag": null,
      "sort_order": 270
    },
    {
      "num": 229,
      "title": "Introduction to Process Control and Instrumentation",
      "bloc": "b2",
      "hours": 3.1,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/introduction-to-process-control-and-instrumentation/",
      "objective": "Relier théorie de la régulation et instrumentation réelle du procédé.",
      "skills": [
        "Boucles de régulation et symbologie ISA",
        "Algorithmes de régulateur et réglage",
        "Transmetteurs",
        "Mesures température / pression / débit"
      ],
      "why": "Court et visuel : fait le pont entre ta Regelungstechnik théorique et le terrain.",
      "flag": null,
      "sort_order": 280
    },
    {
      "num": 230,
      "title": "Read & Understand P&ID — Masterclass",
      "bloc": "b2",
      "hours": 5.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/pid-mastery-the-ultimate-course-for-engineering-profession/",
      "objective": "Lire un schéma P&ID comme un document d'ingénierie et non comme un dessin.",
      "skills": [
        "Symboles P&ID",
        "Numérotation et révisions",
        "BPCS (système de conduite)",
        "Système d'alarme",
        "Système instrumenté de sécurité (SIS)",
        "Cycle de vie du P&ID"
      ],
      "why": "En réunion de mise en service, le P&ID est le document sur la table : savoir le lire te met au niveau.",
      "flag": null,
      "sort_order": 290
    },
    {
      "num": 34,
      "title": "IEC 60204-1 — Safety of Machinery",
      "bloc": "b2",
      "hours": 2,
      "hours_verified": false,
      "url": null,
      "objective": "Appliquer les exigences de sécurité électrique des machines.",
      "skills": [
        "Équipement électrique des machines",
        "Arrêt d'urgence et catégories d'arrêt",
        "Protection contre les chocs électriques",
        "Documentation exigée"
      ],
      "why": "Norme citée dans presque toutes les offres Inbetriebnahme en Allemagne.",
      "flag": "à acquérir",
      "sort_order": 300
    },
    {
      "num": 35,
      "title": "IEC 61511 — Functional Safety SIS / SIL",
      "bloc": "b2",
      "hours": 7,
      "hours_verified": false,
      "url": null,
      "objective": "Calculer un SIL et concevoir un système instrumenté de sécurité.",
      "skills": [
        "Analyse de risque",
        "Détermination du SIL",
        "Architecture SIS",
        "Cycle de vie sécurité"
      ],
      "why": "Différenciant fort : peu de jeunes ingénieurs savent parler SIL.",
      "flag": "à acquérir",
      "sort_order": 310
    },
    {
      "num": 231,
      "title": "PLC Fundamentals (Level I) — Paul Lynn",
      "bloc": "b2",
      "hours": 14.43,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-from-scratch/",
      "objective": "Construire un programme automate complet depuis zéro : E/S, logique de procédé, alarmes, IHM.",
      "skills": [
        "Vue d'ensemble de la programmation automate",
        "Entrées / sorties et câblage",
        "Fondamentaux Ladder (RSLogix 500)",
        "Structuration d'un programme",
        "Logique de procédé",
        "Alarmes et notifications",
        "Introduction à l'IHM"
      ],
      "why": "La pédagogie de référence pour l'automatisme, mais sur RSLogix 500 : tu y vas pour la méthode de conception, pas pour l'outil.",
      "flag": "si besoin",
      "sort_order": 320
    },
    {
      "num": 232,
      "title": "Applied Logic (Level 2) — Paul Lynn",
      "bloc": "b2",
      "hours": 8.47,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc_programming/",
      "objective": "Concevoir soi-même des applications Ladder complexes à partir de cahiers des charges industriels.",
      "skills": [
        "Instructions de niveau intermédiaire",
        "Logique de commande numérique",
        "Station de remplissage",
        "Gestion de stock",
        "Application servo multi-positions",
        "Débitmètre numérique et compteur horaire"
      ],
      "why": "C'est de l'entraînement à la conception, pas du tutoriel : exactement ce qui manque quand on sait lire du code mais pas en écrire.",
      "flag": "si besoin",
      "sort_order": 330
    },
    {
      "num": 233,
      "title": "TIA Portal Master Project (Level 5) — Paul Lynn",
      "bloc": "b2",
      "hours": 29.48,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-tia-portal-step-7-wincc-plc-hmi/",
      "objective": "Développer une solution automate + IHM complète sous TIA Portal, dans les cinq langages.",
      "skills": [
        "Installation et prise en main TIA Portal",
        "Ladder (LAD)",
        "Logigramme (FBD)",
        "Texte structuré (SCL)",
        "Liste d'instructions (STL)",
        "Grafcet (GRAPH)",
        "Programmation IHM",
        "Projet complet de bout en bout"
      ],
      "why": "29 h et un projet unique de A à Z : c'est le cours TIA le plus complet de ta bibliothèque, et GRAPH + SCL sont exactement ce qu'on demande en mise en service.",
      "flag": null,
      "sort_order": 340
    },
    {
      "num": 95,
      "title": "Siemens SINAMICS S120 — Service and Commissioning",
      "bloc": "b5",
      "hours": 9.4,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-sinamics-s120-service-and-commissioning/",
      "objective": "Mettre en service et diagnostiquer un variateur S120 de bout en bout.",
      "skills": [
        "Unités de commande et composants système",
        "Projet STARTER et connexion cible",
        "Modules de puissance Booksize et Chassis",
        "Régulation en mode servo",
        "Régulation en mode vectoriel",
        "Canaux de consigne, diagnostic, fonctions de sécurité"
      ],
      "why": "C'est exactement le métier de l'IALB (Institut für elektrische Antriebe) : le cours le plus aligné de toute ta bibliothèque.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 234,
      "title": "PLC & AC Drive with Automatic & Manual Industrial Control",
      "bloc": "b5",
      "hours": 19.4,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-ac-drive-with-automatic-manual-industrial-control/",
      "objective": "Relier commande automate, variateur de vitesse et circuits de commande classiques.",
      "skills": [
        "Appareillage de commande électrique",
        "Machines électriques : fondamentaux",
        "Circuits à commande manuelle",
        "Variateur de vitesse (VFD)",
        "Automate avancé"
      ],
      "why": "Le chaînon manquant entre ton cours de Antriebstechnik et une armoire réelle.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 235,
      "title": "Siemens TIA Portal — S7-1200 PLC Motion Control",
      "bloc": "b5",
      "hours": 2.35,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-tia-portal-s71200-plc-motion-control/",
      "objective": "Piloter servomoteur et moteur pas à pas depuis un S7-1200 (signaux impulsion/direction).",
      "skills": [
        "Technologie Motion Control TIA",
        "Configuration servo Panasonic",
        "Signaux impulsion/direction",
        "Câblage motion",
        "IHM WinCC associée"
      ],
      "why": "Motion control = lignes de production et robots cartésiens : compétence directement monnayable.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 236,
      "title": "Siemens S7-1200 Motion Control Using Stepper Motor",
      "bloc": "b5",
      "hours": 3,
      "hours_verified": false,
      "url": null,
      "objective": "Mettre en œuvre un axe pas à pas complet.",
      "skills": [
        "Objet technologique axe",
        "Référencement (homing)",
        "Profils de déplacement",
        "Diagnostic axe"
      ],
      "why": "Complément pratique au cours Motion Control.",
      "flag": "optionnel",
      "sort_order": 40
    },
    {
      "num": 237,
      "title": "Design of Electric Motors from Scratch",
      "bloc": "b5",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Dimensionner une machine électrique depuis le cahier des charges.",
      "skills": [
        "Dimensionnement magnétique",
        "Bobinage",
        "Pertes et rendement",
        "Refroidissement"
      ],
      "why": "Va plus loin que ce qu'on demande à un automaticien, mais c'est exactement le vocabulaire de l'IALB.",
      "flag": "selon sujet",
      "sort_order": 50
    },
    {
      "num": 238,
      "title": "Designing of Power Electronic Converters in MATLAB/Simulink",
      "bloc": "b5",
      "hours": 3.8,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/designing-of-power-electronic-converters-in-matlabsimulink/",
      "objective": "Simuler les quatre familles de convertisseurs sous Simulink.",
      "skills": [
        "Redresseurs AC→DC mono et triphasés",
        "Gradateurs et cycloconvertisseurs AC→AC",
        "Hacheurs DC→DC élévateur / abaisseur",
        "Onduleurs DC→AC"
      ],
      "why": "Si ton Projekt IALB touche à l'électronique de puissance, c'est le démarrage le plus rapide.",
      "flag": "selon sujet",
      "sort_order": 60
    },
    {
      "num": 66,
      "title": "MATLAB/Simulink for Power Electronics Simulations",
      "bloc": "b5",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Approfondir la simulation de l'électronique de puissance.",
      "skills": [
        "Modèles de commutateurs",
        "MLI (PWM)",
        "Boucles de régulation de courant",
        "Analyse harmonique"
      ],
      "why": "Doublon partiel avec le cours ci-dessus : à choisir, pas à cumuler.",
      "flag": "selon sujet",
      "sort_order": 70
    },
    {
      "num": 93,
      "title": "Siemens G120 & G120C — AC VFD Driver Training",
      "bloc": "b5",
      "hours": 1.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-g120-g120c-ac-vfd-driver-training/",
      "objective": "Mettre en service et paramétrer un variateur G120 via Profinet.",
      "skills": [
        "Paramétrage G120",
        "Mise en service rapide",
        "Profinet et télégrammes",
        "Diagnostic défauts"
      ],
      "why": "Le G120 est le variateur le plus courant en machine standard allemande.",
      "flag": null,
      "sort_order": 80
    },
    {
      "num": 65,
      "title": "MATLAB/Simulink Bible — Go From Zero to Hero + ChatGPT",
      "bloc": "b1",
      "hours": 8.15,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/matlabsimulink-biblego-from-zero-to-hero/",
      "objective": "Apprendre Simulink par dix projets complets, du signal sinusoïdal au régulateur adaptatif.",
      "skills": [
        "Génération et export de signaux",
        "Dérivation / intégration en Simulink",
        "Système masse-ressort-amortisseur (temporel et Laplace)",
        "Modèle de batterie",
        "PID sous Simulink et réglage",
        "Régulateur de vitesse adaptatif"
      ],
      "why": "Colonne vertébrale de ton Projekt Regelungstechnik : format projet, directement réutilisable en rapport.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 239,
      "title": "Ultimate Automatic Control Theory in Electrical Engineering",
      "bloc": "b1",
      "hours": 35.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/automatic-control-theory/",
      "objective": "Couvrir toute la théorie de la commande classique, du modèle mathématique au Nyquist.",
      "skills": [
        "Modélisation mathématique des systèmes",
        "Réduction de schéma-blocs et graphes de fluence",
        "Réponse temporelle et stabilité",
        "Lieu des racines",
        "Correcteurs et PID",
        "Plan polaire et critère de Nyquist",
        "Commande vectorielle, PV et MPPT"
      ],
      "why": "Le plus gros volume du catalogue : à traiter par chapitres ciblés selon ton sujet, pas d'un bloc.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 14,
      "title": "Control System, Optimization and Hardware-in-the-Loop Simulation",
      "bloc": "b1",
      "hours": 6.95,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/control-system-and-optimization-using-matlab/",
      "objective": "Optimiser une boucle de régulation puis la tester en HIL avec Arduino.",
      "skills": [
        "Bases de la commande sous MATLAB/Simulink",
        "Méthodes d'optimisation appliquées",
        "Connexion Arduino ↔ Simulink",
        "Boucle matérielle (HIL)"
      ],
      "why": "Le HIL est ce qui sépare une simulation d'un banc d'essai — argument fort pour un poste d'Inbetriebnahme.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 83,
      "title": "Practical Control System Design — Classical & Modern Methods",
      "bloc": "b1",
      "hours": 3.83,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/computer-aided-control-systems-design_control-system-toolbox/",
      "objective": "Concevoir un régulateur avec la Control System Toolbox, du modèle LTI à la commande robuste.",
      "skills": [
        "Modélisation avec Control System Toolbox",
        "Analyse des modèles LTI",
        "Control System Designer",
        "Commande d'un moteur : stratégies",
        "Commande robuste",
        "Model-Based Design, RCP et HIL"
      ],
      "why": "Court et dense : la méthode de travail attendue pour un Projekt en régulation.",
      "flag": null,
      "sort_order": 40
    },
    {
      "num": 240,
      "title": "Process Control — Hands-On for Dynamic Mathematical Modeling",
      "bloc": "b1",
      "hours": 8.87,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/jmhtraining-pc01/",
      "objective": "Établir des modèles dynamiques par bilans de matière, de composants et d'énergie.",
      "skills": [
        "Principes de modélisation",
        "Bilan de matière",
        "Bilan de composants",
        "Bilan d'énergie",
        "Difficulté croissante par exercices"
      ],
      "why": "La modélisation est ce qui bloque la plupart des Masterarbeiten : ce cours est du pur entraînement.",
      "flag": null,
      "sort_order": 50
    },
    {
      "num": 241,
      "title": "Control Systems — From Mathematical Modelling to PID Control",
      "bloc": "b1",
      "hours": 2.93,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/control-systems-pid/",
      "objective": "Aller du modèle mathématique au réglage PID en un parcours court.",
      "skills": [
        "Modélisation mécanique et électrique",
        "Dynamique des systèmes",
        "Théorie de la commande",
        "Conception PID et Ziegler-Nichols"
      ],
      "why": "Format court : bonne remise à niveau avant d'attaquer les cours lourds.",
      "flag": null,
      "sort_order": 60
    },
    {
      "num": 68,
      "title": "Modeling, Simulation and Control using Python",
      "bloc": "b1",
      "hours": 1.45,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/modeling-simulation-and-control-using-python/",
      "objective": "Utiliser Python comme outil de simulation de systèmes commandés.",
      "skills": [
        "Dynamique longitudinale d'un véhicule",
        "Modèle masse-ressort-amortisseur",
        "Modèle quart de véhicule",
        "PID en Python"
      ],
      "why": "Alternative libre à MATLAB : utile si ton institut te demande des résultats reproductibles sans licence.",
      "flag": null,
      "sort_order": 70
    },
    {
      "num": 242,
      "title": "Learn Simulink Professionally and Advance in Your Career",
      "bloc": "b1",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Travailler Simulink en profondeur au-delà des blocs de base.",
      "skills": [
        "Bibliothèques Simulink",
        "Sous-systèmes et masques",
        "Solveurs et pas de calcul",
        "Debug de modèle"
      ],
      "why": "Complément direct à la Simulink Bible.",
      "flag": null,
      "sort_order": 80
    },
    {
      "num": 243,
      "title": "How to Code a MATLAB/Simulink Automation from Scratch",
      "bloc": "b1",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Automatiser MATLAB/Simulink par script au lieu de tout faire à la souris.",
      "skills": [
        "API Simulink en ligne de commande",
        "Génération de modèles par script",
        "Lancement de campagnes de simulation",
        "Post-traitement automatisé"
      ],
      "why": "Gain de temps énorme dès que ta Masterarbeit demande des dizaines de simulations paramétrées.",
      "flag": null,
      "sort_order": 90
    },
    {
      "num": 244,
      "title": "System Simulation Projects with Python",
      "bloc": "b1",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Construire des simulations de systèmes complètes en Python.",
      "skills": [
        "SciPy / solveurs d'EDO",
        "Modèles multi-domaines",
        "Visualisation des résultats"
      ],
      "why": "Complément Python à ton socle MATLAB.",
      "flag": "optionnel",
      "sort_order": 100
    },
    {
      "num": 245,
      "title": "Control Systems Made Simple — Beginner's Guide",
      "bloc": "b1",
      "hours": 3,
      "hours_verified": false,
      "url": null,
      "objective": "Reprendre les bases de la régulation en format court.",
      "skills": [
        "Fonction de transfert",
        "Réponse indicielle",
        "Stabilité",
        "Actions P, I, D"
      ],
      "why": "Révision uniquement : tu as déjà ce niveau.",
      "flag": "si besoin",
      "sort_order": 110
    },
    {
      "num": 246,
      "title": "Process Visualization (Level 3) — Paul Lynn",
      "bloc": "b4",
      "hours": 17.02,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/hmi-scada/",
      "objective": "Concevoir l'interface que l'opérateur utilisera : supervision, paramétrage, acquisition et archivage.",
      "skills": [
        "Concepts IHM et SCADA",
        "Théorie de la visualisation de procédé",
        "Panorama des outils et technologies",
        "Pilotes et communications",
        "C-More",
        "FactoryTalk View Studio",
        "AdvancedHMI"
      ],
      "why": "La partie théorie (ce qu'on montre à l'opérateur et pourquoi) vaut à elle seule le détour ; les outils ne sont pas les tiens, WinCC reste ta cible.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 247,
      "title": "Siemens WinCC Professional SCADA (Advanced)",
      "bloc": "b4",
      "hours": 7.13,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/advance-siemens-wincc-professional-scada-course/",
      "objective": "Concevoir une supervision professionnelle : historiques, droits, diagnostic.",
      "skills": [
        "Communication et sécurité automate",
        "Réglages runtime",
        "Gestion des tags IHM",
        "Listes de textes et de graphiques",
        "Courbes et export de données historiques",
        "Administration des utilisateurs",
        "Diagnostic de voie"
      ],
      "why": "La supervision est souvent ce qu'on confie en premier à un nouvel ingénieur — visible et valorisant.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 103,
      "title": "Siemens WinCC SCADA Advanced-2 Training — TIA Portal V20",
      "bloc": "b4",
      "hours": 1.37,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/endustriyel-otomasyonun-kalbi-hmi-egitim-tia-portal-v20/",
      "objective": "Compléter la supervision : alarmes, journalisation, recettes, rapports, sécurité.",
      "skills": [
        "Objets graphiques et champs E/S",
        "Courbes temps réel",
        "Gestion des utilisateurs",
        "Alarmes et archivage",
        "Recettes et rapports",
        "Génération du runtime"
      ],
      "why": "Format très court : à enchaîner juste après WinCC Professional.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 248,
      "title": "HMI SCADA Programming — SIMATIC WinCC V7 (Level 1)",
      "bloc": "b4",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Découvrir WinCC V7, la plateforme SCADA站 autonome de Siemens.",
      "skills": [
        "Architecture WinCC V7",
        "Graphics Designer",
        "Tag Logging et Alarm Logging",
        "Rapports"
      ],
      "why": "WinCC V7 équipe les installations lourdes (chimie, énergie) — différent du WinCC de TIA.",
      "flag": "si besoin",
      "sort_order": 40
    },
    {
      "num": 2,
      "title": "An Introduction to Profibus DP Networking",
      "bloc": "b4",
      "hours": 2.92,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/an-introduction-to-profibus-dp-networking/",
      "objective": "Câbler, configurer et diagnostiquer un réseau Profibus DP de bout en bout.",
      "skills": [
        "Principe et rôle de Profibus DP",
        "Connecteurs, câblage, terminaison",
        "Construction pas à pas d'un réseau",
        "Diagnostic et dépannage",
        "Fichiers GSD",
        "Simulation S7-PLCSIM"
      ],
      "why": "Profibus reste massivement installé en Allemagne : le diagnostic réseau est une compétence rare et payée.",
      "flag": null,
      "sort_order": 50
    },
    {
      "num": 44,
      "title": "IoT Full Project Course",
      "bloc": "b4",
      "hours": 14.5,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/iot-full-project-course/",
      "objective": "Construire une chaîne IoT complète : capteur ESP32 en C++, serveur, client Python.",
      "skills": [
        "ESP32 et ESP-IDF",
        "Architecture du firmware",
        "Gestion Wi-Fi",
        "Acquisition capteur",
        "Serveur backend IoT",
        "Interface client Python"
      ],
      "why": "Industrie 4.0 concrète : tu peux instrumenter un banc IALB et remonter les mesures toi-même.",
      "flag": null,
      "sort_order": 60
    },
    {
      "num": 249,
      "title": "Internet of Things (IoT) — The Mega Course",
      "bloc": "b4",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "Balayer largement l'écosystème IoT.",
      "skills": [
        "Protocoles IoT",
        "Plateformes cloud",
        "Capteurs et passerelles",
        "Tableaux de bord"
      ],
      "why": "Large mais généraliste : à piocher par sujets.",
      "flag": "si besoin",
      "sort_order": 70
    },
    {
      "num": 250,
      "title": "Introduction to IoT with Edge Devices, Sensors and Protocols",
      "bloc": "b4",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Comprendre les protocoles et l'architecture edge de l'IoT industriel.",
      "skills": [
        "MQTT et protocoles",
        "Passerelles edge",
        "Capteurs industriels",
        "Sécurité des échanges"
      ],
      "why": "Bon complément court à l'IoT Full Project Course.",
      "flag": null,
      "sort_order": 80
    },
    {
      "num": 251,
      "title": "STM32 AWS IoT Core Bootcamp — MQTT, OTA, ESP32 Wi-Fi",
      "bloc": "b4",
      "hours": 7,
      "hours_verified": false,
      "url": null,
      "objective": "Connecter un microcontrôleur au cloud AWS via MQTT, avec mise à jour OTA.",
      "skills": [
        "MQTT sur AWS IoT Core",
        "Sécurité par certificats",
        "Mises à jour OTA",
        "ESP32 / STM32"
      ],
      "why": "Niveau embarqué avancé : pertinent seulement si ton sujet part vers le edge.",
      "flag": "selon sujet",
      "sort_order": 90
    },
    {
      "num": 252,
      "title": "Edge Computing Essentials — Concepts to Real-World Use Cases",
      "bloc": "b4",
      "hours": 2.07,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/edge-computing-essentials-concepts-to-real-world-use-cases/",
      "objective": "Situer l'edge computing dans une architecture industrielle et le pratiquer avec Node-RED.",
      "skills": [
        "Architectures et modèles de déploiement edge",
        "Technologies habilitantes",
        "Infrastructure et runtime",
        "Cas d'usage industriels",
        "Pratique Node-RED + ThingsBoard"
      ],
      "why": "Court, et donne le vocabulaire Industrie 4.0 qu'on attend en entretien.",
      "flag": null,
      "sort_order": 100
    },
    {
      "num": 36,
      "title": "Industrial Cybersecurity & IEC 62443 Specialist",
      "bloc": "b4",
      "hours": 13.9,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/industrial-cybersecurity-iec-62443-specialist/",
      "objective": "Sécuriser une architecture OT : exigences 62443, zones et conduits, sécurité réseau par couche.",
      "skills": [
        "Exigences fondamentales IEC 62443",
        "Contexte sécurité réseau",
        "Couches physique et liaison",
        "Couche réseau et sécurité IP",
        "Couches transport et application",
        "Outils d'optimisation et de sécurité réseau"
      ],
      "why": "La cybersécurité OT est devenue obligatoire dans les appels d'offres : c'est un vrai différenciateur.",
      "flag": null,
      "sort_order": 110
    },
    {
      "num": 1,
      "title": "IEC Paradigms (Level 4) — Paul Lynn (ex-Advanced Programming Paradigms, PLC IV)",
      "bloc": "b3",
      "hours": 15.93,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/advanced-plc-programming/",
      "objective": "Maîtriser les cinq langages de la norme IEC 61131-3 sur trois environnements différents.",
      "skills": [
        "Paradigmes de programmation",
        "Ladder (LD) et logigramme (FBD)",
        "Grafcet (SFC) et liste d'instructions (IL)",
        "Texte structuré (ST)",
        "RSLogix 5000 face à RSLogix 500",
        "Connected Components Workbench",
        "Automation Builder (CODESYS)"
      ],
      "why": "Le cours le plus utile de la série pour toi : il couvre le ST et CODESYS, donc directement transposable à TwinCAT à l'IALB. Attention, il ne parle pas de POO — c'était une erreur dans ton brief.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 253,
      "title": "PLC Programming — Advanced Object Oriented Programming (OOP)",
      "bloc": "b3",
      "hours": 7.13,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-programming-advanced-object-oriented-programming-oop/",
      "objective": "Appliquer la POO à l'automate sous CODESYS V3 : héritage, interfaces, polymorphisme.",
      "skills": [
        "Méthodes et propriétés",
        "Pointeurs et références",
        "Héritage (relation « EST-UN »)",
        "Interfaces et polymorphisme (« SAIT-FAIRE »)",
        "Bonnes pratiques POO automate"
      ],
      "why": "TwinCAT 3 supporte pleinement la POO : c'est ce qui te distinguera d'un automaticien formé sur le tas.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 254,
      "title": "PLC Object Oriented Programming — Advanced Infrastructure",
      "bloc": "b3",
      "hours": 13,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/plc-object-oriented-programming-advanced-infastrucutre/",
      "objective": "Construire une infrastructure logicielle automate complète en POO, avec un gros projet final.",
      "skills": [
        "Révision Structured Text",
        "Classes, méthodes, propriétés",
        "Héritage et polymorphisme",
        "Spécificateurs d'accès",
        "Interfaces et abstractions",
        "Délégation et machines à états avancées",
        "Projet complet (38 leçons)"
      ],
      "why": "Le prolongement naturel du cours POO : le projet final vaut à lui seul une ligne de CV.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 255,
      "title": "Siemens PLC Programming Using SCL — Part 2 (TIA Portal)",
      "bloc": "b3",
      "hours": 5.35,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-plc-programming-using-scl-part-2-tia-portal/",
      "objective": "Aller au-delà du Ladder avec le SCL : instructions Move, diagnostic, recettes, journalisation.",
      "skills": [
        "Instructions Move en détail",
        "Diagnostic en SCL",
        "Export/import de recettes",
        "Enregistrement de données (data logging)"
      ],
      "why": "Le SCL est le ST côté Siemens : tu capitalises directement sur ce que tu apprends chez Beckhoff.",
      "flag": null,
      "sort_order": 40
    },
    {
      "num": 256,
      "title": "Siemens PLC Programming Using SCL with MODBUS — Part 3",
      "bloc": "b3",
      "hours": 2.1,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-plc-programming-using-scl-with-modbus-part-03/",
      "objective": "Mettre en œuvre une communication Modbus RS-485 sur S7-1200 en SCL.",
      "skills": [
        "Câblage Modbus (carte CB1241)",
        "Configuration matérielle du canal",
        "Bibliothèque Modbus",
        "Lecture de 5 esclaves",
        "Mapping par instruction CASE",
        "Écriture MB_MASTER"
      ],
      "why": "Cas très concret : relever des compteurs d'énergie, exactement le genre de tâche qu'on confie à un HiWi.",
      "flag": null,
      "sort_order": 50
    },
    {
      "num": 257,
      "title": "Autonomous Robots — Model Predictive Control",
      "bloc": "b1",
      "hours": 3.85,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/model-predictive-control/",
      "objective": "Implémenter une commande prédictive sous contraintes sur un véhicule autonome.",
      "skills": [
        "Formulation du problème MPC",
        "Régulation de vitesse",
        "Commande de stationnement",
        "Évitement d'obstacles"
      ],
      "why": "Deuxième angle sur la MPC (robotique) : utile pour comparer les formulations avant de fixer celle du Master Projekt.",
      "flag": null,
      "sort_order": 35
    },
    {
      "num": 258,
      "title": "Applied Control Systems 1 — Autonomous Cars : Math + PID + MPC",
      "bloc": "b1",
      "hours": 17.92,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/applied-systems-control-for-engineers-modelling-pid-mpc/",
      "objective": "Aller du PID à la commande prédictive complète, dérivation mathématique et simulation Python comprises.",
      "skills": [
        "Régulateur PID de bout en bout (4 h 49)",
        "Forces, moments, inertie et repères",
        "Mise en équations d'un véhicule (commande latérale)",
        "Modèle d'état LTI",
        "MPC : intuition sur un cas fusée",
        "MPC : dérivation mathématique complète",
        "MPC : simulation Python sur véhicule autonome"
      ],
      "why": "Cœur du Master Projekt : 4 h de PID puis toute la chaîne modèle d'état → MPC → simulation — exactement le passage PI → MPC demandé à l'IALB. L'habillage automobile ne change rien à la méthode.",
      "flag": null,
      "sort_order": 15
    },
    {
      "num": 259,
      "title": "Practical Introduction to Fuzzy Logic with MATLAB",
      "bloc": "b3",
      "hours": 9.62,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/fuzzy-logic-matlab/",
      "objective": "Concevoir un régulateur flou complet, de la théorie au projet industriel.",
      "skills": [
        "Commande floue vs commande classique",
        "Fondements de la logique floue",
        "Fonctions floues sous MATLAB",
        "Système d'inférence et règles",
        "Projets débutant à intermédiaire",
        "Projet avancé"
      ],
      "why": "Alternative crédible au PID quand le modèle est mal connu — bon sujet de chapitre en Masterarbeit.",
      "flag": "selon sujet",
      "sort_order": 80
    },
    {
      "num": 260,
      "title": "The Ultimate Beginner's Guide to Fuzzy Logic in Python",
      "bloc": "b3",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Reprendre la logique floue côté Python.",
      "skills": [
        "scikit-fuzzy",
        "Fonctions d'appartenance",
        "Moteur d'inférence",
        "Défuzzification"
      ],
      "why": "Doublon du cours MATLAB : n'en fais qu'un des deux.",
      "flag": "si besoin",
      "sort_order": 90
    },
    {
      "num": 96,
      "title": "Siemens TIA Portal — langage SCL (FR)",
      "bloc": "b3",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Programmer en SCL en français, au-delà du Ladder.",
      "skills": [
        "Syntaxe SCL",
        "Blocs et paramètres",
        "Structures de contrôle",
        "Cas industriels"
      ],
      "why": "Complément francophone si le vocabulaire anglais te ralentit.",
      "flag": "à acquérir",
      "sort_order": 100
    },
    {
      "num": 69,
      "title": "MPC700 — Industrial Model Predictive Control",
      "bloc": "b1",
      "hours": 4.5,
      "hours_verified": false,
      "url": null,
      "objective": "Mettre en œuvre une commande prédictive multivariable sous contraintes.",
      "skills": [
        "Modèle de prédiction",
        "Horizon et pondérations",
        "Contraintes entrées/sorties",
        "Multivariable (MIMO)"
      ],
      "why": "MPC industrielle : réglage des horizons, contraintes, temps de calcul — ce qu'il faut pour remplacer le PI sur le banc du Master Projekt.",
      "flag": "à acquérir",
      "sort_order": 25
    },
    {
      "num": 261,
      "title": "The Complete Course of EPLAN Electric P8",
      "bloc": "b8",
      "hours": 10.4,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/eplan-course/",
      "objective": "Concevoir un projet électrique complet sous EPLAN, du folio à la nomenclature.",
      "skills": [
        "Démarrage et mise en page projet",
        "Schéma de principe",
        "Base de données articles",
        "Circuits puissance et commande",
        "Exemple de circuit automate",
        "Câblage variateur / motion",
        "Pro Panel 3D",
        "Rapports et nomenclature"
      ],
      "why": "EPLAN est exigé dans une grande partie des offres allemandes en construction de machines.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 12,
      "title": "EPLAN Electric P8 — Full Course from Beginner to Advanced",
      "bloc": "b8",
      "hours": 17,
      "hours_verified": false,
      "url": null,
      "objective": "Parcours EPLAN long, du débutant à l'avancé.",
      "skills": [
        "Folios et structure projet",
        "Macros",
        "Borniers et câbles",
        "Armoire et implantation"
      ],
      "why": "Le plus complet de ta collection EPLAN : c'est celui-là qu'il faut finir, pas les six autres.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 262,
      "title": "Complete EPLAN Electric P8 Versions for Panel Builder",
      "bloc": "b8",
      "hours": 12,
      "hours_verified": false,
      "url": null,
      "objective": "Utiliser EPLAN du point de vue du constructeur d'armoires.",
      "skills": [
        "Nomenclature de fabrication",
        "Bornes et câblage atelier",
        "Implantation panneau"
      ],
      "why": "Doublon partiel : garde-le pour la partie fabrication d'armoire.",
      "flag": "si besoin",
      "sort_order": 30
    },
    {
      "num": 263,
      "title": "Mastering EPLAN — Electrical Engineering Design",
      "bloc": "b8",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Approfondir la méthodologie de conception sous EPLAN.",
      "skills": [
        "Structuration des projets",
        "Normes de représentation",
        "Réutilisation et macros"
      ],
      "why": "Doublon.",
      "flag": "si besoin",
      "sort_order": 40
    },
    {
      "num": 264,
      "title": "EPLAN Pro Panel — Let's 3D (Beginner)",
      "bloc": "b8",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Implanter une armoire en 3D sous Pro Panel.",
      "skills": [
        "Maquette 3D d'armoire",
        "Placement des composants",
        "Chemins de câbles",
        "Usinage"
      ],
      "why": "Compétence rare et visible : une armoire en 3D dans un portfolio marque les esprits.",
      "flag": null,
      "sort_order": 50
    },
    {
      "num": 265,
      "title": "EPLAN Electric P8 + Pro Panel — Complete PLC Course",
      "bloc": "b8",
      "hours": 2.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/eplan-electric-p8-propanel-complete-plc-course/",
      "objective": "Standardiser la représentation des automates dans un projet EPLAN.",
      "skills": [
        "Macros de schéma",
        "Vue d'ensemble et multifilaire",
        "Représentation 3D",
        "Intégration de l'automate au projet"
      ],
      "why": "Très court et très ciblé : la jonction entre ton monde automate et le monde schéma.",
      "flag": null,
      "sort_order": 60
    },
    {
      "num": 266,
      "title": "EPLAN Electric P8 — Custom Symbols, Tips & Tricks",
      "bloc": "b8",
      "hours": 3,
      "hours_verified": false,
      "url": null,
      "objective": "Créer ses propres symboles et gagner du temps sous EPLAN.",
      "skills": [
        "Éditeur de symboles",
        "Bibliothèques personnalisées",
        "Raccourcis et automatisations"
      ],
      "why": "À consulter ponctuellement, pas à suivre linéairement.",
      "flag": "optionnel",
      "sort_order": 70
    },
    {
      "num": 267,
      "title": "EPLAN Electric P8 Heavyweight Vol.12 — The Crash Course",
      "bloc": "b8",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Format intensif sur les fonctions clés d'EPLAN.",
      "skills": [
        "Fonctions avancées",
        "Productivité",
        "Cas pratiques"
      ],
      "why": "Réserve.",
      "flag": "optionnel",
      "sort_order": 80
    },
    {
      "num": 268,
      "title": "EPLAN Electric P8 Heavyweight Vol.22 — 2D Panel Parts",
      "bloc": "b8",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Travailler l'implantation 2D des composants d'armoire.",
      "skills": [
        "Implantation 2D",
        "Gestion des articles",
        "Cotation"
      ],
      "why": "Réserve.",
      "flag": "optionnel",
      "sort_order": 90
    },
    {
      "num": 269,
      "title": "EPLAN Tutorials",
      "bloc": "b8",
      "hours": 3,
      "hours_verified": false,
      "url": null,
      "objective": "Série de tutoriels courts EPLAN.",
      "skills": [
        "Astuces ponctuelles",
        "Fonctions isolées"
      ],
      "why": "Consultation à la demande.",
      "flag": "optionnel",
      "sort_order": 100
    },
    {
      "num": 270,
      "title": "The AutoCAD Electrical 2021-2022 Complete Course",
      "bloc": "b8",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "Concevoir des schémas électriques sous AutoCAD Electrical.",
      "skills": [
        "Environnement AutoCAD Electrical",
        "Symboles et repérage",
        "Nomenclatures",
        "Édition de folios"
      ],
      "why": "Alternative à EPLAN, plus courante hors Allemagne — secondaire pour toi.",
      "flag": "si besoin",
      "sort_order": 110
    },
    {
      "num": 271,
      "title": "Electrical Schematics (Industrial Controls)",
      "bloc": "b8",
      "hours": 2.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/electrical-schematics-industrial-controls/",
      "objective": "Lire et concevoir des circuits puissance et commande à partir des symboles normalisés.",
      "skills": [
        "Symboles et légendes",
        "Appareillage de coupure et protection",
        "Conception de schémas",
        "Bases du verrouillage",
        "Circuits de mesure"
      ],
      "why": "Fondation à traiter avant EPLAN : dessiner vite ne sert à rien si le schéma est faux.",
      "flag": null,
      "sort_order": 120
    },
    {
      "num": 272,
      "title": "Fourier and Laplace Transforms",
      "bloc": "b6",
      "hours": 9.88,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/fourier-and-laplace-transforms/",
      "objective": "Reconstruire une intuition solide des transformées, avec une approche graphique 3D.",
      "skills": [
        "Séries de Fourier",
        "Série de Fourier complexe",
        "Transformée de Fourier",
        "Transformée de Laplace",
        "Passage vers les transformées discrètes"
      ],
      "why": "Socle mathématique de toute la Regelungstechnik : à revoir avant la Masterarbeit, pas pendant.",
      "flag": null,
      "sort_order": 10
    },
    {
      "num": 90,
      "title": "Python for Engineers and Scientists — Basic to Advanced",
      "bloc": "b6",
      "hours": 14.9,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/python-for-engineers-and-scientists-basic-to-advanced/",
      "objective": "Passer de la syntaxe Python au calcul scientifique complet.",
      "skills": [
        "Fondamentaux et structures de données",
        "Fonctions et POO",
        "Fichiers et gestion d'erreurs",
        "NumPy",
        "Pandas",
        "Matplotlib, SciPy, SymPy"
      ],
      "why": "Un institut te demandera des résultats reproductibles : Python est gratuit, MATLAB non.",
      "flag": null,
      "sort_order": 20
    },
    {
      "num": 273,
      "title": "MATLAB for Engineers — Go from Zero to Hero",
      "bloc": "b6",
      "hours": 8,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/matlab-for-engineers-go-from-zero-to-hero/",
      "objective": "Construire un socle MATLAB propre avec plus de 100 exercices.",
      "skills": [
        "Fonctions intégrées",
        "Manipulation de matrices",
        "Tracés",
        "Fonctions utilisateur",
        "Structures de répétition",
        "Algèbre matricielle"
      ],
      "why": "À faire avant la Simulink Bible si ton MATLAB est rouillé.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 274,
      "title": "Mastering MATLAB for Beginners to Advanced",
      "bloc": "b6",
      "hours": 12,
      "hours_verified": false,
      "url": null,
      "objective": "Parcours MATLAB long et complet.",
      "skills": [
        "Programmation MATLAB",
        "Toolboxes",
        "Visualisation",
        "Optimisation de code"
      ],
      "why": "Doublon du précédent : n'en fais qu'un.",
      "flag": "si besoin",
      "sort_order": 40
    },
    {
      "num": 275,
      "title": "Master MATLAB Through Guided Problem Solving",
      "bloc": "b6",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Progresser par résolution de problèmes guidés.",
      "skills": [
        "Problèmes d'ingénierie résolus",
        "Méthode de décomposition",
        "Debug"
      ],
      "why": "Bon complément d'entraînement.",
      "flag": "optionnel",
      "sort_order": 50
    },
    {
      "num": 276,
      "title": "Ultimate MATLAB/Simulink for Electrical Engineering",
      "bloc": "b6",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "Appliquer MATLAB/Simulink aux problèmes de génie électrique.",
      "skills": [
        "Circuits et machines sous Simulink",
        "Simscape Electrical",
        "Analyse de résultats"
      ],
      "why": "Utile en transversal entre Energietechnik et Regelungstechnik.",
      "flag": "selon sujet",
      "sort_order": 60
    },
    {
      "num": 277,
      "title": "MATLAB/Simulink Capstone Course for Electrical Engineering",
      "bloc": "b6",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Format capsule pour réviser vite.",
      "skills": [
        "Rappels MATLAB",
        "Blocs Simulink essentiels"
      ],
      "why": "Révision express.",
      "flag": "si besoin",
      "sort_order": 70
    },
    {
      "num": 278,
      "title": "MATLAB App Design for Electrical and Electronics Concepts",
      "bloc": "b6",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Créer des interfaces MATLAB (App Designer) pour présenter ses résultats.",
      "skills": [
        "App Designer",
        "Composants d'interface",
        "Callbacks",
        "Packaging d'application"
      ],
      "why": "Excellent pour la soutenance : une interface vaut mieux qu'un script en console.",
      "flag": "optionnel",
      "sort_order": 80
    },
    {
      "num": 279,
      "title": "Academic Writing Essentials — University Writing Crash Course",
      "bloc": "b10",
      "hours": 3,
      "hours_verified": false,
      "url": null,
      "objective": "Structurer et rédiger un travail universitaire dans les règles.",
      "skills": [
        "Structure d'un mémoire",
        "Argumentation",
        "Citation et références",
        "Relecture"
      ],
      "why": "Ta Masterarbeit sera notée autant sur la forme que sur le fond — et tu la rédigeras en langue étrangère.",
      "flag": null,
      "sort_order": 30
    },
    {
      "num": 280,
      "title": "La Formation Complète Python (FR)",
      "bloc": "b6",
      "hours": 20,
      "hours_verified": false,
      "url": null,
      "objective": "Parcours Python généraliste en français.",
      "skills": [
        "Syntaxe et structures",
        "POO",
        "Modules",
        "Projets"
      ],
      "why": "Doublon avec le Python scientifique : choisis celui orienté ingénieur.",
      "flag": "si besoin",
      "sort_order": 100
    },
    {
      "num": 281,
      "title": "300 projets pratiques en Python",
      "bloc": "b6",
      "hours": 20,
      "hours_verified": false,
      "url": null,
      "objective": "Pratiquer Python par petits projets répétés.",
      "skills": [
        "Exercices variés",
        "Automatisation",
        "Scripts utilitaires"
      ],
      "why": "Bon pour l'endurance, faible en rendement direct sur ton métier.",
      "flag": "si besoin",
      "sort_order": 110
    },
    {
      "num": 282,
      "title": "Learn 50 Hot Python Topics in 50 Days",
      "bloc": "b6",
      "hours": 12,
      "hours_verified": false,
      "url": null,
      "objective": "Balayer 50 sujets Python en format quotidien.",
      "skills": [
        "Sujets courts et variés",
        "Rythme quotidien"
      ],
      "why": "Format habitude : utile si tu veux une routine quotidienne courte.",
      "flag": "optionnel",
      "sort_order": 120
    },
    {
      "num": 283,
      "title": "Python for Data Science — NumPy & Pandas on Real Data",
      "bloc": "b6",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Traiter des jeux de données réels avec NumPy et Pandas.",
      "skills": [
        "NumPy vectorisé",
        "Pandas : nettoyage et agrégation",
        "Visualisation"
      ],
      "why": "Directement utile pour dépouiller des mesures de banc d'essai.",
      "flag": null,
      "sort_order": 130
    },
    {
      "num": 284,
      "title": "Python for Scientific Research",
      "bloc": "b6",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Utiliser Python dans un cadre de recherche reproductible.",
      "skills": [
        "Environnements et dépendances",
        "Notebooks",
        "Analyse statistique",
        "Figures publiables"
      ],
      "why": "Méthode de travail utile pour la Masterarbeit.",
      "flag": "optionnel",
      "sort_order": 140
    },
    {
      "num": 285,
      "title": "Complete and Ultimate C Programming Course",
      "bloc": "b6",
      "hours": 12,
      "hours_verified": false,
      "url": null,
      "objective": "Maîtriser le C, langage des cibles embarquées.",
      "skills": [
        "Types et pointeurs",
        "Mémoire",
        "Structures",
        "Compilation"
      ],
      "why": "Le C sert dès qu'on descend sous l'automate (ESP32, STM32, drivers).",
      "flag": "optionnel",
      "sort_order": 150
    },
    {
      "num": 286,
      "title": "Bundle — Apprenez à programmer en C (FR)",
      "bloc": "b6",
      "hours": 15,
      "hours_verified": false,
      "url": null,
      "objective": "Apprendre le C en français, de zéro.",
      "skills": [
        "Bases du langage",
        "Pointeurs",
        "Allocation dynamique",
        "Projets"
      ],
      "why": "Doublon francophone du cours ci-dessus.",
      "flag": "si besoin",
      "sort_order": 160
    },
    {
      "num": 287,
      "title": "Langage C pour les débutants (FR)",
      "bloc": "b6",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Découvrir le C pas à pas en français.",
      "skills": [
        "Syntaxe",
        "Boucles et conditions",
        "Fonctions"
      ],
      "why": "Doublon.",
      "flag": "si besoin",
      "sort_order": 170
    },
    {
      "num": 288,
      "title": "Plus de 100 exercices sur la programmation en C (FR)",
      "bloc": "b6",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "S'entraîner intensivement en C.",
      "skills": [
        "Exercices progressifs",
        "Algorithmique",
        "Debug"
      ],
      "why": "Uniquement si tu pars vers l'embarqué.",
      "flag": "si besoin",
      "sort_order": 180
    },
    {
      "num": 67,
      "title": "MATLAB/Simulink for Power System Simulations",
      "bloc": "b7",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Simuler réseaux, courts-circuits et stabilité.",
      "skills": [
        "Modèles de réseau",
        "Court-circuit",
        "Écoulement de puissance",
        "Stabilité"
      ],
      "why": "Pertinent seulement si ta Masterarbeit part côté réseau.",
      "flag": "selon sujet",
      "sort_order": 10
    },
    {
      "num": 289,
      "title": "Ultimate Electrical Power System Engineering Masterclass",
      "bloc": "b7",
      "hours": 20,
      "hours_verified": false,
      "url": null,
      "objective": "Couvrir largement l'ingénierie des réseaux électriques.",
      "skills": [
        "Production, transport, distribution",
        "Protections",
        "Stabilité",
        "Qualité de l'énergie"
      ],
      "why": "Gros volume hors trajectoire automatisation : à réserver.",
      "flag": "si besoin",
      "sort_order": 20
    },
    {
      "num": 290,
      "title": "Ultimate Industrial Power System Engineering Masterclass",
      "bloc": "b7",
      "hours": 15,
      "hours_verified": false,
      "url": null,
      "objective": "Traiter les réseaux électriques du point de vue industriel.",
      "skills": [
        "Distribution industrielle",
        "Sélectivité des protections",
        "Groupes de secours"
      ],
      "why": "Utile pour dimensionner l'amont d'une armoire.",
      "flag": "si besoin",
      "sort_order": 30
    },
    {
      "num": 291,
      "title": "Ultimate Electrical Power System Engineering Materials",
      "bloc": "b7",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "Support de référence sur les réseaux électriques.",
      "skills": [
        "Documents et méthodes de calcul"
      ],
      "why": "Consultation.",
      "flag": "optionnel",
      "sort_order": 40
    },
    {
      "num": 292,
      "title": "Deep Learning A-Z — Hands-On Artificial Neural Networks",
      "bloc": "b9",
      "hours": 23,
      "hours_verified": false,
      "url": null,
      "objective": "Parcours complet en apprentissage profond.",
      "skills": [
        "Réseaux de neurones",
        "CNN",
        "RNN",
        "Frameworks"
      ],
      "why": "Intéressant, mais ne sert pas ton objectif Automatisierungsingenieur dans les 18 prochains mois.",
      "flag": "plus tard",
      "sort_order": 10
    },
    {
      "num": 293,
      "title": "The Complete Neural Networks Bootcamp — Theory & Applications",
      "bloc": "b9",
      "hours": 20,
      "hours_verified": false,
      "url": null,
      "objective": "Théorie et pratique des réseaux de neurones.",
      "skills": [
        "Rétropropagation",
        "Architectures",
        "PyTorch"
      ],
      "why": "Même remarque.",
      "flag": "plus tard",
      "sort_order": 20
    },
    {
      "num": 294,
      "title": "Deep Learning Recurrent Neural Networks with Python",
      "bloc": "b9",
      "hours": 12,
      "hours_verified": false,
      "url": null,
      "objective": "Modèles séquentiels et séries temporelles.",
      "skills": [
        "RNN, LSTM, GRU",
        "Séries temporelles"
      ],
      "why": "Deviendrait pertinent si ton sujet touche la maintenance prédictive.",
      "flag": "selon sujet",
      "sort_order": 30
    },
    {
      "num": 295,
      "title": "Fundamentals of Artificial Neural Networks with MATLAB",
      "bloc": "b9",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Réseaux de neurones sous MATLAB.",
      "skills": [
        "Deep Learning Toolbox",
        "Apprentissage supervisé"
      ],
      "why": "Pont possible entre IA et régulation, mais secondaire.",
      "flag": "selon sujet",
      "sort_order": 40
    },
    {
      "num": 296,
      "title": "PyTorch for Deep Learning with Python Bootcamp",
      "bloc": "b9",
      "hours": 17,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/pytorch-for-deep-learning-with-python-bootcamp/",
      "objective": "Introduction courte à l'apprentissage profond en Python.",
      "skills": [
        "NumPy / Pandas",
        "ANN, CNN, RNN/LSTM",
        "PyTorch",
        "GPU / CUDA"
      ],
      "why": "Plus tard.",
      "flag": "plus tard",
      "sort_order": 50
    },
    {
      "num": 297,
      "title": "Formation à l'IA et à l'IoT avec Jetson Nano (NVIDIA)",
      "bloc": "b9",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Mettre en œuvre de l'IA embarquée sur Jetson Nano.",
      "skills": [
        "Jetson Nano",
        "Vision par ordinateur",
        "Inférence embarquée"
      ],
      "why": "Beau projet personnel, hors trajectoire pour l'instant.",
      "flag": "plus tard",
      "sort_order": 60
    },
    {
      "num": 298,
      "title": "Formation complète sur Arduino — premiers pas vers l'IoT (FR)",
      "bloc": "b9",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Découvrir l'électronique programmable avec Arduino.",
      "skills": [
        "Arduino IDE",
        "Capteurs et actionneurs",
        "Communication série"
      ],
      "why": "Utile pour du HIL bricolé, mais le cours HIL du bloc Regelungstechnik y suffit.",
      "flag": "si besoin",
      "sort_order": 70
    },
    {
      "num": 299,
      "title": "Applied Control Systems 2 — Autonomous Cars (360° Tracking)",
      "bloc": "b9",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Commande appliquée au suivi de trajectoire automobile.",
      "skills": [
        "Modèle véhicule",
        "Suivi de trajectoire",
        "MPC appliquée"
      ],
      "why": "Excellente théorie de commande, mais application automobile : à garder si ton sujet s'y prête.",
      "flag": "selon sujet",
      "sort_order": 80
    },
    {
      "num": 300,
      "title": "Applied Control Systems 3 — UAV/Drone 3D Dynamics Control",
      "bloc": "b9",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "Commande 3D d'un drone.",
      "skills": [
        "Dynamique 3D",
        "Boucles imbriquées",
        "Simulation"
      ],
      "why": "Même remarque.",
      "flag": "selon sujet",
      "sort_order": 90
    },
    {
      "num": 301,
      "title": "Applied Control Systems 4 — UAV: Quaternions + MPC + PID",
      "bloc": "b9",
      "hours": 11.5,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/applied-control-systems-4-uav-quaternions-mpc-pid-y/",
      "objective": "Quaternions et commande avancée de drone.",
      "skills": [
        "Quaternions",
        "MPC",
        "PID en cascade"
      ],
      "why": "Même remarque.",
      "flag": "selon sujet",
      "sort_order": 100
    },
    {
      "num": 302,
      "title": "Applied Control Systems for Engineers 2 — UAV/Drone Control",
      "bloc": "b9",
      "hours": 8,
      "hours_verified": false,
      "url": null,
      "objective": "Commande de drone pour ingénieurs.",
      "skills": [
        "Modélisation drone",
        "Régulateurs",
        "Simulation"
      ],
      "why": "Doublon de la série ci-dessus.",
      "flag": "si besoin",
      "sort_order": 110
    },
    {
      "num": 303,
      "title": "Solar PV Installation Masterclass 1",
      "bloc": "b9",
      "hours": 6,
      "hours_verified": false,
      "url": null,
      "objective": "Dimensionner et installer une installation photovoltaïque.",
      "skills": [
        "Dimensionnement PV",
        "Onduleurs",
        "Normes d'installation"
      ],
      "why": "Hors trajectoire — sauf si tu veux le valoriser côté LE PASSEUR ou Congo.",
      "flag": "plus tard",
      "sort_order": 120
    },
    {
      "num": 304,
      "title": "Ultimate Wind Energy Course for Electrical Engineering",
      "bloc": "b9",
      "hours": 10,
      "hours_verified": false,
      "url": null,
      "objective": "Comprendre la chaîne de conversion éolienne.",
      "skills": [
        "Aérodynamique",
        "Génératrices",
        "Raccordement réseau"
      ],
      "why": "Hors trajectoire pour l'instant.",
      "flag": "plus tard",
      "sort_order": 130
    },
    {
      "num": 305,
      "title": "PLC Programming for Refrigeration, AC and Heat Pump",
      "bloc": "b9",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Automatiser des installations frigorifiques et pompes à chaleur.",
      "skills": [
        "Cycles frigorifiques",
        "Régulation de température",
        "Séquences de dégivrage"
      ],
      "why": "Niche : utile seulement si tu vises le secteur CVC.",
      "flag": "si besoin",
      "sort_order": 140
    },
    {
      "num": 306,
      "title": "PLC At Home — For Electrical and Control Engineers",
      "bloc": "b9",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Domotique pilotée par automate.",
      "skills": [
        "Automate en résidentiel",
        "Scénarios",
        "Interfaces"
      ],
      "why": "Projet plaisir, pas carrière.",
      "flag": "plus tard",
      "sort_order": 150
    },
    {
      "num": 307,
      "title": "Master German with 800 Real-Life Conversations",
      "bloc": "b10",
      "hours": 308.2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/master-german-with-800-real-life-conversations/",
      "objective": "Renforcer l'allemand du quotidien par la conversation.",
      "skills": [
        "900 dialogues",
        "Vocabulaire courant",
        "Compréhension orale"
      ],
      "why": "Ton allemand compte pour ta carrière, mais c'est un autre chantier que la Feuille de route technique.",
      "flag": "plus tard",
      "sort_order": 10
    },
    {
      "num": 308,
      "title": "Language Learning with ChatGPT — Master Any Language Fast",
      "bloc": "b10",
      "hours": 3,
      "hours_verified": false,
      "url": null,
      "objective": "Utiliser un assistant IA pour apprendre une langue.",
      "skills": [
        "Méthodes de pratique",
        "Correction automatique"
      ],
      "why": "Méthode, pas contenu technique.",
      "flag": "plus tard",
      "sort_order": 20
    },
    {
      "num": 400,
      "title": "Schröder & Böcker — Elektrische Antriebe: Regelung von Antriebssystemen",
      "bloc": "b1",
      "hours": 0,
      "hours_verified": false,
      "url": null,
      "objective": "Référence allemande sur la régulation des entraînements (machines à courant continu, asynchrones, synchrones). Durée de lecture à estimer selon les chapitres utiles au sujet de la Masterarbeit.",
      "skills": [
        "Regelung von Antriebssystemen",
        "Maschinenmodellierung",
        "Stromregelkreis"
      ],
      "why": "Ouvrage de référence de l'encadrant pour la Masterarbeit IALB : c'est la base théorique de la conception du régulateur.",
      "flag": "à acquérir",
      "sort_order": 45
    },
    {
      "num": 406,
      "title": "Siemens PLC Programming Using SCL — Part 1 (TIA Portal)",
      "bloc": "b3",
      "hours": 8.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/siemens-plc-programming-using-scl-part-1-tia-portal/",
      "objective": "Écrire des programmes S7-1500 en SCL : logique, temporisations, boucles, calcul, conversions.",
      "skills": [
        "SCL (ST Siemens)",
        "FOR / WHILE / CASE",
        "Timers et compteurs IEC",
        "Conversions de types",
        "Factory IO"
      ],
      "why": "C'est la partie 1 de la série SCL que tu as déjà (parties 2 et 3) : à faire avant elles.",
      "flag": null,
      "sort_order": 35
    },
    {
      "num": 401,
      "title": "100+ NumPy Coding Exercises for Python Programming",
      "bloc": "b6",
      "hours": 1.7,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/python-numpy-programming-with-coding-exercises/",
      "objective": "Automatiser les manipulations de tableaux NumPy par des exercices courts.",
      "skills": [
        "Tableaux et indexation",
        "Fonctions statistiques",
        "Algèbre linéaire",
        "Nombres aléatoires"
      ],
      "why": "NumPy est la base de tes simulations MPC en Python : 1 h 40 d'exercices pour être fluide.",
      "flag": "optionnel",
      "sort_order": 135
    },
    {
      "num": 402,
      "title": "ABB PLC Programming from Scratch to Expert (PLC-SCADA-4)",
      "bloc": "b2",
      "hours": 12.1,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/learn-abb-plc-programming-from-scratch-to-expert-level/",
      "objective": "Programmer un automate ABB AC500 (PM554) sous CODESYS en ladder.",
      "skills": [
        "ABB AC500 / PM554",
        "CODESYS",
        "Ladder",
        "Temporisations, compteurs, comparaisons",
        "Projet feux tricolores"
      ],
      "why": "Une troisième marque d'automate ; recoupe ton socle CODESYS, utile seulement si un poste l'exige.",
      "flag": "si besoin",
      "sort_order": 245
    },
    {
      "num": 403,
      "title": "Allen Bradley PLC Training — PIDE Programming & PIDE Tuning",
      "bloc": "b1",
      "hours": 2,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/allen-bradley-plc-training-pide-programming-pide-tuning/",
      "objective": "Programmer et régler des boucles PID dans un automate (bloc PIDE, Logix).",
      "skills": [
        "Bloc PIDE",
        "Réglage manuel et automatique",
        "Temps mort, avance-retard",
        "Courbes de tendance"
      ],
      "why": "Le réglage d'un PID réel en automate : utile pour comprendre le PI de référence de ton Projekt avant la MPC.",
      "flag": "optionnel",
      "sort_order": 115
    },
    {
      "num": 404,
      "title": "A Deep Understanding of Deep Learning (with Python Intro)",
      "bloc": "b9",
      "hours": 57.3,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/deeplearning_x/",
      "objective": "Comprendre en profondeur les mathématiques et l'entraînement des réseaux de neurones (PyTorch).",
      "skills": [
        "Rétropropagation",
        "ANN, CNN, autoencodeurs",
        "Régularisation et optimiseurs",
        "PyTorch"
      ],
      "why": "Très complet (57 h) mais hors de ton objectif d'automaticien pour l'instant.",
      "flag": "plus tard",
      "sort_order": 55
    },
    {
      "num": 405,
      "title": "Allen Bradley MicroLogix PLC Programming Basics",
      "bloc": "b2",
      "hours": 1.65,
      "hours_verified": true,
      "url": "https://www.udemy.com/course/learn-basics-of-allen-bradley-micro-logix-plc-in-15-hours/",
      "objective": "Bases du ladder sur MicroLogix avec RSLogix Micro (simulateur).",
      "skills": [
        "Logique à relais",
        "Ladder RSLogix Micro",
        "Temporisations et compteurs"
      ],
      "why": "Recoupe « Learn Allen Bradley MicroLogix from Scratch » (#225) : l'un des deux suffit.",
      "flag": "si besoin",
      "sort_order": 241
    },
    {
      "num": 407,
      "title": "PLC Programming for Professionals (Allen Bradley)",
      "bloc": "b2",
      "hours": 12,
      "hours_verified": false,
      "url": null,
      "objective": "Programmation Allen Bradley de niveau avancé : séquenceurs, registres à décalage, SCADA.",
      "skills": [
        "MicroLogix 1100 / RSLogix",
        "Séquenceurs",
        "Registres à décalage",
        "SCADA"
      ],
      "why": "Durée non confirmée (cours introuvable sur Udemy). Utile seulement si un poste demande Allen Bradley.",
      "flag": "si besoin",
      "sort_order": 242
    },
    {
      "num": 408,
      "title": "TIA Portal Exercises — LOGO! Soft (dossier)",
      "bloc": "b2",
      "hours": 5,
      "hours_verified": false,
      "url": null,
      "objective": "Exercices Siemens TIA Portal / LOGO! Soft Comfort — contenu exact à vérifier dans ton dossier.",
      "skills": [
        "LOGO! Soft Comfort",
        "Exercices de logique"
      ],
      "why": "Titre de dossier sans cours Udemy identifié : ouvre-le et corrige le titre et la durée dans la fiche.",
      "flag": "si besoin",
      "sort_order": 345
    },
    {
      "num": 409,
      "title": "AVEVA Wonderware System Platform 2020 — Basics 1",
      "bloc": "b4",
      "hours": 4.3,
      "hours_verified": false,
      "url": null,
      "objective": "Bases d'AVEVA System Platform : ArchestrA IDE, Galaxy, objets.",
      "skills": [
        "ArchestrA IDE",
        "Galaxy et objets",
        "Supervision industrielle"
      ],
      "why": "Autre écosystème SCADA que WinCC ; à faire seulement si une offre d'emploi cite AVEVA/Wonderware.",
      "flag": "optionnel",
      "sort_order": 45
    },
    {
      "num": 410,
      "title": "S7-1200 + Arduino Programming (dossier)",
      "bloc": "b2",
      "hours": 4,
      "hours_verified": false,
      "url": null,
      "objective": "Couplage S7-1200 et Arduino — contenu exact à vérifier dans ton dossier.",
      "skills": [
        "S7-1200",
        "Arduino",
        "Communication automate ↔ microcontrôleur"
      ],
      "why": "Aucun cours Udemy de ce nom trouvé : ouvre le dossier et corrige le titre et la durée dans la fiche.",
      "flag": "optionnel",
      "sort_order": 346
    },
    {
      "num": 411,
      "title": "Fuzzy Control of Industrial Systems — Theory and Applications (livre, I. S. Shaw)",
      "bloc": "b3",
      "hours": 0,
      "hours_verified": false,
      "url": "https://link.springer.com/book/10.1007/978-1-4757-2813-2",
      "objective": "Livre (Springer, 1998) : théorie de la commande floue et applications industrielles.",
      "skills": [
        "Logique floue",
        "Régulateurs flous",
        "Applications industrielles"
      ],
      "why": "Référence écrite pour les deux cours de logique floue ; c'est un livre, donc 0 h de vidéo.",
      "flag": "selon sujet",
      "sort_order": 95
    },
    {
      "num": 412,
      "title": "Solid Edge (dossier)",
      "bloc": "b9",
      "hours": 2,
      "hours_verified": false,
      "url": null,
      "objective": "CAO mécanique Siemens Solid Edge — contenu exact à vérifier dans ton dossier.",
      "skills": [
        "Esquisse",
        "Modélisation de pièces"
      ],
      "why": "CAO mécanique, hors du parcours automatisme. Durée estimée : corrige-la dans la fiche.",
      "flag": "plus tard",
      "sort_order": 175
    }
  ]
};
