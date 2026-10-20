// Emla-smeerinstructie — tekst en tekeningen.
//
// BRON VAN DE TEKST: poster "Waar Emla® insmeren? Voor botulinetoxine-injecties",
// UMCG Centrum voor Revalidatie. Overgetypt uit een schermafbeelding van die
// poster — niet uit het bronbestand zelf. De zinnen staan er letterlijk in;
// er is niets aan toegevoegd of herschreven.
//
// Twee dingen uit die poster zijn bewust niet gladgestreken:
//  - de poster gebruikt "zalf" en "crème" door elkaar, ook binnen één zin;
//  - links/rechts staat er niet op. Dat onderscheid komt uit deze app, omdat
//    botulinetoxine vaak eenzijdig wordt gegeven. Het is een keuze van de arts,
//    geen uitspraak uit de bron.
//
// BRON VAN DE TEKENINGEN: anatomie-data.js (@musclemap/assets, MIT). Een regio
// beschrijft hier alleen wélk stuk van dat lichaam moet oplichten; emla.html
// tekent het. Vier soorten:
//   spier         - een of meer spierpaden lichten op
//   spierband     - een spierpad, afgeknipt tot een band (rectus femoris in de quadriceps)
//   lichaamsband  - de lichaamsomtrek, afgeknipt tot een band (binnenzijde dij, voorste onderbeen)
//   schets        - een eigen tekening; alleen de twee voeten, die zitten niet in de bron
// Banden staan als [x, y, breedte, hoogte] in de maten van het grote vlak
// (1024 x 1536), per kant van de AFBEELDING.

(function (global) {
  'use strict';

  // ---- de twee voeten: eigen schets, want voeten zitten niet in anatomie-data.js ----
  var VOET_ZIJ = {
    box: '0 0 170 100', breed: true,
    omtrek: 'M42,4 C38,24 34,40 28,50 C18,58 16,76 26,84 C32,88 40,88 46,86 ' +
      'C64,78 80,72 100,74 C120,76 140,80 154,80 C164,80 166,72 158,66 ' +
      'C140,58 118,48 104,38 C90,28 82,16 78,4 Z',
    extra: '<ellipse class="em-lijn2" cx="56" cy="36" rx="8" ry="9"/>',
    zone: '<ellipse class="em-zone" cx="82" cy="74" rx="38" ry="10" transform="rotate(-6 82 74)"/>',
  };

  var VOET_ZOOL = {
    box: '0 0 100 170', breed: false,
    omtrek: 'M50,26 C68,26 79,41 79,60 C79,78 72,90 69,105 ' +
      'C66,122 63,146 50,146 C37,146 34,122 31,105 C28,90 21,78 21,60 ' +
      'C21,41 32,26 50,26 Z',
    extra: '<ellipse class="em-huid" cx="29" cy="15" rx="8" ry="7"/>' +
      '<ellipse class="em-huid" cx="44" cy="11" rx="5.5" ry="5.5"/>' +
      '<ellipse class="em-huid" cx="55" cy="11" rx="5" ry="5"/>' +
      '<ellipse class="em-huid" cx="65" cy="13" rx="4.5" ry="4.5"/>' +
      '<ellipse class="em-huid" cx="73" cy="17" rx="4" ry="4"/>',
    zone: '<path class="em-zone" d="M50,30 C67,30 76,44 76,61 C76,78 70,90 67,105 ' +
      'C64,120 61,142 50,142 C39,142 36,120 33,105 C30,90 24,78 24,61 C24,44 33,30 50,30 Z"/>',
  };

  // ---- uitsnedes uit het grote vlak ----
  var BOX_DIJ_VOOR   = '336 662 352 400';   // bovenbeen: heup tot net onder de knie
  var BOX_DIJ_ACHTER = '336 766 352 390';   // bovenbeen achter: bilplooi tot net onder de knie
  var BOX_KUIT       = '318 996 388 420';   // knieplooi tot de hiel
  var BOX_SCHEEN     = '318 976 388 372';   // knie tot enkel

  var REGIOS = [
    {
      id: 'rectus',
      titel: 'Rectus femoris',
      sub: 'voorzijde bovenbeen',
      zin: 'Smeer het midden van de voorzijde van het bovenbeen in, over de gehele lengte van de rectus femoris.',
      tekening: {
        soort: 'spierband', aanzicht: 'voor', box: BOX_DIJ_VOOR, pad: 'QUADRICEPS_%',
        band: { LEFT: [402, 680, 44, 330], RIGHT: [576, 680, 44, 330] },
      },
    },
    {
      id: 'quadriceps',
      titel: 'Quadricepsregio',
      sub: 'voorzijde bovenbeen',
      zin: 'Smeer de volledige voorzijde van het bovenbeen in (quadricepsregio), van heup tot net boven de knie.',
      tekening: {
        soort: 'spier', aanzicht: 'voor', box: BOX_DIJ_VOOR, paden: ['QUADRICEPS_%'],
      },
    },
    {
      id: 'adductoren',
      titel: 'Adductorenregio',
      sub: 'binnenzijde bovenbeen',
      zin: 'Smeer de binnenzijde van het bovenbeen in, over de volledige adductorenregio (van lies tot knie).',
      tekening: {
        // de adductorenpaden lopen tot halverwege de dij; de band erbij maakt er
        // "van lies tot knie" van, zoals de zin zegt
        soort: 'lichaamsband', aanzicht: 'voor', box: BOX_DIJ_VOOR,
        band: { LEFT: [444, 770, 68, 250], RIGHT: [512, 770, 68, 250] },
        bij: ['ADDUCTOR_%'],
      },
    },
    {
      id: 'hamstrings',
      titel: 'Hamstringsregio',
      sub: 'achterzijde bovenbeen',
      zin: 'Smeer de achterzijde van het bovenbeen in, over de volledige hamstringsregio (van bilplooi tot net boven de knie).',
      tekening: {
        soort: 'spier', aanzicht: 'achter', box: BOX_DIJ_ACHTER, paden: ['HAMSTRINGS_%'],
        flauw: ['GLUTEUS_LEFT', 'GLUTEUS_RIGHT'],
      },
    },
    {
      id: 'kuit',
      titel: 'Triceps surae-regio',
      sub: 'kuit: gastrocnemius en soleus',
      zin: 'Smeer de volledige kuit in, van net onder de knieplooi tot aan de hiel (triceps surae-regio: gastrocnemius en soleus).',
      tekening: {
        soort: 'spier', aanzicht: 'achter', box: BOX_KUIT, paden: ['CALVES_%'],
      },
    },
    {
      id: 'scheen',
      titel: 'Voorzijde onderbeen',
      sub: 'voorzijde onderbeen',
      zin: 'Smeer de voorzijde van het onderbeen in, over de volledige voorste onderbeenregio (van knie tot enkel).',
      tekening: {
        soort: 'lichaamsband', aanzicht: 'voor', box: BOX_SCHEEN,
        band: { LEFT: [318, 1004, 194, 300], RIGHT: [512, 1004, 194, 300] },
      },
    },
    {
      id: 'voetmediaal',
      titel: 'Mediale zijde van de voet',
      sub: 'abductor hallucis',
      zin: 'Smeer de mediale zijde van de voet in, over de spierbuik van de abductor hallucis.',
      tekening: { soort: 'schets', schets: VOET_ZIJ },
    },
    {
      id: 'voetzool',
      titel: 'Plantaire zijde van de voet',
      sub: 'onderkant voet',
      zin: 'Smeer de onderkant van de voet in, van de hiel tot aan de tenen.',
      tekening: { soort: 'schets', schets: VOET_ZOOL },
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
    bronTekening: 'Lichaamstekeningen: @musclemap/assets (MIT).',
    vooraf: VOORAF,
    intro: INTRO,
    regios: REGIOS,
    algemeen: ALGEMEEN,
    letop: LETOP,
    dikteSvg: DIKTE_SVG,
  };
})(typeof window !== 'undefined' ? window : this);
