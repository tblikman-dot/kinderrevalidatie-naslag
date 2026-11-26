// De indeling van het naslagwerk: de aandachtsgebieden en, per gebied, de
// knoppen naar de eigen pagina's. Dit is de ENIGE plek waar een hulpmiddel
// staat; het startscherm (app.js) en het zoekpalet op elke pagina (kern.js)
// lezen allebei hieruit. Een knop met een 'kort' is een hulpmiddel en komt in
// het overzicht en in het palet; zonder 'kort' is het alleen een knop bij dat
// ene onderwerp.
//
// Alleen gegevens, geen gedrag: dit bestand mag op elke pagina geladen worden.

// ===== STANDAARDINDELING (aanpasbaar/uitbreidbaar) =====
// Dit zijn alleen categorienamen/onderwerpen, geen medische inhoud.
const DEFAULT_CATS = [
  { id: 'cp', label: 'Cerebrale parese & spasticiteit', scope: 'Classificatie (GMFCS/MACS), spasticiteitsmanagement, hulpmiddelen',
    directLinks: [
      { label: '🧒 GMFCS per leeftijdsband', url: 'gmfcs.html', kort: 'GMFCS per leeftijd', icoon: '🧒', groep: 'cp' },
      { label: '📋 Controles bij CP — jaarlijkse metingen naar leeftijd (UMCG)', url: 'cp-controles.html', kort: 'Controles bij CP', icoon: '📋', groep: 'cp',
        zoek: 'controle controles onderzoek jaarlijks per jaar tweemaal GMFM SLO handfunctie handfunctietest leeftijd 6 jaar 18 jaar cerebrale parese CP UMCG richtlijn verplicht schema' },
      { label: '📘 FMS-richtlijn: Cerebrale parese bij kinderen', url: 'https://richtlijnendatabase.nl/richtlijn/spastische_cerebrale_parese_bij_kinderen' },
    ] },
  { id: 'heup', label: 'Heupscreening bij CP', scope: 'Preventie heupluxatie — migratiepercentage, GMFCS-gebaseerd schema',
    directLinks: [
      { label: '🌳 Beslisboom: heup beoordelen', url: 'beslisboom-heup.html', kort: 'Beslisboom heup', icoon: '🌳', groep: 'heup' },
      { label: '🧒 GMFCS per leeftijdsband', url: 'gmfcs.html' },
      { label: '👶 Heupdysplasie (DDH) — niet hetzelfde', url: 'heupdysplasie.html' },
      { label: '📱 HipScreen openen (MP meten)', url: 'HIPSCREEN' },
      { label: '⚙️ HipScreen opent niet? Instellen', url: 'hipscreen.html', kort: 'HipScreen instellen', icoon: '⚙️', groep: 'heup' },
      { label: '📎 Screeningsschema heupluxatie (FMS-bijlage)', url: 'https://richtlijnendatabase.nl/gerelateerde_documenten/bijlage/17205/1/92/Screeningsschema%20heupluxatie.html' },
      { label: '📘 FMS-richtlijn: Cerebrale parese bij kinderen', url: 'https://richtlijnendatabase.nl/richtlijn/spastische_cerebrale_parese_bij_kinderen' },
    ] },
  { id: 'botox', label: 'Botulinetoxine-injecties', scope: 'Indicatie, doelspieren, doseringsplanner en de dosistabellen',
    zoekwoorden: 'dosering doseerregels dosisschema eenheden units budget voorraad flacon plafond maximum per kilogram lichaamsgewicht spiergrootte aantal spieren ernst spierzwakte respons eerdere behandeling bijwerkingen voorgeschiedenis prioriteit verdelen ondergrens laagste dosis afronden verdunning POBOT dosing rules pectoralis minor protractie scapula pleura pneumothorax echogeleid dosering eenheden preparaat abobotulinumtoxine onabotulinumtoxine incobotulinumtoxine latissimus dorsi pectoralis major teres major subscapularis hefboomarm momentsarm meerdere injectieplaatsen depot verspreiding eindplaatzone doelspieren spierkeuze Hefter armpatronen pROM passieve functie krachtmoment torque echogeniciteit vitaal pronator biceps pectoralis subscapularis polsflexoren lidocaine bupivacaine proefblokkade diagnostische blokkade extrafusaal intrafusaal spierspoel gamma motorneuron rekreflex differentiele blokkade kracht-lengtecurve slack-lengte positieve negatieve symptomen spastische parese clonus hyperreflexie hypertonie co-contractie associated reaction withdrawal response spierzwakte selectiviteit vermoeibaarheid spierstijfheid contractuur spasticiteit dystonie spastische dystonie choreoathetose ataxie piramidaal extrapiramidaal basale kernen corticospinaal Lance Pandyan Monbaliu respons botulinetoxine indicatie snelheidsafhankelijk hyperreflexie contraindicatie contra-indicatie interactie humaan albumine lithium aminoglycoside spectinomycine tetanusvaccinatie antilichaamvorming drie maanden interval algehele anesthesie narcose bijwerkingen lokale pijn griepachtige verschijnselen Boyd maximale dosering per kilogram 25 U/kg 30 U/kg 700 U 200 U 1000 U 1500 U Russman Awaad Molenaers Desloovere Scholtes Wissel Pollack werkgroep fabrikant kinderdosering plafond multi-level diplegie tetraplegie FMS Federatie Medisch Specialisten Richtlijnendatabase spastische cerebrale parese bij kinderen module overweging RCP Royal College of Physicians Spasticity in adults national guidelines 2018 appendix 2 injection sites BOTOX Dysport Xeomin onabotulinumtoxinA abobotulinumtoxinA incobotulinumtoxinA units eenheden dosis per spier injectieplaats injection point aantal injectieplaatsen multiple injection sites psoas iliacus quadratus lumborum gluteus rectus femoris vastus pectineus adductor magnus longus brevis gracilis semimembranosus semitendinosus biceps femoris popliteus tibialis anterior posterior extensor digitorum longus hallucis peroneus longus brevis tertius gastrocnemius soleus flexor hallucis abductor hallucis trapezius rhomboid supraspinatus infraspinatus subscapularis deltoid teres major minor latissimus dorsi serratus anterior pectoralis major minor biceps triceps brachii coracobrachialis brachialis brachioradialis supinator extensor carpi radialis ulnaris digiti minimi pollicis longus brevis indicis pronator teres quadratus flexor carpi radialis ulnaris digitorum superficialis profundus volwassenen emla emla-creme verdovende creme verdoving prikken pijn lidocaine prilocaine smeerinstructie insmeren smeren zalf pleister folie huishoudfolie 60 minuten briefje voor thuis ouders meegeven uitleg patient printen regio bovenbeen onderbeen kuit voet adductoren hamstrings quadriceps rectus femoris triceps surae abductor hallucis plantair echo echogeleid echografie ultrageluid landmarks herkenningspunten psoas iliacus pees psoaspees heupgewricht rectus femoris RF vaatzenuwbundel V-A-N probe transducer Siemens 9L4 MSK diepte beeldherkenning echogeleid prikken naaldpositie',
    directLinks: [
      { label: '1️⃣ Spastische parese — is er een indicatie?', url: 'spasticiteit-dystonie.html', kort: 'Spastisch of dystoon?', icoon: '🧠', groep: 'cp' },
      { label: '2️⃣ Doelspieren kiezen — per gewricht, vijf armpatronen', url: 'doelspieren.html', kort: 'Doelspieren kiezen', icoon: '🎯', groep: 'cp' },
      { label: '3️⃣ Doseringsplanner — dosis, plafonds en beschikbare eenheden', url: 'dosering.html', kort: 'Doseringsplanner botox', icoon: '💉', groep: 'cp' },
      { label: '4️⃣ Dosis per spier — BOTOX, Dysport en Xeomin naast elkaar (RCP, volwassenen)', url: 'rcp-spieren.html', kort: 'Dosis per spier (RCP)', icoon: '📊', groep: 'cp' },
      { label: '🧴 Emla-smeerinstructie — briefje voor thuis (losse app)', url: 'https://tblikman-dot.github.io/emla-smeerinstructie/',
        kort: 'Emla-smeerinstructie', icoon: '🧴', groep: 'cp',
        zoek: 'emla creme verdoving prikken smeerinstructie insmeren folie briefje voor thuis ouders printen' },
      { label: '🩺 Echo landmarks — herkenningspunten op het echobeeld', url: 'echo-landmarks.html', kort: 'Echo landmarks', icoon: '🩺', groep: 'cp',
        zoek: 'echo echogeleid echografie psoas iliacus pees heupgewricht rectus femoris vaatzenuwbundel probe transducer landmark herkenningspunt semitendinosus hamstrings semimembranosus adductor magnus biceps femoris nervus ischiadicus tuber ischiadicum epicondyl 30% 70%' },
      { label: '📘 FMS-richtlijn: Cerebrale parese bij kinderen', url: 'https://richtlijnendatabase.nl/richtlijn/spastische_cerebrale_parese_bij_kinderen' },
    ] },
  { id: 'sedatie', label: 'Sedatie bij botulinetoxine-injecties', scope: 'Contra-indicaties / afweging sedatie vs. algehele narcose' },
  { id: 'nma', label: 'Neuromusculaire aandoeningen', scope: 'O.a. SMA, spierdystrofieën' },
  { id: 'sb', label: 'Spina bifida / neurale buisdefecten', scope: 'MMC, spina bifida occulta, tethered cord',
    zoekwoorden: 'spina bifida myelomeningocele MMC SBO occulta tethered cord retethering filum terminale conus medullaris lipoom syringomyelie hydromyelie neurale buisdefect uitvalsniveau blaasfunctie kyfoscoliose neurogene blaas detrusor onderactief overactief NDO detrusoroveractiviteit areflex slappe blaas outletweerstand sfincter DSD detrusor-sfincter-dyssynergie compliance opslagdruk ledigingsdruk residu capaciteit incontinentie CIC clean intermittent catheterisation zelfkatheterisatie antimuscarinica botulinetoxine detrusor sfincter UUT hogere urinewegen hydronefrose VUR vesico-ureterale reflux nierfunctie urineweginfectie blaasstenen onveilige blaas urodynamica',
    directLinks: [
      { label: '🔗 Tethered cord syndroom', url: 'tetheredcord.html', kort: 'Tethered cord', icoon: '🔗', groep: 'zenuw' },
      { label: '🦵 Spieruitvalsniveaus', url: 'myotomen.html' },
      { label: '💧 Neurogene blaas — de vier combinaties', url: 'neurogene-blaas.html', kort: 'Neurogene blaas', icoon: '💧', groep: 'zenuw' },
    ] },
  { id: 'uitval', label: 'Uitvalsniveau & spierinnervatie', scope: 'Myotomen, perifere zenuwen van de arm en herstel na zenuwletsel',
    zoekwoorden: 'medianus ulnaris radialis myotoom carpale tunnel Guyon PIN interosseus regeneratie zenuwherstel',
    directLinks: [
      { label: '🦵 Plaat: welk niveau, welke spieren', url: 'myotomen.html', kort: 'Spieruitvalsniveaus', icoon: '🦵', groep: 'zenuw' },
      { label: '🖐️ Perifere zenuwen van de arm — verloop & uitval', url: 'zenuwen.html', kort: 'Zenuwen van de arm', icoon: '🖐️', groep: 'zenuw' },
      { label: '⏱️ Herstel na zenuwletsel — rekenhulp', url: 'zenuwherstel.html', kort: 'Herstel na zenuwletsel', icoon: '⏱️', groep: 'zenuw' },
    ] },
  { id: 'ontw', label: 'Ontwikkelingsstoornissen', scope: 'O.a. DCD, motorische ontwikkeling' },
  { id: 'amp', label: 'Aangeboren afwijkingen, amputatie & prothesiologie', scope: '' },
  { id: 'nah', label: 'Niet-aangeboren hersenletsel (NAH)', scope: '' },
  { id: 'voeding', label: 'Voeding & slikproblemen', scope: 'Dysfagie' },
  { id: 'comm', label: 'Communicatie & AAC', scope: 'Ondersteunde communicatie' },
  { id: 'hulp', label: 'Hulpmiddelen & voorzieningen', scope: 'Rolstoelen, orthesen, WMO' },
  { id: 'pijn', label: 'Pijn bij kinderen', scope: '' },
  { id: 'ortho', label: 'Orthopedische aspecten', scope: 'Heupdysplasie, beenlengteverschil, wervelkolom',
    zoekwoorden: 'heupecho echografie Graf typering alfahoek betahoek benige pandakrand kraakbenige pandakrand labrum Y-voeg os ilium basislijn coronale coupe meetpunten Robben Dremmen mature hip immature delay in development decentrering eccentric hip labruminterpositie standaardverslag WKO werkgroep kinderorthopedie stroomschema DDH Graf classificatie Pavlik spreidvoorziening gesloten repositie open repositie gipsbroek spica adductorentenotomie bekkenosteotomie restdysplasie reluxatie AC-hoek acetabulaire index acetabular index grenswaarden standaarddeviatie lichte dysplasie ernstige dysplasie links rechts zijde Brunken Tonnis Hilgenreiner Perkin Shenton migratiepercentage Reimers CE-hoek Wiberg heupfoto X-bekken kwadrant heuplateralisatie beenlengteverschil LLD epifysiodese schoenverhoging callusdistractie hemihypertrofie overgroei Galeazzi groeisturing multiplier Paley White-Menelaus aangeboren congenitaal ontwikkelingsverschil verworven groeiremming growth inhibition twee metingen eerdere verlenging lengthening vaste verhouding skeletleeftijd botleeftijd langebeenopname proximale tibia distale femur ingreepvenster operatiedatum heupdysplasie DDH Pavlik stuitligging abductiebeperking coxartrose',
    directLinks: [
      { label: '📏 Beenlengteverschil — verwijzen & beleid', url: 'beenlengte.html', kort: 'Beenlengteverschil', icoon: '📏', groep: 'been' },
      { label: '📐 Groeisturing — hoe groot wordt het?', url: 'groeisturing.html', kort: 'Groeisturing', icoon: '📐', groep: 'been' },
      { label: '🗓️ Epifysiodese-planner — welke fyse, tot wanneer?', url: 'epifysiodese.html', kort: 'Epifysiodese-planner', icoon: '🗓️', groep: 'been' },
      { label: '👶 Heupdysplasie (DDH) — screenen & verwijzen', url: 'heupdysplasie.html', kort: 'Heupdysplasie (DDH)', icoon: '👶', groep: 'heup' },
      { label: '🩻 Heupfoto beoordelen — AC-hoek, lijnen, MP', url: 'heupfoto.html', kort: 'Heupfoto beoordelen', icoon: '🩻', groep: 'heup' },
      { label: '🔊 Heupecho volgens Graf — α/β naar type', url: 'heupecho.html', kort: 'Heupecho volgens Graf', icoon: '🔊', groep: 'heup' },
      { label: '🧭 Stroomschema DDH — NOV-richtlijn stap voor stap', url: 'ddh-stroomschema.html', kort: 'Stroomschema DDH', icoon: '🧭', groep: 'heup' },
    ] },
  { id: 'rotatie', label: 'Rotatie- en standsafwijkingen', scope: 'Intoeing, femorale anteversie, tibiatorsie',
    zoekwoorden: 'rotatieafwijking standsafwijking intoeing naar binnen lopen tenengang femorale anteversie anteversie femurhals endorotatie exorotatie heuprotatie buikligging rotatieprofiel dij-voethoek thigh foot angle tibiatorsie interne tibiatorsie metatarsus adductus voorvoetadductie voetlijn voetlijnmethode heel bisector hielbissectrice Bleck Berg skewfoot serpentine foot serieel gipsen corrigeerbaar mediale huidplooi cuneiforme packaging disorder W-zit W-houding trochanter prominentiehoek anteversiecurve leeftijdscurve gemiddelde anteversie per leeftijd meisjes jongens 8 jaar derotatie osteotomie intertrochantair lever-arm dysfunction hefboomdisfunctie genu varum genu valgum Blount torticollis DDH',
    directLinks: [
      { label: '\u{1F9B5} Rotatieprofiel & intoeing \u2014 welke van de drie?', url: 'rotatie.html', kort: 'Rotatieprofiel & intoeing', icoon: '\u{1F9B5}', groep: 'been' },
      { label: '\u{1F9B6} Metatarsus adductus \u2014 voetlijn & beleid', url: 'metatarsus.html', kort: 'Metatarsus adductus', icoon: '\u{1F9B6}', groep: 'been' },
    ] },
  { id: 'armhand', label: 'Arm & hand', scope: 'Bovenste extremiteit — functie, spalken, chirurgie, MACS',
    zoekwoorden: 'Hefter armpatronen spastische arm houding endorotatie pronatie supinatie polsflexie doelspieren',
    directLinks: [
      { label: '💪 Vijf armpatronen bij spasticiteit — en welke spieren erbij horen', url: 'doelspieren.html' },
    ] },
  { id: 'ortho-ok', label: 'Orthopedische operaties bij kinderen', scope: 'Ingrepen, timing, SEMLS — techniek en beeldmateriaal',
    directLinks: [
      { label: '📘 FMS-richtlijn: Cerebrale parese bij kinderen', url: 'https://richtlijnendatabase.nl/richtlijn/spastische_cerebrale_parese_bij_kinderen' },
    ] },
  { id: 'periop', label: 'Rondom een operatie of ingreep', scope: 'Perioperatieve regelzaken, postoperatieve zorg, checklist',
    zoekwoorden: 'mdo-notitie mdo notitie epic dossier beleid nabehandeling bespreekpunten agenda klinische revalidatiebehandeling poliklinisch eerste lijn paramedische begeleiding fysiotherapie ergotherapie hydrotherapie frequentie onbelast partieel belast mobiliseren bewegingsuitslagen buiklig heupspreiding statafel langzit gips spalken orthese draagadvies voorzieningen spreidvoorziening stavoorziening loophulp ligvoorziening tillift rolstoel zitorthese dietetiek voedingsstatus conditie slikken slikfunctie logopedie psychologische pedagogische begeleiding toiletgang schoolgang overdracht spreekkamer WGBO CP register akkoord behandelvoorstel complicaties alternatieven consent perioperatief postoperatief preoperatief operatie ingreep opname ontslag checklist regelen voorbereiden',
    directLinks: [
      { label: '🧭 KRO-spreekuur — wat moet ik nu regelen?', url: 'kro.html', kort: 'KRO: wat regelen?', icoon: '🧭', groep: 'ok',
        zoek: 'kro kinderrevalidatie orthopedie spreekuur stroomschema tijdlijn bijlage 1 route verwijzing klinimetrie observatielijst CP register gangbeeldanalyse Beatrixoord Treant Vogellanden Revalidatie Friesland secretariaat medische staf behandelplan brief multi-level GAS GMFM Pedi CAT Pedi NL CP Child 6 minuten looptest functionele kracht planning termijn 8-12 weken 6 maanden' },
      { label: '📋 MDO-notitie voor Epic — aankruisen en plakken', url: 'mdo-notitie.html', kort: 'MDO-notitie voor Epic', icoon: '📋', groep: 'ok',
        zoek: 'mdo notitie epic dossier beleid nabehandeling spreekkamer WGBO akkoord gips orthese voorziening mobiliseren onbelast partieel buiklig statafel langzit hydrotherapie dietetiek slikfunctie klinische poliklinische revalidatiebehandeling eerste lijn CP register' },
    ] },
  { id: 'transitie', label: 'Transitie naar volwassenenzorg', scope: '' },
  { id: 'mdo', label: 'Multidisciplinaire samenwerking', scope: 'ICF-model, MDO rondom een operatie',
    zoekwoorden: 'mdo multidisciplinair overleg notitie epic dossier nabehandeling spreekkamer behandelaren ET FT logopedie psychologie regio kro kinderrevalidatie orthopedie spreekuur stroomschema klinimetrie',
    directLinks: [
      { label: '🧭 KRO-spreekuur — wat moet ik nu regelen?', url: 'kro.html' },
      { label: '📋 MDO-notitie voor Epic — aankruisen en plakken', url: 'mdo-notitie.html' },
    ] },
  { id: 'opleiden', label: 'Opleiden & feedback', scope: 'Begeleiden van aios en co-assistenten: coaching, feedback, opleidingsklimaat',
    zoekwoorden: 'opleiden opleider supervisie supervisor aios co-assistent coassistent student feedback coaching coachen in the moment over time KPB korte praktijkbeoordeling beoordelen begeleiden leerstand examenstand tip top spiegelpoli kijkopdracht learning conversation vaste volgorde opleidingsklimaat leerklimaat psychologische veiligheid veilig not judged bevlogenheid burn-out SPEED D-RECT instrueren ondersteunen delegeren situationeel leidinggeven remediering niet pluis zorgen COC Leerhuis TOTR feed forward rolmodel',
    directLinks: [
      { label: '🎓 Feedback en coaching — beslisboom en checklist', url: 'feedback.html', kort: 'Feedback en coaching', icoon: '🎓', groep: 'opleiden' },
    ] },
  { id: 'appzelf', label: 'De app zelf onderhouden', scope: "Claude Code-commando's en werkafspraken",
    zoekwoorden: 'claude code commando slash command init plan clear compact rewind diff resume model help CLAUDE.md projectcontext sessie geheugen samenvatten terugdraaien wijzigingen tonen hervatten model wisselen service worker cache versie ophogen sw.js app.js zoekwoorden tests alles.sh github repo commit push ontwikkelen onderhoud werkafspraken bron vermelden geen patientgegevens',
    directLinks: [
      { label: '\u2328\uFE0F Commando\u2019s die ik het meest gebruik', url: 'claude-code.html', kort: 'Claude Code-commando\u2019s', icoon: '\u2328\uFE0F', groep: 'app' },
    ] },
];

// De groepen waarin de hulpmiddelen getoond worden, in deze volgorde.
const HM_GROEPEN = [
  { id: 'cp',    naam: 'Cerebrale parese & botox' },
  { id: 'heup',  naam: 'Heup' },
  { id: 'been',  naam: 'Benen & stand' },
  { id: 'zenuw', naam: 'Zenuw & niveau' },
  { id: 'ok',    naam: 'Rondom een operatie' },
  { id: 'opleiden', naam: 'Opleiden' },
  { id: 'app',   naam: 'De app zelf' },
];
