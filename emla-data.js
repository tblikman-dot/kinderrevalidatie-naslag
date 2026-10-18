// Emla-smeerinstructie — tekst en tekeningen.
//
// BRON: poster "Waar Emla® insmeren? Voor botulinetoxine-injecties",
// UMCG Centrum voor Revalidatie. Overgetypt uit een schermafbeelding van die
// poster — niet uit het bronbestand zelf. De zinnen staan er letterlijk in;
// er is niets aan toegevoegd of herschreven.
//
// Twee dingen uit die poster zijn bewust niet gladgestreken:
//  - de poster gebruikt "zalf" en "crème" door elkaar, ook binnen één zin;
//  - links/rechts staat er niet op. Dat onderscheid komt uit deze app, omdat
//    botulinetoxine vaak eenzijdig wordt gegeven. Het is een keuze van de arts,
//    geen uitspraak uit de bron.

(function (global) {
  'use strict';

  // ---- schematische silhouetten; geen anatomische platen ----
  var BOVENBEEN =
    '<path class="em-huid" d="M40,4 C56,4 64,16 62,38 C60,62 58,86 56,106 ' +
    'C55,118 49,126 40,126 C31,126 25,118 24,106 C22,86 20,62 18,38 ' +
    'C16,16 24,4 40,4 Z"/>' +
    '<ellipse class="em-huid" cx="40" cy="134" rx="14" ry="7"/>';

  var ONDERBEEN =
    '<path class="em-huid" d="M40,4 C54,4 62,18 60,40 C58,62 52,80 49,96 ' +
    'C47,110 46,120 45,128 Q40,134 35,128 C34,120 33,110 31,96 ' +
    'C28,80 22,62 20,40 C18,18 26,4 40,4 Z"/>';

  var VOET_ZIJ =
    '<path class="em-huid" d="M16,62 C8,54 10,36 22,28 C34,20 46,22 58,30 ' +
    'C72,39 92,46 114,50 C126,52 132,58 130,64 Q128,68 120,68 L26,68 ' +
    'Q18,68 16,62 Z"/>';

  var VOET_ZOOL =
    '<path class="em-huid" d="M45,20 C62,20 72,36 72,56 C72,76 66,90 64,106 ' +
    'C62,122 58,138 45,138 C32,138 28,122 26,106 C24,90 18,76 18,56 ' +
    'C18,36 28,20 45,20 Z"/>' +
    '<ellipse class="em-huid" cx="27" cy="12" rx="7" ry="6"/>' +
    '<ellipse class="em-huid" cx="40" cy="9" rx="5" ry="5"/>' +
    '<ellipse class="em-huid" cx="50" cy="9" rx="4.5" ry="4.5"/>' +
    '<ellipse class="em-huid" cx="58" cy="11" rx="4" ry="4"/>' +
    '<ellipse class="em-huid" cx="65" cy="14" rx="3.5" ry="3.5"/>';

  function been(binnenwerk, zone) {
    return '<svg class="em-tek" viewBox="0 0 80 145" role="img" aria-hidden="true">' +
      binnenwerk + zone + '</svg>';
  }
  function voetZij(zone) {
    return '<svg class="em-tek em-breed" viewBox="0 0 140 80" role="img" aria-hidden="true">' +
      VOET_ZIJ + zone + '</svg>';
  }
  function voetZool(zone) {
    return '<svg class="em-tek" viewBox="0 0 90 150" role="img" aria-hidden="true">' +
      VOET_ZOOL + zone + '</svg>';
  }

  // de streep bovenaan de achterzijde is de bilplooi
  var BILPLOOI = '<path class="em-lijn" d="M22,18 Q40,27 58,18"/>';

  var REGIOS = [
    {
      id: 'rectus',
      titel: 'Rectus femoris',
      sub: 'voorzijde bovenbeen',
      zin: 'Smeer het midden van de voorzijde van het bovenbeen in, over de gehele lengte van de rectus femoris.',
      svg: been(BOVENBEEN, '<ellipse class="em-zone" cx="40" cy="64" rx="9" ry="46"/>'),
    },
    {
      id: 'quadriceps',
      titel: 'Quadricepsregio',
      sub: 'voorzijde bovenbeen',
      zin: 'Smeer de volledige voorzijde van het bovenbeen in (quadricepsregio), van heup tot net boven de knie.',
      svg: been(BOVENBEEN, '<ellipse class="em-zone" cx="40" cy="64" rx="19" ry="52"/>'),
    },
    {
      id: 'adductoren',
      titel: 'Adductorenregio',
      sub: 'binnenzijde bovenbeen',
      zin: 'Smeer de binnenzijde van het bovenbeen in, over de volledige adductorenregio (van lies tot knie).',
      svg: been(BOVENBEEN, '<ellipse class="em-zone" cx="29" cy="66" rx="10" ry="50"/>'),
    },
    {
      id: 'hamstrings',
      titel: 'Hamstringsregio',
      sub: 'achterzijde bovenbeen',
      zin: 'Smeer de achterzijde van het bovenbeen in, over de volledige hamstringsregio (van bilplooi tot net boven de knie).',
      svg: been(BOVENBEEN + BILPLOOI, '<ellipse class="em-zone" cx="40" cy="70" rx="18" ry="46"/>'),
    },
    {
      id: 'kuit',
      titel: 'Triceps surae-regio',
      sub: 'kuit: gastrocnemius en soleus',
      zin: 'Smeer de volledige kuit in, van net onder de knieplooi tot aan de hiel (triceps surae-regio: gastrocnemius en soleus).',
      svg: been(ONDERBEEN,
        '<path class="em-zone" d="M23,28 C19,58 31,70 33,96 L35,124 L45,124 ' +
        'L47,96 C49,70 61,58 57,28 C51,16 29,16 23,28 Z"/>'),
    },
    {
      id: 'scheen',
      titel: 'Voorzijde onderbeen',
      sub: 'voorzijde onderbeen',
      zin: 'Smeer de voorzijde van het onderbeen in, over de volledige voorste onderbeenregio (van knie tot enkel).',
      svg: been(ONDERBEEN, '<ellipse class="em-zone" cx="40" cy="60" rx="13" ry="48"/>'),
    },
    {
      id: 'voetmediaal',
      titel: 'Mediale zijde van de voet',
      sub: 'abductor hallucis',
      zin: 'Smeer de mediale zijde van de voet in, over de spierbuik van de abductor hallucis.',
      svg: voetZij('<ellipse class="em-zone" cx="68" cy="56" rx="28" ry="9" ' +
        'transform="rotate(-6 68 56)"/>'),
    },
    {
      id: 'voetzool',
      titel: 'Plantaire zijde van de voet',
      sub: 'onderkant voet',
      zin: 'Smeer de onderkant van de voet in, van de hiel tot aan de tenen.',
      svg: voetZool(
        '<path class="em-zone" d="M45,26 C59,26 67,39 67,56 C67,74 61,88 59,104 ' +
        'C57,118 54,132 45,132 C36,132 33,118 31,104 C29,88 23,74 23,56 ' +
        'C23,39 31,26 45,26 Z"/>'),
    },
  ];

  // Het kader bovenaan de poster. In de schermafbeelding staan de woorden
  // "over het" in lichtere letters, alsof ze zijn doorgehaald; de zin is hier
  // overgenomen zoals hij gelezen hoort te worden.
  var INTRO = [
    "Smeer de zalf op de aangegeven regio('s), over het gehele gekleurde gebied.",
    "Bij injecties in meerdere spieren: smeer alle relevante regio's in.",
  ];

  var VOORAF = 'Minimaal 60 minuten voor de behandeling aanbrengen.';

  var ALGEMEEN = [
    "Breng een dikke laag Emla® crème aan op de aangegeven regio('s) en smeer goed uit.",
    'Dek eventueel af met een niet-luchtdoorlatende folie (bijv. huishoudfolie) en fixeer met een pleister.',
    'Laat minimaal 60 minuten zitten (langer mag, maximaal 4 uur).',
    'Verwijder de zalf of veeg overtollige crème af vlak voor de behandeling.',
    'Alleen op de huid aanbrengen. Niet op open wonden of geïrriteerde huid.',
    'Bij vragen kunt u contact opnemen met het revalidatieteam.',
  ];

  var LETOP = [
    'Gebruik uitsluitend Emla® crème (lidocaïne/prilocaïne).',
    'Vermijd contact met ogen, mond en slijmvliezen.',
    'Bij huidirritatie: afspoelen en contact opnemen.',
    'Niet aanbrengen bij bekende overgevoeligheid voor lidocaïne, prilocaïne of andere amide-type lokale anaesthetica.',
    'Volg altijd het persoonlijke advies van de behandelend arts.',
  ];

  // "Hoe dik is een dikke laag" — doorsnede: huid, laag crème, folie erover.
  var DIKTE_SVG =
    '<svg viewBox="0 0 200 86" role="img" aria-label="Doorsnede: een dikke laag crème met folie erover">' +
    '<path class="em-folie" d="M18,30 Q100,8 182,30"/>' +
    '<path class="em-creme" d="M30,60 Q36,30 60,30 L140,30 Q164,30 170,60 Z"/>' +
    '<rect class="em-huidlaag" x="14" y="60" width="172" height="14" rx="5"/>' +
    '<path class="em-pleister" d="M14,30 L30,26"/>' +
    '<path class="em-pleister" d="M186,30 L170,26"/>' +
    '<path class="em-maat" d="M24,30 L24,60"/>' +
    '<text class="em-maattekst" x="8" y="48">dik</text>' +
    '<text class="em-maattekst" x="86" y="13">folie</text>' +
    '<text class="em-maattekst" x="84" y="71">huid</text>' +
    '</svg>';

  global.EMLA = {
    bron: 'Poster “Waar Emla® insmeren? Voor botulinetoxine-injecties”, UMCG Centrum voor Revalidatie (overgetypt uit een schermafbeelding).',
    vooraf: VOORAF,
    intro: INTRO,
    regios: REGIOS,
    algemeen: ALGEMEEN,
    letop: LETOP,
    dikteSvg: DIKTE_SVG,
  };
})(typeof window !== 'undefined' ? window : this);
