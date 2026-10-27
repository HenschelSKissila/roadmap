/* ═══════════════════════════════════════════════════════════════════════════
   Données initiales v2 — engagements, jalons, liens cours, modules du Master
   Les liens cours utilisent les numéros de la v1 (liste des 109 cours).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';

window.SEED2 = {

  /* ── engagements ──────────────────────────────────────────────────────── */
  projects: [
    { code: 'hiwi', title: 'Studentische Hilfskraft — Echtzeitmodell', institute: 'IALB',
      topic: 'Systemsimulationen und Entwurf eines echtzeitfähigen Modells',
      cp: null, start_date: '2026-10-01', end_date: '2026-10-31',
      status: 'prevu', contract_hours: 36, hourly_rate: 15.20, sort_order: 10,
      notes: 'TwinCAT 3 (ST, FUP, AS), C/C++, MATLAB/Simulink.' },
    { code: 'projekt', title: "Master Projekt — Modellprädiktive Regelung eines zweiphasigen Motors", institute: 'IALB',
      topic: "Ein bereits funktionierender PI-Regler soll durch einen MPC-Regler ersetzt werden, um eine bessere Regelung der Maschinengrößen zu erzielen.",
      cp: 18, start_date: null, end_date: null,
      status: 'prevu', contract_hours: null, hourly_rate: null, sort_order: 20,
      notes: "Point de départ : le PI actuel fonctionne — mesurer ses performances AVANT de le remplacer, c'est la référence de comparaison. À confirmer avec l'encadrant : type exact du moteur biphasé, grandeurs régulées (courants, couple, vitesse, position), plateforme temps réel." },
    { code: 'masterarbeit',
      title: 'Masterarbeit — Reglerentwicklung für eine Maschine (Industrieprojekt)',
      institute: 'IALB',
      topic: 'Entwicklung eines Reglers für eine Maschine im Rahmen eines Industrieprojekts. '
           + 'Vorarbeiten aus einer bereits abgeschlossenen Masterarbeit vorhanden.',
      supervisor: 'Prof. Dr.-Ing. Amir Ebrahimi',
      cp: 30, start_date: null, end_date: null,
      status: 'prevu', contract_hours: null, hourly_rate: null, sort_order: 30,
      notes: 'Industriepartner et type de machine : à préciser. 24 semaines après inscription, '
           + 'prolongation unique de 8 semaines au plus. Note : 75 % mémoire, 25 % Kolloquium. '
           + 'Inscription seulement après Projekt validé + 24 CP Wahl + 78 CP (§6(2)). '
           + 'Contact : ebrahimi@ialb.uni-bremen.de · 0421 218-62680.' }
  ],

  /* ── jalons par défaut ────────────────────────────────────────────────── */
  /* `week` = semaines après la date d'inscription (Masterarbeit uniquement) */
  milestones: {
    hiwi: [
      { title: 'Prise de poste — accès TwinCAT et matériel', due_date: '2026-10-01' },
      { title: 'Modèle temps réel — première version simulée', due_date: '2026-10-15' },
      { title: "Revue avec l'encadrant", due_date: '2026-10-26' },
      { title: 'Fin de contrat', due_date: '2026-10-31' },
      { title: 'Remise du Stundennachweis', due_date: '2026-11-14' }
    ],
    projekt: [
      { title: "Sujet validé avec l'encadrant (IALB)", due_date: null },
      { title: "Inscription du Projekt au Prüfungsamt", due_date: null },
      { title: "Prise en main du banc : moteur biphasé, onduleur, capteurs", due_date: null },
      { title: "Analyse du régulateur PI existant — performances de référence", due_date: null },
      { title: "Modèle d'état du moteur biphasé et identification des paramètres", due_date: null },
      { title: "Validation du modèle : simulation contre mesures", due_date: null },
      { title: "Conception du MPC : horizon, fonction de coût, contraintes courant / tension", due_date: null },
      { title: "Simulation comparative PI / MPC (Simulink)", due_date: null },
      { title: "Implémentation temps réel et contrôle du temps de calcul", due_date: null },
      { title: "Essais sur le banc et comparaison PI / MPC", due_date: null },
      { title: "Rédaction du rapport", due_date: null },
      { title: "Rapport rendu", due_date: null },
      { title: "Présentation", due_date: null }
    ],
    /* Les six premiers jalons précèdent l'inscription : pas d'offset `week`,
       le bouton « Appliquer le calendrier » les laisse tels quels. */
    masterarbeit: [
      { title: 'Répondre à Prof. Ebrahimi', due_date: '2026-09-24' },
      { title: 'Entretien : machine, partenaire industriel, outils, calendrier', due_date: null },
      { title: 'Obtenir et lire la Masterarbeit précédente (Vorarbeiten)', due_date: null },
      { title: 'Clarifier confidentialité (NDA / Sperrvermerk) avec le partenaire', due_date: null },
      { title: 'Conditions §6(2) remplies (Projekt + 24 CP Wahl + 78 CP)', due_date: null },
      { title: 'Inscription officielle au Prüfungsamt', due_date: null },
      { title: 'Recherche bibliographique et plan de travail validé', due_date: null, week: 4 },
      { title: 'Modélisation et identification de la machine', due_date: null, week: 8 },
      { title: 'Conception du régulateur', due_date: null, week: 12 },
      { title: 'Simulation et validation (Simulink / HIL)', due_date: null, week: 16 },
      { title: 'Implémentation et essais sur la machine', due_date: null, week: 19 },
      { title: 'Évaluation des résultats', due_date: null, week: 21 },
      { title: 'Rédaction', due_date: null, week: 23 },
      { title: 'Dépôt du mémoire', due_date: null, week: 24 },
      { title: 'Kolloquium', due_date: null, week: 26 }
    ]
  },

  /* ── liens cours ↔ engagement, par numéro de cours ────────────────────── */
  links: {
    hiwi:         { indispensable: [10, 43, 8, 82], utile: [65, 14, 1] },
    projekt:      { indispensable: [258, 69, 65, 14, 400], utile: [257, 83, 68, 66, 43] },
    masterarbeit: { indispensable: [65, 83, 14, 400], utile: [69, 68, 66, 43] }
  },

  /* ── correctifs appliqués automatiquement au démarrage ──────────────────
     La condition porte sur les DONNÉES du compte, pas sur un drapeau local :
     le premier appareil qui démarre applique le correctif, les suivants
     voient en base que c'est fait et n'y touchent plus. */
  patches: [
    /* Catalogue comparé au dossier de formations (sept. 2026) : on retire les
       entrées qui ne sont pas des cours et on range langues + rédaction dans
       un bloc à part, replié par défaut. Condition stable : le bloc b10
       n'existe qu'après ce correctif (ou sur une installation neuve). */
    { id: 'catalogue-2026-09',
      toast: 'patch.catalog',
      when: st => !st.blocs.some(b => b.id === 'b10'),
      apply: ({ state: st, write }) => {
        const seed = window.SEED.blocs.find(b => b.id === 'b10');
        write('blocs', { id: seed.id, name: seed.name, subtitle: seed.subtitle,
          color: seed.color, priority: Math.max(10, ...st.blocs.map(b => +b.priority || 0)) + 1 }, { silent: true });
        const MOVE = { 307: 10, 308: 20, 279: 30 };
        st.courses.filter(c => !c.deleted && MOVE[c.num] != null)
          .forEach(c => write('courses', { id: c.id, bloc_id: 'b10', sort_order: MOVE[c.num] }, { silent: true }));
        st.courses.filter(c => !c.deleted && c.flag === 'non-cours')
          .forEach(c => write('courses', { id: c.id, deleted: true }, { silent: true }));
      } },
    /* Tout est validé sauf S3 et S4 (Projekt et Masterarbeit compris).
       Chaque condition est « stable » : une fois appliquée, elle ne redevient
       jamais vraie d'elle-même, donc le correctif ne repasse pas. */
    /* Cours du dossier absents du catalogue (liste de 158 formations, sept. 2026) :
       12 ajouts (définis dans data.js, n° 401 à 412) et 6 titres/durées corrigés.
       Un titre renommé par l'utilisateur n'est jamais écrasé. Condition stable :
       le n° 406 existe dès que le correctif est passé (même s'il est supprimé ensuite). */
    { id: 'catalogue-ajouts-2026-09',
      toast: 'patch.catalogAdd',
      when: st => !st.courses.some(c => +c.num === 406),
      apply: ({ state: st, write, uuid, user }) => {
        const seed = n => window.SEED.courses.find(c => c.num === n);
        const norm = x => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
        const OLD = { 93: 'Siemens G120 & G120C — AC VFD', 277: 'MATLAB/Simulink Capsule Course for Electrical Engineering',
          296: 'Python for Deep Learning', 301: 'Applied Control Systems 4 — UAV Quaternions, MPC, PID',
          306: 'PLC AI Home — For Electrical and Control Engineers', 307: 'Master German with 900 Real-Life Conversations' };
        const FIELDS = { 93: ['title', 'hours', 'hours_verified', 'flag', 'url'], 277: ['title'],
          296: ['title', 'hours', 'hours_verified', 'url', 'skills'], 301: ['title', 'hours', 'hours_verified', 'url'],
          306: ['title'], 307: ['title', 'hours', 'hours_verified', 'url'] };
        Object.keys(OLD).forEach(n => {
          const c = st.courses.find(x => !x.deleted && +x.num === +n && x.title === OLD[n]);
          if (!c) return;
          const s = seed(+n), row = { id: c.id };
          FIELDS[n].forEach(f => { row[f] = s[f]; });
          write('courses', row, { silent: true });
        });
        for (let n = 401; n <= 412; n++) {
          const c = seed(n);
          if (!c || st.courses.some(x => +x.num === n || norm(x.title) === norm(c.title))) continue;
          write('courses', { id: uuid(), user_id: user && user.id, num: c.num, title: c.title, bloc_id: c.bloc,
            hours: c.hours, hours_verified: c.hours_verified, url: c.url, objective: c.objective,
            skills: c.skills || [], why: c.why, flag: c.flag, status: 'a_faire', progress_pct: 0,
            started_at: null, completed_at: null, notes: null, sort_order: c.sort_order, deleted: false }, { silent: true });
        }
      } },
    { id: 'modules-valides-2026-09',
      toast: 'patch.modules',
      when: st => {
        const live = st.modules.filter(m => !m.deleted), by = c => live.find(m => m.code === c);
        const PASSED = ['ATP', 'CTh1(a)', 'EAT(a)', 'PAut(a)', 'DS(a)', 'LEA', 'CTh2(a)',
                        'Entec', 'STPA', 'REE(a)', 'SAMS', 'SAMS(a)'];
        const beforeS3Grades = Date.now() < Date.parse('2026-11-01');
        return live.some(m => PASSED.includes(m.code) && m.status !== 'valide')
          || !by('REE(a)')
          || (by('SAMS') && by('SAMS(a)'))
          || (beforeS3Grades && live.some(m => ['S3', 'S4'].includes(m.semester) && m.status === 'valide'));
      },
      apply: ({ state: st, write, uuid }) => {
        const live = st.modules.filter(m => !m.deleted), by = c => live.find(m => m.code === c);
        const PASSED = ['ATP', 'CTh1(a)', 'EAT(a)', 'PAut(a)', 'DS(a)', 'LEA', 'CTh2(a)',
                        'Entec', 'STPA', 'REE(a)', 'SAMS', 'SAMS(a)'];
        live.filter(m => PASSED.includes(m.code) && m.status !== 'valide')
          .forEach(m => write('modules', { id: m.id, status: 'valide' }, { silent: true }));
        if (!by('REE(a)')) write('modules', { id: uuid(), code: 'REE(a)',
          title: 'Regelung in der Elektrischen Energieversorgung', type: 'W', cp: 6, graded: true,
          grade: 2.7, status: 'valide', semester: null, count_in_final: true, notes: null, deleted: false,
          sort_order: Math.max(0, ...st.modules.map(x => +x.sort_order || 0)) + 10 }, { silent: true });
        if (by('SAMS') && by('SAMS(a)'))            // même matière saisie deux fois : on garde « SAMS »
          write('modules', { id: by('SAMS(a)').id, deleted: true }, { silent: true });
        if (Date.now() < Date.parse('2026-11-01'))  // le S3 commence mi-octobre : aucune note avant novembre
          live.filter(m => ['S3', 'S4'].includes(m.semester) && m.status === 'valide')
            .forEach(m => write('modules', { id: m.id,
              status: m.type === 'MA' || m.grade == null ? 'prevu' : 'provisoire' }, { silent: true }));
      } },
    { id: 'masterarbeit-ialb-2026-09',
      when: { project: 'masterarbeit', field: 'institute', equals: 'IAT' },
      toast: 'patch.maIalb',
      patch: {
      "meta": {
        "format": "roadmap-patch-v2",
        "created": "2026-09-22",
        "title": "Masterarbeit IALB (Prof. Ebrahimi) en remplacement de l'IAT",
        "description": "Remplace l'engagement Masterarbeit (IAT) par la Masterarbeit IALB proposée par Prof. Dr.-Ing. Amir Ebrahimi : titre, institut, encadrant, sujet, notes, les 15 jalons et les liens de cours. Ajuste aussi le sujet du Master Projekt et la note du module NLS. Les cours sont désignés par leur numéro (num) ou leur titre ; l'application les résout en identifiants internes. Réappliquer ce fichier une seconde fois donne exactement le même résultat.",
        "applied_rules": {
          "projects": "mise à jour sur le champ code, création si absent",
          "milestones": "les jalons existants de l'engagement visé sont supprimés, puis ceux-ci sont insérés",
          "project_courses": "les liens existants de l'engagement visé sont supprimés, puis ceux-ci sont insérés",
          "courses_to_add": "inséré seulement si aucun cours du même titre n'existe déjà",
          "modules": "mise à jour sur le champ code"
        },
        "how_to": "Réglages → Import JSON → choisir ce fichier. La migration v2 doit être passée."
      },
      "courses_to_add": [
        {
          "num": 400,
          "title": "Schröder & Böcker — Elektrische Antriebe: Regelung von Antriebssystemen",
          "bloc": "b1",
          "sort_order": 45,
          "hours": 0,
          "flag": "à acquérir",
          "objective": "Référence allemande sur la régulation des entraînements (machines à courant continu, asynchrones, synchrones). Durée de lecture à estimer selon les chapitres utiles au sujet de la Masterarbeit.",
          "why": "Ouvrage de référence de l'encadrant pour la Masterarbeit IALB : c'est la base théorique de la conception du régulateur.",
          "skills": [
            "Regelung von Antriebssystemen",
            "Maschinenmodellierung",
            "Stromregelkreis"
          ]
        }
      ],
      "projects": [
        {
          "code": "masterarbeit",
          "title": "Masterarbeit — Reglerentwicklung für eine Maschine (Industrieprojekt)",
          "institute": "IALB",
          "topic": "Entwicklung eines Reglers für eine Maschine im Rahmen eines Industrieprojekts. Vorarbeiten aus einer bereits abgeschlossenen Masterarbeit vorhanden.",
          "supervisor": "Prof. Dr.-Ing. Amir Ebrahimi",
          "cp": 30,
          "start_date": null,
          "end_date": null,
          "status": "prevu",
          "notes": "Industriepartner et type de machine : à préciser. 24 semaines après inscription, prolongation unique de 8 semaines au plus. Note : 75 % mémoire, 25 % Kolloquium. Inscription seulement après Projekt validé + 24 CP Wahl + 78 CP (§6(2)). Contact : ebrahimi@ialb.uni-bremen.de · 0421 218-62680."
        }
      ],
      "milestones": [
        {
          "project": "masterarbeit",
          "sort_order": 1,
          "title": "Répondre à Prof. Ebrahimi",
          "due_date": "2026-09-24"
        },
        {
          "project": "masterarbeit",
          "sort_order": 2,
          "title": "Entretien : machine, partenaire industriel, outils, calendrier",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 3,
          "title": "Obtenir et lire la Masterarbeit précédente (Vorarbeiten)",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 4,
          "title": "Clarifier confidentialité (NDA / Sperrvermerk) avec le partenaire",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 5,
          "title": "Conditions §6(2) remplies (Projekt + 24 CP Wahl + 78 CP)",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 6,
          "title": "Inscription officielle au Prüfungsamt",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 7,
          "title": "Recherche bibliographique et plan de travail validé",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 8,
          "title": "Modélisation et identification de la machine",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 9,
          "title": "Conception du régulateur",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 10,
          "title": "Simulation et validation (Simulink / HIL)",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 11,
          "title": "Implémentation et essais sur la machine",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 12,
          "title": "Évaluation des résultats",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 13,
          "title": "Rédaction",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 14,
          "title": "Dépôt du mémoire",
          "due_date": null
        },
        {
          "project": "masterarbeit",
          "sort_order": 15,
          "title": "Kolloquium",
          "due_date": null
        }
      ],
      "project_courses": [
        {
          "project": "masterarbeit",
          "course_num": 65,
          "relevance": "indispensable"
        },
        {
          "project": "masterarbeit",
          "course_num": 83,
          "relevance": "indispensable"
        },
        {
          "project": "masterarbeit",
          "course_num": 14,
          "relevance": "indispensable"
        },
        {
          "project": "masterarbeit",
          "course_title": "Schröder & Böcker — Elektrische Antriebe: Regelung von Antriebssystemen",
          "relevance": "indispensable"
        },
        {
          "project": "masterarbeit",
          "course_num": 69,
          "relevance": "utile"
        },
        {
          "project": "masterarbeit",
          "course_num": 68,
          "relevance": "utile"
        },
        {
          "project": "masterarbeit",
          "course_num": 66,
          "relevance": "utile"
        },
        {
          "project": "masterarbeit",
          "course_num": 43,
          "relevance": "utile"
        }
      ],
      "modules": [
        {
          "code": "NLS",
          "notes": "Prioritaire parmi les électifs : modes glissants et gain scheduling servent directement au sujet de la Masterarbeit IALB."
        }
      ]
    } },
    /* Sujet du Master Projekt (IALB) : remplacer un PI qui fonctionne par un MPC.
       Condition stable : dès que le titre parle de prédictif, il ne repasse plus. */
    { id: 'projekt-mpc-2026-09',
      toast: 'patch.projektMpc',
      when: st => {
        const p = st.projects.find(x => x.code === 'projekt');
        return !p || !/prädiktiv|MPC/i.test((p.title || '') + ' ' + (p.topic || ''));
      },
      apply: ({ state: st, write, importPatch }) => {
        // les cours de commande prédictive rejoignent le bloc Regelungstechnik
        const MOVE = { 258: 15, 69: 25, 257: 35 };
        st.courses.filter(c => !c.deleted && MOVE[c.num] != null && c.bloc_id !== 'b1')
          .forEach(c => write('courses', { id: c.id, bloc_id: 'b1', sort_order: MOVE[c.num],
            flag: c.flag === 'selon sujet' ? null : c.flag }, { silent: true }));
        importPatch({
        "projects": [
          {
            "code": "projekt",
            "title": "Master Projekt — Modellprädiktive Regelung eines zweiphasigen Motors",
            "institute": "IALB",
            "topic": "Ein bereits funktionierender PI-Regler soll durch einen MPC-Regler ersetzt werden, um eine bessere Regelung der Maschinengrößen zu erzielen.",
            "cp": 18,
            "notes": "Point de départ : le PI actuel fonctionne — mesurer ses performances AVANT de le remplacer, c'est la référence de comparaison. À confirmer avec l'encadrant : type exact du moteur biphasé, grandeurs régulées (courants, couple, vitesse, position), plateforme temps réel."
          }
        ],
        "milestones": [
          {
            "project": "projekt",
            "sort_order": 1,
            "title": "Sujet validé avec l'encadrant (IALB)",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 2,
            "title": "Inscription du Projekt au Prüfungsamt",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 3,
            "title": "Prise en main du banc : moteur biphasé, onduleur, capteurs",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 4,
            "title": "Analyse du régulateur PI existant — performances de référence",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 5,
            "title": "Modèle d'état du moteur biphasé et identification des paramètres",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 6,
            "title": "Validation du modèle : simulation contre mesures",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 7,
            "title": "Conception du MPC : horizon, fonction de coût, contraintes courant / tension",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 8,
            "title": "Simulation comparative PI / MPC (Simulink)",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 9,
            "title": "Implémentation temps réel et contrôle du temps de calcul",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 10,
            "title": "Essais sur le banc et comparaison PI / MPC",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 11,
            "title": "Rédaction du rapport",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 12,
            "title": "Rapport rendu",
            "due_date": null
          },
          {
            "project": "projekt",
            "sort_order": 13,
            "title": "Présentation",
            "due_date": null
          }
        ],
        "project_courses": [
          {
            "project": "projekt",
            "course_num": 258,
            "relevance": "indispensable"
          },
          {
            "project": "projekt",
            "course_num": 69,
            "relevance": "indispensable"
          },
          {
            "project": "projekt",
            "course_num": 65,
            "relevance": "indispensable"
          },
          {
            "project": "projekt",
            "course_num": 14,
            "relevance": "indispensable"
          },
          {
            "project": "projekt",
            "course_num": 400,
            "relevance": "indispensable"
          },
          {
            "project": "projekt",
            "course_num": 257,
            "relevance": "utile"
          },
          {
            "project": "projekt",
            "course_num": 83,
            "relevance": "utile"
          },
          {
            "project": "projekt",
            "course_num": 68,
            "relevance": "utile"
          },
          {
            "project": "projekt",
            "course_num": 66,
            "relevance": "utile"
          },
          {
            "project": "projekt",
            "course_num": 43,
            "relevance": "utile"
          }
        ],
        "modules": [
          {
            "code": "PMA",
            "notes": "Master Projekt IALB : MPC d'un moteur biphasé (remplacement du PI)."
          }
        ]
      }, { quiet: true });
      } },
  ],

  /* ── modules du Master (MPO 22.04.2020) ───────────────────────────────── */
  modules: [
    { code: 'ATP',     title: 'Automatisierung technischer Prozesse', type: 'P',  cp: 6, graded: true,  grade: 1.0, status: 'valide' },
    { code: 'CTh1(a)', title: 'Control Theory 1',                     type: 'P',  cp: 6, graded: true,  grade: 1.3, status: 'valide' },
    { code: 'EAT(a)',  title: 'Elektrische Antriebstechnik',          type: 'P',  cp: 6, graded: true,  grade: 3.3, status: 'valide' },
    { code: 'PAut(a)', title: 'Process Automation in Power Grids',    type: 'P',  cp: 6, graded: true,  grade: 1.7, status: 'valide' },
    { code: 'DS(a)',   title: 'Diskrete Systeme',                     type: 'P',  cp: 6, graded: true,  grade: 1.0, status: 'valide' },
    { code: 'LEA',     title: 'Leistungselektronik in der AT',        type: 'P',  cp: 6, graded: true,  grade: 1.3, status: 'valide' },
    { code: 'CTh2(a)', title: 'Control Theory 2',                     type: 'W',  cp: 6, graded: true,  grade: 1.0, status: 'valide', notes: 'Vérifier : 1,0 ou 1,3' },
    { code: 'SAMS(a)', title: 'Sensors and Measurement Systems',      type: 'W',  cp: 6, graded: true,  grade: 3.3, status: 'valide' },
    { code: 'REE(a)',  title: 'Regelung in der Elektrischen Energieversorgung', type: 'W', cp: 6, graded: true, grade: 2.7, status: 'valide' },
    { code: 'Entec',   title: 'Praktikum Energietechnik',             type: 'WP', cp: 3, graded: false, grade: null, status: 'valide' },
    { code: 'STPA',    title: 'Praktikum Schaltungstechnik',          type: 'WP', cp: 3, graded: false, grade: null, status: 'valide' },

    /* ── S3 prévu — notes prévisionnelles, hors moyenne confirmée ──────────
       Le type « W » est une hypothèse : ces trois modules font passer le
       Wahlbereich de 12 à 27 CP, donc au-dessus des 24 CP exigés par §6(2).
       À corriger dans la fiche du module si ton plan d'études dit autrement. */
    { code: 'EEA',     title: 'Elektrische Energieanlagen',           type: 'W',  cp: 6, graded: true, grade: 1.0, status: 'provisoire', semester: 'S3' },
    { code: 'CTh3',    title: 'Control Theory III',                   type: 'W',  cp: 3, graded: true, grade: 1.0, status: 'provisoire', semester: 'S3' },
    { code: 'NLS',     title: 'Nichtlineare Systeme',                 type: 'W',  cp: 6, graded: true, grade: 1.0, status: 'provisoire', semester: 'S3' },
    { code: 'PMA',     title: 'Projekt / Projektarbeit',              type: 'PROJEKT', cp: 18, graded: true, grade: 2.0, status: 'provisoire', semester: 'S3' },
    { code: 'ThsMSc',  title: 'Masterarbeit inkl. Kolloquium',        type: 'MA',      cp: 30, graded: true, grade: null, status: 'prevu',     semester: 'S4' }
  ],

  /* ── règles de la Prüfungsordnung, en dur ─────────────────────────────── */
  rules: {
    maWeeks: 24,          // durée de la Masterarbeit
    maExtraWeeks: 8,      // prolongation unique maximale
    wahlCapCp: 30,        // §2(6) : CP du Wahlbereich comptés dans la note
    reqTotalCp: 78,       // §6(2)
    reqPflicht: 5,        // cinq Pflichtmodule en plus du Projekt
    reqWahlpflicht: 2,
    reqWahlCp: 24,
    nachweisDays: 14,     // remise du Stundennachweis après la fin du contrat
    alertDays: 14         // alerte « cours indispensable non terminé »
  }
};
