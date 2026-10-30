// BIJLAGE 1: Tijdlijn Kinderrevalidatie Orthopedie spreekuur (KRO), als data.
//
// BRON: eigen document van de gebruiker, "Stroomschema_KRO" (pdf, 4 pagina's),
// aangeleverd 30-10-2026. De tekst is LETTERLIJK overgenomen uit de blokken van
// het stroomschema. Niet herschreven, niet ingekort, niets aangevuld.
//
// Wat het stroomschema laat zien en de platte tekst niet: het schema VERTAKT
// na de verwijzing. Twee routes, afhankelijk van of de indicatie bij het eerste
// consult al gesteld is:
//
//   route A  verwijzing -> 1e consult (indicatie GESTELD) -> klinimetrie pre
//            -> preoperatief MDO -> ...
//   route B  verwijzing -> 1e consult (MOGELIJK indicatie) -> klinimetrie pre
//            -> MDO klinimetrie -> 2e consult (indicatie gesteld)
//            -> preoperatief MDO -> ...
//
// Vanaf het preoperatief MDO lopen ze weer gelijk.
//
// In het schema zijn de teksten gekleurd. Zoals ik het lees: blauw = een taak
// die iemand moet uitvoeren (meestal de revalidatiearts), groen = een termijn,
// zwart = context (locatie, wie aanwezig is). Die indeling is hier aangehouden
// als 'taken', 'wanneer' en 'context'. Klopt die lezing niet, dan verschuift er
// tekst van de ene lijst naar de andere, maar er verandert geen woord.
//
// WAT ER OP AANWIJZING VAN DE ARTS IS AANGEPAST, en verder niets:
//
//   1. "peroperatief MDO" -> "preoperatief MDO" (twee plekken). Het schema
//      gebruikt beide vormen voor hetzelfde overleg; de arts bevestigde dat
//      "peroperatief" een tikfout is.
//   2. De GMFM staat in de bron onder "Altijd", maar geldt alleen bij CP.
//      Zonder CP blijft alleen GAS doelen over.
//   3. Een kind van precies 4 jaar valt in de bron tussen "<4 jaar" en
//      "> 4 jaar" in. Dat telt als "> 4 jaar", dus de Pedi CAT.
//
// Een taak met 'bij' geldt alleen voor die situatie: 'umcg' = patient niet
// elders bekend, 'elders' = bekend bij Treant, de Vogellanden of Revalidatie
// Friesland. Zo staat het in de bron en zo wordt het hier gefilterd.

(function (global) {
  'use strict';

  var WAAR_BEKEND = [
    { id: 'umcg', kort: 'Niet elders bekend', groep: 'umcg',
      zin: 'Patient is niet elders bekend.' },
    { id: 'treant', kort: 'Bekend bij Treant', groep: 'elders',
      zin: 'Patient is bekend bij Treant.' },
    { id: 'vogellanden', kort: 'Bekend bij de Vogellanden', groep: 'elders',
      zin: 'Patient is bekend bij de Vogellanden.' },
    { id: 'friesland', kort: 'Bekend bij Revalidatie Friesland', groep: 'elders',
      zin: 'Patient is bekend bij Revalidatie Friesland.' }
  ];

  // Wat er bij 'elders' extra geldt: het loopt via de verwijzend revalidatiearts
  // daar. Dat is geen aparte regel uit de bron maar de optelsom van de regels
  // die 'elders' noemen; daarom staat het als waarschuwing op het scherm en
  // niet als taak in de dossiertekst.
  var ELDERS_LET_OP =
    'Bij een patient die elders bekend is loopt het klinimetrieconsult via de verwijzend ' +
    'revalidatiearts daar, en wordt de klinimetrie op die locatie verricht. De gegevens ' +
    'gaan dan in het CP register, niet in de observatielijst in EPIC.';

  var KLINIMETRIE = {
    kop: '* Te verrichten klinimetrie',
    // De bron zet GAS doelen en GMFM allebei onder "Altijd". Op aanwijzing van
    // de arts geldt de GMFM alleen bij CP; zonder CP blijft alleen GAS over.
    altijd: { kop: 'Altijd', items: [
      { tekst: 'GAS doelen' },
      { tekst: 'GMFM', alleenCp: true }
    ] },
    groepen: [
      {
        id: 'i-iii', kop: 'CP GMFCS ( tot en met III)',
        items: [
          { tekst: '6 minuten looptest' },
          { tekst: 'Pedi NL', leeftijd: 'jong', na: 'kind <4 jaar' },
          { tekst: 'Pedi CAT', leeftijd: 'oud', na: 'kind > 4 jaar' },
          { tekst: 'Functionele kracht testen' },
          { tekst: 'Gangbeeldanalyse (indien nog niet verricht voor de indicatie stelling)' }
        ]
      },
      {
        id: 'iv-v', kop: 'CP GMFCS IV-V',
        items: [ { tekst: 'CP Child' } ]
      }
    ],
    noten: [
      'De bron schrijft "kind <4 jaar" en "kind > 4 jaar", waardoor een kind van precies 4 in geen van beide groepen valt. Op aanwijzing van de arts telt precies 4 jaar als "> 4 jaar": dus de Pedi CAT.',
      'De bron zet GAS doelen en GMFM allebei onder "Altijd". Op aanwijzing van de arts geldt de GMFM alleen bij CP; zonder CP blijft alleen GAS over.',
      'De twee groepen heten in de bron "CP GMFCS". Voor een kind zonder CP zegt het document niets over de groepsgebonden testen.'
    ]
  };

  // De stappen in de volgorde van het schema. 'route' zegt in welke tak de stap
  // zit: 'a', 'b' of 'beide'.
  var STAPPEN = [
    {
      id: 'verwijzing', naam: 'Verwijzing naar KRO spreekuur', route: 'beide',
      fase: 'start',
      context: [
        'Intern via een order',
        'Extern via een verwijsbrief (onder documenten in EPIC',
        'Via kinderrevalidatiearts',
        'Op advies orthopeed, via kinderrevalidatie orthopedie spreekuur Vogellanden of revalidatie Friesland.'
      ],
      taken: [],
      noot: 'Het haakje in "(onder documenten in EPIC" gaat in de bron niet dicht. Zo overgenomen.'
    },

    {
      id: 'consult1a', naam: 'KRO 1e consult: indicatie chirurgische behandeling gesteld',
      route: 'a', fase: 'consult', volgende: 'klinimetrie_pre',
      taken: [
        { id: 'mdo', tekst: 'Revalidatiearts vraagt preoperatief MDO aan bij het secretariaat medische staf revalidatiegeneeskunde. Met betrokken revalidatiearts en paramedici' },
        { id: 'checklist', tekst: 'Checklist invullen met ouders en orthopeed (zie bijlage 2)', bijlage2: true },
        { id: 'klin', tekst: 'Klinimetrie consult aanvragen door revalidatiearts:', onder: [
          { id: 'umcg', tekst: 'Via order UMCG CvR locatie Beatrixoord indien kind niet elders bekend.', bij: 'umcg' },
          { id: 'elders', tekst: 'Via verwijzend revalidatiearts indien patiënt bekend bij Treant, de Vogellanden of revalidatie Friesland.', bij: 'elders' }
        ] }
      ],
      noot: 'In de bron staat hier "peroperatief MDO"; elders in hetzelfde schema heet het "preoperatief MDO". Op aanwijzing van de arts is dat een tikfout en staat er hier "preoperatief". Dat is de enige plek waar de tekst van de bron afwijkt.'
    },

    {
      id: 'consult1b', naam: 'KRO 1e consult: mogelijk indicatie chirurgische behandeling',
      route: 'b', fase: 'consult', volgende: 'klinimetrie_pre',
      taken: [
        { id: 'klin', tekst: 'Klinimetrie consult aanvragen door revalidatiearts:', onder: [
          { id: 'umcg', tekst: 'Via order UMCG CvR locatie Beatrixoord' }
        ] },
        { id: 'gba', tekst: 'Op indicatie gangbeeldanalyse in het UMCG aanvragen door revalidatiearts' },
        { id: 'mdoklin', tekst: 'MDO klinimetrie met betrokken revalidatiearts en fysiotherapeut aanvragen door revalidatiearts' },
        { id: 'controle', tekst: 'Controle consult aanvragen op het KRO voor bespreken klinimetrie en behandelplan door revalidatiearts' }
      ],
      noot: 'Bij deze stap noemt de bron alleen "Via order UMCG CvR locatie Beatrixoord", zonder de variant voor een patiënt die elders bekend is — terwijl die variant bij het andere 1e consult wél staat. Niet aangevuld; vraag is of dat bedoeld is.'
    },

    {
      id: 'klinimetrie_pre', naam: 'Klinimetrie pre operatief', route: 'beide',
      fase: 'klinimetrie', klinimetrie: true,
      taken: [
        { id: 'umcg', bij: 'umcg', tekst: 'Uitvoeren in UMCG CvR locatie Beatrixoord indien patiënt niet elders bekend of wanneer specifieke informatie nodig is voor het bepalen van de juiste (chirurgische) behandeling. Fysiotherapeut en revalidatiearts noteren bevindingen in observatielijst EPIC' },
        { id: 'elders', bij: 'elders', tekst: 'Indien patiënt bekend is bij Treant, de Vogellanden of Revalidatie Friesland, dit op de locatie waar patiënt bekend is verrichten. Revalidatiearts elders noteert gegevens in CP register' }
      ]
    },

    {
      id: 'mdo_klinimetrie_pre', naam: 'MDO klinimetrie pre operatief', route: 'b',
      fase: 'mdo', volgende: 'consult2',
      wanneer: '1-2 weken na klinimetrie consult + gangbeeldanalyse',
      context: ['Aanwezig: revalidatiearts, orthopeed, fysiotherapeut en gangbeeldanalist'],
      taken: []
    },

    {
      id: 'consult2', naam: 'KRO 2e consult: indicatie chirurgische behandeling gesteld',
      route: 'b', fase: 'consult', volgende: 'mdo_pre',
      taken: [
        { id: 'checklist', tekst: 'Checklist invullen met ouders en orthopeed (zie bijlage 2)', bijlage2: true },
        { id: 'mdo', tekst: 'Revalidatiearts vraagt preoperatief MDO aan bij het secretariaat medische staf revalidatiegeneeskunde. Met betrokken revalidatiearts en paramedici' }
      ]
    },

    {
      id: 'mdo_pre', naam: 'Preoperatief MDO', route: 'beide', fase: 'mdo',
      wanneer: 'Het preoperatief MDO wordt bij voorkeur 8-12 weken voor (chirurgische) behandeling gepland.',
      context: ['MDO met eigen behandelteam, checklist (bijlage 2) doornemen en afspraken maken wie wat doet, zowel pre als postoperatief'],
      taken: [
        { id: 'checklist', tekst: 'Checklist (bijlage 2) doornemen en afspraken maken wie wat doet, zowel pre als postoperatief', bijlage2: true },
        { id: 'brief', tekst: 'Revalidatiearts maakt n.a.v. het preoperatief MDO een behandelplan brief en verstuurd deze naar alle betrokkenen' }
      ],
      noot: '"verstuurd deze" moet vermoedelijk "verstuurt deze" zijn. Niet gecorrigeerd. De eerste taak hierboven is dezelfde zin als de context erboven, opgesplitst zodat je hem kunt afvinken.'
    },

    {
      id: 'poli', naam: 'Optioneel: kortdurende poliklinische revalidatiebehandeling ter voorbereiding',
      route: 'beide', fase: 'voorbereiding', optioneel: true,
      taken: [
        { id: 'uitproberen', tekst: 'Uitproberen voorzieningen, hulpmiddelen en houdingen pre operatief' },
        { id: 'waar', tekst: 'In het UMCG CvR locatie Beatrixoord indien patiënt hier bekend, indien patiënt al elders bekend dan in eigen regio organiseren indien nodig. Dit te bespreken tijdens het preoperatief MDO' }
      ]
    },

    {
      id: 'opname', naam: 'Opname UMCG', route: 'beide', fase: 'opname',
      context: ['De taken van paramedici en verpleegkundigen tijdens de klinische fase staan beschreven in bijlage 3'],
      taken: [
        { id: 'consult', tekst: 'Paramedici UMCG worden in consult gevraagd door de zaalarts Orthopedie, conform MDO behandelplan brief' },
        { id: 'overdracht', tekst: 'Bij ontslag zorgen de paramedici UMCG voor een overdracht naar de behandelaren die de therapie overnemen zoals bij het preoperatief MDO afgesproken' },
        { id: 'klinpost', tekst: 'De revalidatiearts vraagt de klinimetrie post operatief (6 maanden post operatief) aan in het UMCG indien patiënt daar onder behandeling, anders dit in eigen regio organiseren. Daarnaast zal een controle consult op het KRO worden aangevraagd nadat de klinimetrie verricht is' }
      ]
    },

    {
      id: 'klinimetrie_post', naam: 'Klinimetrie post operatief', route: 'beide',
      fase: 'klinimetrie', klinimetrie: true,
      wanneer: '6 maanden post operatief',
      taken: [
        { id: 'umcg', bij: 'umcg', tekst: 'Uitvoeren in UMCG CvR locatie Beatrixoord indien patiënt niet elders bekend Fysiotherapeut en revalidatiearts noteren bevindingen in observatielijst EPIC' },
        { id: 'elders', bij: 'elders', tekst: 'Indien patiënt bekend is bij Treant, de Vogellanden of Revalidatie Friesland, dit op de locatie waar patiënt bekend is verrichten. Revalidatiearts elders noteert gegevens in CP register' }
      ],
      noot: 'In de bron ontbreekt hier een punt tussen "niet elders bekend" en "Fysiotherapeut"; bij de pre-operatieve klinimetrie staat die er wel. Zo overgenomen.'
    },

    {
      id: 'mdo_klinimetrie_post', naam: 'MDO klinimetrie post operatief', route: 'beide',
      fase: 'mdo',
      wanneer: '1-2 weken na klinimetrie consult + gangbeeldanalyse',
      context: ['Aanwezig: revalidatiearts, orthopeed, fysiotherapeut en gangbeeldanalist'],
      taken: []
    },

    {
      id: 'controle_post', naam: 'KRO spreekuur controle consult post operatief',
      route: 'beide', fase: 'controle',
      wanneer: 'Na MDO klinimetrie post operatief plannen',
      context: ['Evalueren operatie, nabehandeling en klinimetrie bespreken'],
      taken: [
        { id: 'gba', tekst: 'Bij Multi-level operaties gangbeeldanalyse 1 en 2 jaar post operatief herhalen, aanvraag door revalidatiearts' }
      ]
    }
  ];

  // De termijnen die in het schema staan, zodat de app er data bij kan
  // uitrekenen. Elke regel noemt de bronzin waar hij vandaan komt; er wordt
  // geen termijn bijbedacht.
  var TERMIJNEN = [
    {
      id: 'mdo_pre', vanaf: 'ok', naam: 'Preoperatief MDO',
      vanWeken: -12, totWeken: -8,
      bron: 'Het preoperatief MDO wordt bij voorkeur 8-12 weken voor (chirurgische) behandeling gepland.'
    },
    {
      id: 'klin_post', vanaf: 'ok', naam: 'Klinimetrie post operatief',
      vanMaanden: 6, totMaanden: 6,
      bron: '6 maanden post operatief'
    },
    {
      id: 'gba1', vanaf: 'ok', naam: 'Gangbeeldanalyse 1 jaar post operatief (alleen bij multi-level)',
      vanJaren: 1, totJaren: 1,
      bron: 'Bij Multi-level operaties gangbeeldanalyse 1 en 2 jaar post operatief herhalen, aanvraag door revalidatiearts'
    },
    {
      id: 'gba2', vanaf: 'ok', naam: 'Gangbeeldanalyse 2 jaar post operatief (alleen bij multi-level)',
      vanJaren: 2, totJaren: 2,
      bron: 'Bij Multi-level operaties gangbeeldanalyse 1 en 2 jaar post operatief herhalen, aanvraag door revalidatiearts'
    },
    {
      id: 'mdo_klin', vanaf: 'klinimetrie', naam: 'MDO klinimetrie',
      vanWeken: 1, totWeken: 2,
      bron: '1-2 weken na klinimetrie consult + gangbeeldanalyse'
    }
  ];

  global.KRO = {
    titel: 'BIJLAGE 1: Tijdlijn Kinderrevalidatie Orthopedie spreekuur (KRO)',
    bron: 'Bron: BIJLAGE 1 Tijdlijn Kinderrevalidatie Orthopedie spreekuur (KRO), eigen document, letterlijk overgenomen uit het stroomschema (pdf, 4 pagina’s). De checklist waarnaar het schema verwijst is bijlage 2; de taken van paramedici en verpleging zijn bijlage 3.',
    eldersLetOp: ELDERS_LET_OP,
    waarBekend: WAAR_BEKEND,
    klinimetrie: KLINIMETRIE,
    stappen: STAPPEN,
    termijnen: TERMIJNEN,
    routes: [
      { id: 'a', naam: 'Indicatie al gesteld bij het 1e consult' },
      { id: 'b', naam: 'Mogelijk indicatie: eerst klinimetrie en MDO' }
    ]
  };
})(typeof window !== 'undefined' ? window : this);
