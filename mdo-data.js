// De MDO-checklist en de spreekkamerversie, als data.
//
// BRON: eigen checklist van de gebruiker (revalidatiearts), aangeleverd als tekst
// op 27-10-2026. Twee documenten: de definitieve MDO-checklist (negen punten) en
// een kortere versie voor in de spreekkamer.
//
// DE TEKST IS LETTERLIJK OVERGENOMEN. Niet herschreven, niet ingekort, niets
// aangevuld. Dat was de expliciete opdracht. Wat in de bron rammelt, rammelt hier
// dus ook; het staat per punt in 'noot' op het scherm in plaats van stil
// gecorrigeerd te zijn.
//
// Drie dingen moesten wél wijken, en alleen in de tekst die naar Epic gaat:
//
// 1. Opsommingstekens aan het begin van een regel. Een regel die met "- ", "* "
//    of "o " begint wordt door een teksteditor stilzwijgend een lijst met eigen
//    inspringing (zie epictekst.js). De woorden zijn identiek; het streepje of
//    bolletje ervoor is weg.
// 2. De nummering "1." tot "9." staat in de Epic-tekst als "(1)" tot "(9)",
//    om dezelfde reden: "1. " aan het begin van een regel maakt een genummerde
//    lijst. Op het scherm staat gewoon 1 tot 9.
// 3. Accenten en bijzondere tekens gaan eruit (naarAscii): "Patiënte" wordt
//    "Patiente". Anders komen er ruitjes of vraagtektens in het dossier.
//
// Wat NIET gewijzigd is, en met opzet blijft staan: de Epic-invulmarkeringen van
// de gebruiker zelf. *** is vrije tekst, { a / b / c } is een keuzelijst en
// ja/nee is een keuze. Die vult Epic of de arts zelf in. Let op: dosering.html
// verbiedt die tekens juist in zijn dossiertekst, omdat ze daar per ongeluk
// zouden ontstaan. Hier zijn ze het doel.
//
// Invulvelden in een regel staan als {naam}. Is er niets ingevuld, dan komt de
// puntjes-plaatshouder uit de bron terug, zodat je in het dossier ziet dat daar
// nog iets moet.

(function (global) {
  'use strict';

  var SPREEKKAMER = {
    kop: 'Spreekkamer',
    // Letterlijk, in deze volgorde. De lege regels zijn alineagrenzen.
    regels: [
      'Patiënte/ouders/verzorgers kreeg uitleg over bovengenoemde conclusie.',
      'In het gezamenlijke consult met kinderorthopeed en kinderrevalidatiearts werd onderstaand behandelvoorstel gedaan met als doel: ***.',
      'Patiënte / { ouders/pleegouders/verzorgers} kregen een voorstel voor een operatieve ingreep: ***.',
      'De procedure () de mogelijke complicatie’s (zoals bloeding, infectie, falen, zenuwletsel, pijn, angst) en de alternatieven (niets doen, ….)zijn besproken.',
      '',
      'Patiënt / { ouders/pleegouders/verzorgers } {zijn akkoord / zijn niet akkoord/ denken nog verder na} t.a.v. de voorgestelde ingreep conform WGBO.',
      '',
      'Pre-operatief zal een MDO met de behandelaren van patient/patiente (ET/FT/Logo/Psy) en behandelaren in het UMCG (ergotherapeut, fysiotherapeut en revalidatiearts) plaatsvinden om de voorzieningen te checken en onderling af te stemmen over de voorbereiding van de operatie en de nabehandeling.',
      'Pre- en 3/6 maanden postoperatief zal klinimetrie consult gepland worden in het UMCG voor het afnemen van klinimetrie.',
      '',
      'Patiënte / { ouders/pleegouders/verzorgers} zijn akkoord met:',
      'Deelname CP register ja/nee',
      'MDO / afstemming met behandelaren uit regio: ja/nee',
      'Verzenden van deze brief naar behandelaren (ET/FT/Logo/Rev arts) uit regio: ja/nee'
    ],
    noten: [
      '"bovengenoemde conclusie" verwijst naar tekst die bóven deze alinea in de notitie hoort te staan. Die heb ik niet; die zet je er zelf boven.',
      'In de bron staat vier keer "Patiënte" en één keer "Patiënt". Zo overgenomen.',
      '"De procedure ()" heeft lege haakjes: een invulplek zonder ***-markering. Zo overgenomen.',
      '"complicatie’s" staat zo in de bron; vermoedelijk "complicaties".',
      'In "(niets doen, ….)zijn besproken" ontbreekt een spatie na het haakje. Zo overgenomen.',
      'De drie ja/nee-regels stonden in de bron deels met en deels zonder bolletje. Hier staan ze alle drie gelijk.',
      'De twee alinea’s over het pre-operatieve MDO en de klinimetrie kwamen later los aan, zonder dat erbij stond waar ze horen. Ze staan nu na de WGBO-zin en vóór "zijn akkoord met", omdat dat de enige plek is waar ze in de loop van de tekst passen. Klopt dat niet, dan verplaats ik ze.',
      'Die eerste alinea schrijft "patient/patiente" met een schuine streep, terwijl de rest van de tekst "Patiënte" gebruikt. Zo overgenomen.',
      '"Pre- en 3/6 maanden postoperatief" staat hier; het stroomschema (bijlage 1) noemt alleen 6 maanden postoperatief. Zo overgenomen.'
    ]
  };

  // BIJLAGE 3: de taken van verpleging en paramedici in de klinische fase.
  // Letterlijk overgenomen uit "Logistiek - Paramedische Disciplines", zoals
  // aangeleverd. Tijdens het preoperatief MDO loop je deze lijst langs en vink
  // je aan wat voor dit kind geldt; de discipline erboven is het antwoord op
  // "wie doet wat".
  var TAKEN = {
    titel: 'LOGISTIEK - PARAMEDISCHE DISCIPLINES',
    kop: 'Logistiek — Paramedische Disciplines',
    inleiding: 'Er zijn afspraken mbt de taken van de verpleegkundige, fysiotherapeut, ergotherapeut in de postoperatieve begeleiding in de klinische fase.',
    groepen: [
      {
        id: 't1', kop: 'Verpleegkundige:', soort: 'check',
        opties: [
          { id: 'voorz', tekst: 'Benodigde extra voorzieningen (t.a.v transfer, beleid bewegingsbeperkingen) zijn vooraf bekend en zijn georderd zodat deze op de opname-dag geleverd worden (tillift, passende tilmat, ad-matras, Rebacare kussens) Orthopedie zorg voor een opmerking in de opname-order waarin verwezen wordt naar een mdo-notitie van de revalidatie. In die notitie staat welke voorzieningen nodig zijn. De regieverpleegkundige ziet deze order voor opname en bestelt de voorzieningen bij MHM.' },
          { id: 'adl', tekst: 'ADL-verzorging, wondverzorging' },
          { id: 'pijn', tekst: 'Monitoren pijn/comfort' },
          { id: 'instructie', tekst: 'Instructies m.b.t post-operatief beleid uitdragen aan ouders, zie beleid orthopedie.' },
          { id: 'positie', tekst: 'Positioneren en start bewegen in bed .' },
          { id: 'schema', tekst: 'Uitvoer mobiliseerschema. Fysiotherapie maakt het schema in overleg met verpleging, ouders, ergotherapie.' }
        ]
      },
      {
        id: 't2', kop: 'Ergotherapie:', soort: 'check',
        opties: [
          { id: 'check', tekst: 'Voorzieningen-check (zoals afgesproken in mdo met behandelend ergotherapeut)' },
          { id: 'bed', tekst: 'Mobiliseren en positioneren in bed (Rebacare)' },
          { id: 'transfer', tekst: 'Bij passieve transfer: oefenen eerste keer met tillift + instellen rolstoel' },
          { id: 'schema', tekst: 'Mobiliseerschema afspreken, evaluatie mobiliseren' },
          { id: 'rolstoel', tekst: 'Eventueel passing rolstoel met leverancier (orthese, aanpassen huidige voorziening)' }
        ]
      },
      {
        id: 't3', kop: 'Fysiotherapie:', soort: 'check',
        opties: [
          { id: 'bed', tekst: 'Mobiliseren in bed' },
          { id: 'positie', tekst: 'Positioneren in bed (Rebacare)' },
          { id: 'advies', tekst: 'Advies en instructies aan verpleging en ouders, opstarten oefenen volgens beleid orthopeed en revalidatiearts, ademhalingstherapie, mobiliseren (naar de rolstoel, eerste keer tillift), actieve transfer oefenen' }
        ]
      },
      {
        id: 't4', kop: 'Logopedie:', soort: 'check',
        opties: [
          { id: 'edacs', tekst: 'Edacs level (sondevoeding va level 3, alleen wanneer pt niet direct mag zitten, maar in lig zou moeten eten en drinken)' },
          { id: 'veilig', tekst: 'Zo nodig tav veiligheid oraal eten/drinken' },
          { id: 'comm', tekst: 'Communicatie ondersteuning?' }
        ]
      }
    ],
    noten: [
      'De inleidende zin noemt drie disciplines (verpleegkundige, fysiotherapeut, ergotherapeut), terwijl het document er vier beschrijft: logopedie staat er ook in. Zo overgenomen.',
      '"Communicatie ondersteuning?" staat met vraagteken in de bron; dat lijkt daar zelf nog een open punt.',
      'Het eerste punt bij de verpleegkundige is in de bron één doorlopende alinea waarin twee dingen door elkaar staan: dat de voorzieningen vooraf besteld zijn, en de opdracht aan orthopedie om een opmerking in de opname-order te zetten. Niet gesplitst.',
      '"Orthopedie zorg voor een opmerking" is vermoedelijk "zorgt"; "Positioneren en start bewegen in bed ." heeft een spatie voor de punt. Allebei zo gelaten.',
      'Er wordt twee keer verwezen naar "beleid orthopedie". Dat document heb ik niet; die verwijzing staat er dus wel, de inhoud erachter niet.'
    ]
  };

  // Afgeleide tekst voor de arts die de patiënt opneemt op de orthopedie.
  // Niets nieuws: dezelfde antwoorden uit de negen punten, maar alleen die
  // welke tijdens de opname van belang zijn, met de twee regels erboven die
  // zeggen wat orthopedie zelf moet doen.
  var ORTHO = {
    titel: 'VOOR DE OPNEMEND ARTS ORTHOPEDIE',
    inleiding: 'Afspraken uit het preoperatief MDO, voor de opname.',
    kopVast: 'Te regelen door orthopedie:',
    kopBeleid: 'Beleid uit de MDO-checklist:',
    vast: [
      { tekst: 'Paramedici UMCG worden in consult gevraagd door de zaalarts Orthopedie, conform MDO behandelplan brief', bron: 'bijlage 1' },
      { tekst: 'Orthopedie zorg voor een opmerking in de opname-order waarin verwezen wordt naar een mdo-notitie van de revalidatie. In die notitie staat welke voorzieningen nodig zijn. De regieverpleegkundige ziet deze order voor opname en bestelt de voorzieningen bij MHM.', bron: 'bijlage 3' }
    ],
    // Punt 8 valt af: dat is pre-operatief en daarmee vóór de opname geregeld.
    punten: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p9'],
    noten: [
      'De twee regels onder "Te regelen door orthopedie" komen letterlijk uit bijlage 1 en bijlage 3 en gaan over wat orthopedie zelf doet rond de opname.',
      '"Orthopedie zorg voor een opmerking" staat zo in bijlage 3; vermoedelijk "zorgt". Niet gecorrigeerd.',
      'Punt 8 (pre-operatief extra inzet paramedici) staat er met opzet niet in: dat is vóór de opname geregeld. De andere acht punten staan er wel in, voor zover je ze hebt ingevuld.',
      'De zin "Afspraken uit het preoperatief MDO, voor de opname." is van mij, als kop boven de tekst. Al het andere is overgenomen.'
    ]
  };

  // De agenda van het pre-operatieve MDO. Dit is een andere lijst dan de negen
  // punten hierboven: dit is wat je bespreekt, die negen zijn waar je op uitkomt.
  // Inhoudelijk overlappen ze (voorzieningen, voeding, conditie, gips, therapie).
  var BESPREEK = {
    kop: 'MDO pre operatief, bespreekpunten:',
    titel: 'MDO PRE OPERATIEF, BESPREEKPUNTEN',
    groepen: [
      {
        id: 'b1', kop: 'Pre-operatief', soort: 'check',
        opties: [
          { id: 'voorz', tekst: 'Organiseren voorzieningen/checken voorzieningen' },
          { id: 'oefenen', tekst: 'Oefenen gebruik voorzieningen?' },
          { id: 'psy', tekst: 'Psychologische voorbereiding?' },
          { id: 'voeding', tekst: 'Voedingsstatus?' },
          { id: 'conditie', tekst: 'Conditie pre operatief optimaliseren?' },
          { id: 'slikken', tekst: 'Slikken veilig evt. In liggende houding?' },
          { id: 'toilet', tekst: 'Toiletgang' },
          { id: 'school', tekst: 'Schoolgang' }
        ]
      },
      {
        id: 'b2', kop: 'Opname UMCG', soort: 'check',
        opties: [
          { id: 'overdracht', tekst: 'Bij ontslag overdracht naar {naar}', velden: { naar: { leeg: '....' } } },
          { id: 'gips', tekst: 'Gips' },
          { id: 'spalken', tekst: 'Spalken aanmeten' },
          { id: 'rolstoel', tekst: 'Aanpassing rolstoel' }
        ]
      },
      {
        id: 'b3', kop: 'Post operatief', soort: 'check',
        opties: [
          { id: 'therapie', tekst: 'Therapie frequentie, FT, ET, psy, hydrotherapie? Waar?' },
          { id: 'controle', tekst: 'Controle?' }
        ]
      }
    ],
    noten: [
      'Veel punten eindigen in de bron op een vraagteken. Dat zijn vragen om te stellen, geen vaststellingen; de vraagtekens blijven dus staan.',
      '"Slikken veilig evt. In liggende houding?" heeft midden in de zin een hoofdletter I. Zo overgenomen.',
      'Deze lijst overlapt met de negen punten van de MDO-checklist: voorzieningen, voeding, conditie, gips, spalken en therapiefrequentie komen in allebei voor. Dit is de agenda, die negen zijn de uitkomst.'
    ]
  };

  // soort 'radio' = één keuze uit de rij, 'check' = meerdere mogen aan.
  var PUNTEN = [
    {
      id: 'p1', nr: 1, soort: 'check',
      kop: 'Het advies tav de postoperatieve revalidatie behandeling is:',
      kort: 'advies postoperatieve revalidatiebehandeling',
      noot: 'In de bron staan "Paramedische begeleiding eerste lijn", "Fysiotherapie", "Ergotherapie" en "Overig, namelijk:" op hetzelfde niveau. Fysiotherapie en Ergotherapie horen inhoudelijk onder de eerste lijn, maar staan hier zoals ze in de bron staan. Daardoor komt "Fysiotherapie" twee keer voor: één keer onder Therapieën, één keer los.',
      opties: [
        { id: 'klin', tekst: 'Klinische revalidatiebehandeling' },
        {
          id: 'opname', tekst: 'Opname kliniek ({centrum})',
          velden: {
            centrum: {
              soort: 'keuze', opties: ['revalidatie Friesland', 'Roessingh', 'overig'],
              leeg: 'revalidatie Friesland/Roessingh/overig',
              vrijBij: 'overig', vrijLeeg: '....'
            }
          },
          onder: {
            soort: 'radio',
            opties: [
              { id: 'direct', tekst: 'Direct na ziekenhuisopname voor OK' },
              { id: 'na', tekst: '{weken} weken na OK', velden: { weken: { leeg: '…' } } }
            ]
          }
        },
        {
          id: 'beetster',
          tekst: 'Hierbij willen we onze collega’s van revalidatie centrum Beetsterzwaag vragen patiënt en ouders op te roepen voor een kennismaking op hun afdeling',
          noot: 'Deze zin noemt alleen Beetsterzwaag, terwijl de keuze erboven ook Roessingh en overig toelaat. Daarom staat hij als eigen vinkje: aan als hij klopt, uit als je een ander centrum kiest.'
        },
        { id: 'poli', tekst: 'Poliklinische revalidatiebehandeling via {via}', velden: { via: { leeg: '......' } } },
        {
          id: 'ther',
          tekst: 'Therapieën en voorstel frequenties (nader af te stemmen in het MDO met behandelaren (ET/FT/LOGO/Psy)):',
          onder: {
            soort: 'check',
            opties: [
              { id: 'ft', tekst: 'Fysiotherapie', onder: { soort: 'check', opties: [
                { id: 'freq', tekst: 'Frequentie {freq}', velden: { freq: { leeg: '....' } } } ] } },
              { id: 'et', tekst: 'Ergotherapie', onder: { soort: 'check', opties: [
                { id: 'freq', tekst: 'Frequentie {freq}', velden: { freq: { leeg: '....' } } } ] } },
              { id: 'hydro', tekst: 'Hydrotherapie', onder: { soort: 'check', opties: [
                { id: 'freq', tekst: 'Frequentie {freq}', velden: { freq: { leeg: '....' } } } ] } },
              { id: 'psy', tekst: 'Psychologische/pedagogische begeleiding', onder: { soort: 'check', opties: [
                { id: 'freq', tekst: 'Frequentie {freq}', velden: { freq: { leeg: '....' } } } ] } }
            ]
          }
        },
        { id: 'eerste', tekst: 'Paramedische begeleiding eerste lijn' },
        { id: 'ft1', tekst: 'Fysiotherapie' },
        { id: 'et1', tekst: 'Ergotherapie' },
        { id: 'ov1', tekst: 'Overig, namelijk: {wat}', velden: { wat: { leeg: '....' } } }
      ]
    },

    {
      id: 'p2', nr: 2, soort: 'radio',
      kop: 'Post operatief beperkingen in het mobiliseren nodig',
      kort: 'beperkingen in het mobiliseren',
      noot: 'De kop is in de bron geen hele zin (er ontbreekt een werkwoord). Zo overgenomen. In de aanlevering plakten "op geleide van kunnen" en de kop van punt 3 aan elkaar; dat heb ik gesplitst.',
      opties: [
        {
          id: 'ja', tekst: 'Ja',
          onder: {
            soort: 'check',
            opties: [
              { id: 'onbelast', tekst: 'Onbelast mobiliseren gedurende {weken} weken', velden: { weken: { leeg: '....' } } },
              {
                id: 'rom',
                tekst: 'Beperkingen tav maximale bewegingsuitslagen (bijv. Beperkingen maximale flexie/abductie heup postoperatief)',
                onder: {
                  soort: 'check',
                  opties: [
                    { id: 'welke', tekst: 'Welke specificeren {welke}', velden: { welke: { leeg: '.....' } } },
                    { id: 'duur', tekst: 'Gedurende {weken} weken', velden: { weken: { leeg: 'xx' } } }
                  ]
                }
              },
              {
                id: 'partieel',
                tekst: 'Partieel belast mobiliseren, namelijk {procent} procent van het lichaams gewicht gedurende {weken} weken',
                velden: { procent: { leeg: '..' }, weken: { leeg: '..' } }
              }
            ]
          }
        },
        { id: 'nee', tekst: 'Nee, patient mag mobiliseren op geleide van kunnen' }
      ]
    },

    {
      id: 'p3', nr: 3, soort: 'check',
      kop: 'Adviezen post operatief tav houding en rekken',
      kort: 'adviezen houding en rekken',
      noot: 'In de bron staat elke "Duur ..... min ...... x per dag" op hetzelfde niveau als de houding erboven. Hier hangt de duur onder de houding waar hij bij hoort. "Buiklig opbouwen tot" houdt in de bron op na "tot"; zo overgenomen.',
      opties: [
        { id: 'buiklig', tekst: 'Buiklig opbouwen tot', onder: duurGroep() },
        { id: 'spreiding', tekst: 'Heup spreiding', onder: duurGroep() },
        { id: 'statafel', tekst: 'Staan in statafel in milde abductie', onder: duurGroep() },
        { id: 'langzit', tekst: 'Langzit', onder: duurGroep() },
        { id: 'ov3', tekst: 'Overig {wat}', velden: { wat: { leeg: '.....' } } }
      ]
    },

    {
      id: 'p4', nr: 4, soort: 'radio',
      kop: 'Verwachting dat post-operatieve adviezen tav houding/mobiliseren haalbaar zijn voor patient (bijv. Buiklig mogelijk indien geadviseerd).',
      kort: 'zijn de adviezen haalbaar',
      opties: [
        { id: 'ja', tekst: 'Ja' },
        { id: 'aanpassing', tekst: 'Ja met aanpassing namelijk {wat}', velden: { wat: { leeg: '....' } } },
        { id: 'nee', tekst: 'Nee' }
      ]
    },

    {
      id: 'p5', nr: 5, soort: 'radio',
      kop: 'Postoperatief gips',
      kort: 'postoperatief gips',
      noot: 'In de bron staan "Type gips", "Aantal weken" en "Tijdens gipswissel orthesen aanmeten" op hetzelfde niveau als Ja en Nee. Hier hangen ze onder Ja, waar ze bij horen.',
      opties: [
        {
          id: 'ja', tekst: 'Ja',
          onder: {
            soort: 'check',
            opties: [
              { id: 'type', tekst: 'Type gips: {type}', velden: { type: { leeg: '....' } } },
              { id: 'weken', tekst: 'Aantal weken: {weken}', velden: { weken: { leeg: '....' } } },
              { id: 'wissel', tekst: 'Tijdens gipswissel orthesen aanmeten (zie 6)' }
            ]
          }
        },
        { id: 'nee', tekst: 'Nee' }
      ]
    },

    {
      id: 'p6', nr: 6, soort: 'radio',
      kop: 'Ortheses aanmeten',
      kort: 'ortheses aanmeten',
      noot: 'Ook hier stonden type en draagadvies in de bron op hetzelfde niveau als Ja en Nee; hier hangen ze onder Ja.',
      opties: [
        {
          id: 'ja', tekst: 'Ja',
          onder: {
            soort: 'check',
            opties: [
              { id: 'type', tekst: 'Type orthese {type}', velden: { type: { leeg: '....' } } },
              { id: 'dag', tekst: 'Dag orthese {dag}', velden: { dag: { leeg: '......' } },
                onder: { soort: 'check', opties: [
                  { id: 'advies', tekst: 'Draagadvies: {advies}', velden: { advies: { leeg: '.......' } } } ] } },
              { id: 'nacht', tekst: 'Nacht orthese {nacht}', velden: { nacht: { leeg: '......' } },
                onder: { soort: 'check', opties: [
                  { id: 'advies', tekst: 'Draagadvies: {advies}', velden: { advies: { leeg: '.......' } } } ] } }
            ]
          }
        },
        { id: 'oud', tekst: 'Nee, oude orthesen (concept {concept}) weer gebruiken.', velden: { concept: { leeg: '.....' } } },
        { id: 'nvt', tekst: 'Niet van toepassing' }
      ]
    },

    {
      id: 'p7', nr: 7, soort: 'check',
      kop: 'Vereiste voorzieningen',
      kort: 'vereiste voorzieningen',
      uitklap: true,
      noot: 'In de bron staat hierbij "(uitklapbare lijst waarin aangevinkt kan worden): +duur". Daarom is dit een uitklaplijst en heeft elke voorziening een duur.',
      opties: [
        { id: 'spreid', tekst: 'Spreidvoorziening: {duur}', velden: { duur: { leeg: '....' } } },
        { id: 'sta', tekst: 'Stavoorziening in abductie: {duur}', velden: { duur: { leeg: '....' } } },
        { id: 'loop', tekst: 'Loophulp: {duur}', velden: { duur: { leeg: '....' } } },
        { id: 'lig', tekst: 'Ligvoorziening: {duur}', velden: { duur: { leeg: '....' } } },
        { id: 'tillift', tekst: 'Tillift {duur}', velden: { duur: { leeg: '....' } } },
        { id: 'zit', tekst: 'Zitorthese aanpassing {duur}', velden: { duur: { leeg: '....' } } },
        { id: 'ov7', tekst: 'Overig {wat}', velden: { wat: { leeg: '......' } } }
      ]
    },

    {
      id: 'p8', nr: 8, soort: 'radio',
      kop: 'Pre-operatief extra inzet paramedici nodig (nader af te stemmen in het MDO met behandelaren (ET/FT/LOGO/Psy)',
      kort: 'pre-operatief extra inzet paramedici',
      noot: 'Het haakje achter "(ET/FT/LOGO/Psy)" gaat in de bron niet meer dicht. Zo overgenomen. De rij (ET/FT/LOGO/Psy) noemt Dietetiek niet, terwijl die er als keuze wel bij staat.',
      opties: [
        {
          id: 'ja', tekst: 'Ja',
          onder: {
            soort: 'check',
            opties: [
              { id: 'psy', tekst: 'Psychologische/pedagogische begeleiding ter voorbereiding op operatieve behandeling' },
              { id: 'logo', tekst: 'Logopedie voor beoordeling slikfunctie' },
              { id: 'conditie', tekst: 'Fysiotherapie ter bevordering van de conditie' },
              { id: 'hulpmiddel', tekst: 'Fysiotherapie voor uitproberen/introduceren nieuwe hulpmiddelen/voorzieningen' },
              { id: 'dieet', tekst: 'Dietetiek gericht op het optimaliseren van de voedingsstatus' },
              { id: 'ergo', tekst: 'Ergotherapie ter beoordeling/optimalisering van voorziening' }
            ]
          }
        },
        { id: 'nee', tekst: 'Nee' }
      ]
    },

    {
      id: 'p9', nr: 9, soort: 'radio',
      kop: 'Gedurende de opname in het UMCG lijkt extra Inzet psychologische/ pedagogische begeleiding vooraf en rondom de operatie',
      kort: 'extra psychologische/pedagogische begeleiding tijdens de opname',
      noot: 'De kop is in de bron geen hele zin: na "rondom de operatie" ontbreekt een woord als "nodig" of "wenselijk". Zo overgenomen — vul het aan en ik zet het erin.',
      opties: [
        {
          id: 'ja', tekst: 'Ja',
          onder: { soort: 'check', opties: [
            { id: 'via', tekst: 'Organiseren via {via}', velden: { via: { leeg: '....' } } } ] }
        },
        { id: 'nee', tekst: 'Nee' }
      ]
    }
  ];

  // Punt 3 gebruikt vier keer dezelfde duurregel. Eén functie, zodat de tekst
  // er maar één keer staat.
  function duurGroep() {
    return {
      soort: 'check',
      opties: [
        {
          id: 'duur', tekst: 'Duur {min} min {x} x per dag',
          velden: { min: { leeg: '.....' }, x: { leeg: '......' } }
        }
      ]
    };
  }

  global.MDO = {
    bron: 'Bron: eigen checklist van de gebruiker — de definitieve MDO-checklist en de spreekkamerversie, letterlijk overgenomen uit de aangeleverde tekst (27-10-2026).',
    titel: 'MDO-CHECKLIST',
    aanhef: 'Richtlijnen ten aanzien van de nabehandeling werden besproken:',
    spreekkamer: SPREEKKAMER,
    bespreek: BESPREEK,
    taken: TAKEN,
    ortho: ORTHO,
    punten: PUNTEN
  };
})(typeof window !== 'undefined' ? window : this);
