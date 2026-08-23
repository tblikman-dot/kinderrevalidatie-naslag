// ===== STANDAARDINDELING (aanpasbaar/uitbreidbaar) =====
// Dit zijn alleen categorienamen/onderwerpen, geen medische inhoud.
const DEFAULT_CATS = [
  { id: 'cp', label: 'Cerebrale parese & spasticiteit', scope: 'Classificatie (GMFCS/MACS), spasticiteitsmanagement, hulpmiddelen',
    directLinks: [
      { label: '📘 FMS-richtlijn: Cerebrale parese bij kinderen', url: 'https://richtlijnendatabase.nl/richtlijn/spastische_cerebrale_parese_bij_kinderen' },
    ] },
  { id: 'heup', label: 'Heupscreening bij CP', scope: 'Preventie heupluxatie — migratiepercentage, GMFCS-gebaseerd schema',
    directLinks: [
      { label: '📎 Screeningsschema heupluxatie (FMS-bijlage)', url: 'https://richtlijnendatabase.nl/gerelateerde_documenten/bijlage/17205/1/92/Screeningsschema%20heupluxatie.html' },
      { label: '📘 FMS-richtlijn: Cerebrale parese bij kinderen', url: 'https://richtlijnendatabase.nl/richtlijn/spastische_cerebrale_parese_bij_kinderen' },
    ] },
  { id: 'botox', label: 'Botulinetoxine-injecties', scope: 'Techniek, spierlokalisatie, onderwijsvideo\'s' },
  { id: 'sedatie', label: 'Sedatie bij botulinetoxine-injecties', scope: 'Contra-indicaties / afweging sedatie vs. algehele narcose' },
  { id: 'nma', label: 'Neuromusculaire aandoeningen', scope: 'O.a. SMA, spierdystrofieën' },
  { id: 'sb', label: 'Spina bifida / neurale buisdefecten', scope: '' },
  { id: 'uitval', label: 'Uitvalsniveau & spierinnervatie', scope: 'Motorische niveaus (myotomen) — spina bifida, dwarslaesie' },
  { id: 'ontw', label: 'Ontwikkelingsstoornissen', scope: 'O.a. DCD, motorische ontwikkeling' },
  { id: 'amp', label: 'Aangeboren afwijkingen, amputatie & prothesiologie', scope: '' },
  { id: 'nah', label: 'Niet-aangeboren hersenletsel (NAH)', scope: '' },
  { id: 'voeding', label: 'Voeding & slikproblemen', scope: 'Dysfagie' },
  { id: 'comm', label: 'Communicatie & AAC', scope: 'Ondersteunde communicatie' },
  { id: 'hulp', label: 'Hulpmiddelen & voorzieningen', scope: 'Rolstoelen, orthesen, WMO' },
  { id: 'pijn', label: 'Pijn bij kinderen', scope: '' },
  { id: 'ortho', label: 'Orthopedische aspecten', scope: 'Heupen, wervelkolom' },
  { id: 'transitie', label: 'Transitie naar volwassenenzorg', scope: '' },
  { id: 'mdo', label: 'Multidisciplinaire samenwerking', scope: 'ICF-model' },
];

// ===== STARTNOTITIES =====
// Overgetypt uit eigen boek (Gage — Identification and Treatment of Gait
// Problems in Cerebral Palsy). Boek is leidend; passages die op de foto's
// onleesbaar waren (vinger/hoek) zijn weggelaten i.p.v. gegokt, i.p.v.
// aangevuld met giswerk.
const DEFAULT_NOTES = {
  cp:
`BRON: Gage — Identification and Treatment of Gait Problems in Cerebral Palsy (eigen exemplaar, overgetypt uit foto's)

== Heuprotatie-mechanica (Fig. 11.3) ==
Rotatie-moment-armen van de gluteus medius (anterieur vs. posterieur compartiment) nemen dramatisch toe bij toenemende heupflexie. Dit suggereert dat endorotatie-gangpatroon het gevolg kan zijn van excessieve heupflexie, die de moment-armen van de gluteale spieren richting endorotatie verschuift.
Bij een CP-patiënt (beeldgebaseerd model) was de endorotatie-moment-arm van het anterieure compartiment van de gluteus medius tijdens het lopen ~4x groter dan die van de mediale hamstrings of adductoren.
Grafiek A: moment-arm (cm) vs. heupflexiehoek (0–90°) — GMED anterior loopt van ~0 naar ~4,5 cm; GMED posterior van ~-4 naar ~2 cm.
Grafiek B: moment-arm vs. % gangcyclus — GMED anterior: start ~3,5, dip naar ~1,7 rond 60%, terug naar ~3,7 bij 100%.

== Tonusdifferentiatie: spasticiteit vs. dystonie vs. hyperkinetisch/choreoathetotisch ==
- Hyperkinetisch/choreoathetotisch: massale onwillekeurige bewegingen met motor overflow — initiëren van beweging in één extremiteit leidt tot bewegingen elders. Posturing van vingers/ledematen, vooral bij pogingen tot vrijwillige activiteit.
- Dystonie: abnormale, aanhoudende, stereotiepe verschuivingen van de algemene spiertonus/houding. Kan lijken op spasticiteit (passieve ROM ook moeilijk/beperkt), maar:
  · Onderzoek in ruglig verandert de tonus bij spasticiteit doorgaans niet, maar onthult vaak lage tonus bij dystonie.
  · Dystone rigiditeit voelt "plastic"/"cogwheel" aan bij passieve beweging; spasticiteit voelt aan als "clasped knife".
  · Dystone tonus "schudt los" — bij schudden van het ledemaat normaliseert de tonus tijdelijk. Geldt niet voor spasticiteit.
  · Spasticiteit geeft toename van de peesreflexen (DTR); dystonie niet.

== Kniestrekkracht (extensor lag) ==
Beoordeling het makkelijkst in ruglig met benen over de tafelrand. Vraag het kind de knie volledig te strekken zonder manuele weerstand; meet de hoek van het ontbrekende bereik. Kinderen met crouch-gait kunnen de knie mogelijk niet volledig actief strekken aan het einde van de ROM, maar wel goede isolatie/kracht hebben in de rest van het bereik.
Extensor lag-meting: met de heupen in extensie, om de invloed van hamstring-tightness/-shift uit te sluiten.

== Contractuurtesten (biarticulair vs. monoarticulair) ==
- Silfverskiöld-test: gastrocsoleus-complex (triceps surae)
- Duncan-Ely-test: monoarticulaire vasti vs. rectus femoris
- Phelps-test: biarticulaire gracilis vs. overige (monoarticulaire) heupadductoren — patiënt in buiklig, knie geflecteerd, heup geabduceerd; als de ipsilaterale heup adduceert bij knie-extensie → gracilis-tightness bevestigd.
Let op: dynamische contractuur kan onder algehele anesthesie verdwijnen — ROM-onderzoek moet vóór de operatie onder anesthesie herhaald worden.

== Enkel/voet bij spastische diplegie/quadriplegie (Rose 1993, Delp 1995) ==
Doorgaans is de gastrocnemius gecontraheerd en de soleus van normale lengte. Als beide spieren gecontraheerd zijn, is de gastrocnemius-contractuur groter dan die van de soleus. Onderscheid via Silfverskiöld-test (klinisch, en altijd onder anesthesie).
Voor normale volwassen gang is 10° enkeldorsiflexie met knie-extensie nodig. Taak van de soleus: dorsiflexie afremmen tijdens mid-stance; overmatig krachtverlies bevordert crouch-gait.
Ware lengte triceps surae meten met voet in lichte subtalaire varus-positie, met zowel geflecteerde als geëxtendeerde knie (Fig. 5.2).
[Passage over MTP-dorsiflexie bij planovalgus-voet was op de foto deels door een vinger bedekt — hier bewust weggelaten, evt. opnieuw fotograferen.]

== Hamstring shift & bekkenkanteling ==
"Bilaterale popliteahoek": ipsilaterale heup 90° flexie, contralaterale heup flecteren tot ASIS/PSIS verticaal uitgelijnd zijn (Fig. 5.4b).
- Popliteahoek met neutraal bekken = "ware hamstring-contractuur"
- Popliteahoek met (aanwezige) lordose = "functionele hamstring-contractuur"
- Verschil tussen beide = mate van "hamstring shift"
Excessieve anteriore bekkenkanteling (vaak bij diplegische/quadriplegische CP) → hamstring shift + schijnbare knieflexiecontractuur (Hoffinger 1993, Delp 1996, Schutte 1997).
Let op: hamstringlengte is bij crouch-gait vaak normaal of zelfs lang — chirurgische verlenging kan de heupextensoren verder verzwakken, met als gevolg méér heupflexie, anteriore bekkenkanteling en lumbale lordose.
Delp e.a. (1996): per graad excessieve anteriore bekkenkanteling een bepaalde mate hamstring shift (precieze factor op de foto niet leesbaar). Hamstring shift >20° wijst meestal op zwakke heupextensoren.
Ook capsulaire tightness beoordelen door de knieën volledig te extenderen.`,

  ortho:
`BRON: Gage — Identification and Treatment of Gait Problems in Cerebral Palsy (eigen exemplaar, overgetypt uit foto's)

== Voetonderzoek: forefoot varus/valgus (Fig. 5.7) ==
Normale voorvoet: vlak van de metatarsalia staat loodrecht op de as van de calcaneus.
- Forefoot varus: vlak van de metatarsalia is gesupineerd t.o.v. de as van de calcaneus
- Forefoot valgus: vlak van de metatarsalia is gepronaeerd t.o.v. de as van de calcaneus

== Coleman block test (Fig. 5.8) ==
Onderscheidt of varus van de hindfoot of forefoot komt.
Uitvoering: hiel en laterale voetrand op een blok van 1 inch (of wig onder laterale voorvoet, waardoor MT I–IV kunnen proneren).
- Rigide forefoot valgus (pronatie) + flexibele hindfoot varus → hindfoot varus verdwijnt of vermindert significant op het blok
- Rigide hindfoot varus → blijft ondanks voorvoetpositionering
Documenteren met AP- en laterale foto's + röntgenfoto's.

Zie ook: "Cerebrale parese & spasticiteit" → Enkel/voet bij spastische diplegie/quadriplegie, en Contractuurtesten (Silfverskiöld, Duncan-Ely, Phelps).`,

  uitval:
`BRON: algemene neuroanatomie/myotoomniveaus — geen foto uit je boek, dit is standaard leerboekkennis. Controleer bij twijfel tegen je eigen bronnen.

Relevant bij: spina bifida (uitvalsniveau/motorisch niveau), dwarslaesie, overige lumbosacrale wortelaandoeningen.

Motorisch niveau = laagste segment met kracht ≥3/5 (MRC-schaal).

== THORACAAL (T-niveau) ==
Geen functionele beenspieren; evt. reflexmatige heupflexie/-adductie zonder willekeurige controle.
Prognose: doorgaans rolstoelafhankelijk.

== L1–L2 ==
- Iliopsoas (heupflexie) — L1–L2/L3
- Adductoren (heupadductie) — L2–L3
- Geen kniefunctie

== L3 ==
- Quadriceps femoris (knie-extensie) — L2–L4, voornamelijk L3–L4
- Heupflexie sterk aanwezig
- Geen heupabductie, geen enkelfunctie

== L4 ==
- Quadriceps sterk aanwezig
- Tibialis anterior (enkeldorsiflexie) — L4–L5
- Gluteus medius (heupabductie) — L4–S1: op dit niveau nog zwak/afwezig
- Geen heupextensie (gluteus maximus), geen enkelplantairflexie

== L5 ==
- Tibialis anterior sterk aanwezig
- Extensor hallucis longus (teenextensie) — L5
- Gluteus medius (heupabductie) — nu meer volledig aanwezig
- Hamstrings (knieflexie) — deels aanwezig
- Zwakke heupextensie; geen enkelplantairflexie (gastrocnemius/soleus)

== S1 ==
- Gastrocnemius/soleus (enkelplantairflexie) — S1–S2
- Gluteus maximus (heupextensie) — voornamelijk S1
- Prognose: vaak (bijna) volledige mobiliteit

== S2–S3 ==
- Intrinsieke voetspieren, teenflexoren
- Blaas-/darmfunctie (S2–S4) — apart te beoordelen, niet 1-op-1 met het motorisch niveau van de beenspieren

Let op: het motorisch niveau is per definitie het laagste niveau met nog functionele kracht — bij spina bifida vaak asymmetrisch tussen linker- en rechterbeen, en kan geleidelijk zakken bij een tethered cord (reden voor follow-up).`,

  heup:
`BRON: eigen algemene kennis — GEEN specifiek screeningsprotocol overgenomen. Screeningsintervallen en drempelwaarden verschillen per richtlijn (bijv. Nederlandse CP-richtlijn, CPUP, AACPDM) en dat is precies het soort getal dat ik hier niet zelf invul. Vul het schema van jouw centrum/richtlijn hieronder zelf aan, of stuur een foto van je bron door zodat ik 'm kan overtypen — net als bij de andere categorieën.

== Waarom heupscreening bij CP? ==
Kinderen met CP hebben een verhoogd risico op progressieve heupsubluxatie/-luxatie door spastische spierdysbalans (met name adductoren en iliopsoas) bij een bij geboorte doorgaans normale heup. Het risico correleert sterk met het GMFCS-niveau: hoe hoger (lager mobiel) het niveau, hoe groter de kans op heupproblemen. Onbehandeld kan dit leiden tot pijn, functieverlies en een lastiger te behandelen (gefixeerde) luxatie.

== Kernmaat: migratiepercentage (Reimers' index) ==
Op een AP-bekkenfoto: het percentage van de femurkop dat lateraal van de lijn van Perkins ligt, gedeeld door de totale breedte van de femurkop × 100%.
- Een hoger percentage, of een snelle stijging tussen twee metingen, wijst op een verhoogd risico op (sub)luxatie — reden voor nauwere follow-up of verwijzing naar de (kinder)orthopedie.

== Screeningsschema ==
[HIER ZELF INVULLEN: startleeftijd, frequentie per GMFCS-niveau, stopcriteria — vanuit het protocol dat je centrum volgt.]
Gebruik de "Zoek in Richtlijnendatabase"-knop bovenaan deze pagina voor de actuele Nederlandse richtlijn.

== Rode vlaggen voor extra alertheid ==
- Snelle toename van het migratiepercentage tussen twee metingen
- Nieuwe pijnklachten bij verzorging/verplaatsen/aankleden
- Afname bewegingsuitslag heup, met name abductie
- Asymmetrische heupafwijking`,

  sedatie:
`BRON: eigen interne teamoverleg/mailwisseling, Beatrix Kinderkliniek UMCG (januari 2026) — dit is een praktijkafspraak binnen het team, geen gepubliceerde richtlijn. Namen bewust weggelaten.

== Context ==
De vraag kwam op bij de invoering van een nieuwe sedatieorder: bij het plannen van een botulinetoxine-behandeling moet vooraf al worden aangegeven of het kind onder sedatie of onder algehele narcose behandeld wordt — dus nog vóórdat het kind door het behandelteam is gezien.

== Overwegingen voor sedatie vs. algehele narcose (praktijkafspraak, stand jan. 2026) ==
- Hoeveelheid benodigde injecties: bij veel injecties eerder algehele narcose overwegen i.p.v. sedatie
- Lastige/diepe injecties: technisch moeilijker bereikbare of diepere spieren → zelfde overweging
- Mate van angst: een kind dat enorm angstig is, wordt gezien als reden om niet voor sedatie te kiezen
- Moeite met inslapen op zich wordt in de discussie als minder doorslaggevend gezien ("relatief") — dit lukt in de praktijk meestal ook onder sedatie, dus niet als op zichzelf staande contra-indicatie beschouwd

Let op: dit is de praktijkafspraak van dit team op basis van onderling overleg, nog in ontwikkeling (samenhangend met een nieuwe sedatieorder) — geen formele richtlijn. Gebruik de "Zoek in Richtlijnendatabase"-knop hierboven als je een gepubliceerde bron zoekt.`,
};

const STORAGE_CATS = 'krnCategories';
const STORAGE_NOTES = 'krnNotes';
const STORAGE_VIDEOS = 'krnVideos';

let categories = [];
let notes = {};
let videos = {};        // { catId: [ {yt, titel, ts} ] }
let activeId = null;
let saveTimer = null;

function loadState() {
  try {
    const c = localStorage.getItem(STORAGE_CATS);
    categories = c ? JSON.parse(c) : DEFAULT_CATS.slice();
  } catch (e) { categories = DEFAULT_CATS.slice(); }

  // De directLinks van standaardcategorieën altijd verversen naar de nieuwste versie uit
  // de code (dit zijn vaste, door mij onderhouden knoppen, geen gebruikersdata — dus geen
  // "alleen aanvullen"-voorzichtigheid nodig zoals bij notities). Eigen, zelf toegevoegde
  // categorieën (geen match in DEFAULT_CATS) blijven onaangeroerd. Label/scope die de
  // gebruiker eventueel zelf aanpaste, blijven ook staan — alleen directLinks wordt gesynct.
  let catsChanged = false;

  // Categorieën die ik later in de code toevoeg moeten ook verschijnen bij wie de app
  // al eerder opende (die heeft een opgeslagen lijst in localStorage, en die won het
  // voorheen altijd van de code — nieuwe onderwerpen bleven dan onzichtbaar).
  // Nieuwe standaardcategorieën worden ingevoegd op hun plek uit DEFAULT_CATS;
  // zelf toegevoegde categorieën blijven staan waar ze staan.
  const aanwezig = new Set(categories.map(c => c.id));
  DEFAULT_CATS.forEach((def, defIdx) => {
    if (aanwezig.has(def.id)) return;
    // zoek de voorganger uit DEFAULT_CATS die de gebruiker wél heeft, en plaats erachter
    let pos = categories.length;
    for (let i = defIdx - 1; i >= 0; i--) {
      const idx = categories.findIndex(c => c.id === DEFAULT_CATS[i].id);
      if (idx !== -1) { pos = idx + 1; break; }
    }
    categories.splice(pos, 0, Object.assign({}, def));
    catsChanged = true;
  });

  categories.forEach(cat => {
    const def = DEFAULT_CATS.find(d => d.id === cat.id);
    if (def && def.directLinks) {
      const same = JSON.stringify(cat.directLinks) === JSON.stringify(def.directLinks);
      if (!same) { cat.directLinks = def.directLinks; catsChanged = true; }
    }
    if (cat.directLink) { delete cat.directLink; catsChanged = true; } // oud enkelvoudig veld opruimen
  });
  if (catsChanged) saveCategories();

  try {
    const n = localStorage.getItem(STORAGE_NOTES);
    notes = n ? JSON.parse(n) : {};
  } catch (e) { notes = {}; }

  try {
    const v = localStorage.getItem(STORAGE_VIDEOS);
    videos = v ? JSON.parse(v) : {};
  } catch (e) { videos = {}; }

  // Startnotities eenmalig invullen — nooit iets overschrijven wat al bestaat
  // (ook niet een bewust leeggemaakt veld: alleen bij volledig ontbrekende sleutel).
  let seeded = false;
  for (const id in DEFAULT_NOTES) {
    if (!(id in notes)) { notes[id] = DEFAULT_NOTES[id]; seeded = true; }
  }
  if (seeded) saveNotes();
}

function saveCategories() {
  localStorage.setItem(STORAGE_CATS, JSON.stringify(categories));
}
function saveNotes() {
  localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
}
function saveVideos() {
  localStorage.setItem(STORAGE_VIDEOS, JSON.stringify(videos));
}

// ===== ONDERWIJSVIDEO'S =====
// Ondersteunt: youtube.com/watch?v=, youtu.be/, /embed/, /shorts/, /live/, of een kale video-id.
function parseYouTubeId(input) {
  const s = (input || '').trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /\/embed\/([A-Za-z0-9_-]{11})/,
    /\/shorts\/([A-Za-z0-9_-]{11})/,
    /\/live\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
}

function renderVideos() {
  const el = document.getElementById('videoLijst');
  const list = (activeId && videos[activeId]) ? videos[activeId] : [];

  if (!list.length) {
    el.innerHTML = '<div class="video-leeg">Nog geen video bij dit onderwerp.</div>';
    return;
  }

  el.innerHTML = list.map((v, i) => `
    <div class="video-item">
      <div class="video-item-head">
        <div class="video-item-titel">${esc(v.titel)}</div>
        <button class="video-item-del" data-idx="${i}" title="Uit lijst verwijderen">✕</button>
      </div>
      <div class="video-frame">
        <iframe src="https://www.youtube-nocookie.com/embed/${esc(v.yt)}"
                title="${esc(v.titel)}"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      </div>
    </div>
  `).join('');

  el.querySelectorAll('.video-item-del').forEach(btn => {
    btn.addEventListener('click', () => deleteVideo(parseInt(btn.dataset.idx, 10)));
  });
}

function addVideo() {
  if (!activeId) return;
  const urlEl = document.getElementById('videoUrl');
  const titelEl = document.getElementById('videoTitel');
  const errEl = document.getElementById('videoError');

  const yt = parseYouTubeId(urlEl.value);
  if (!yt) {
    errEl.textContent = '⚠️ Dat lijkt geen geldige YouTube-link. Gebruik de link uit "Delen" op YouTube.';
    errEl.classList.add('show');
    return;
  }
  errEl.classList.remove('show');

  if (!videos[activeId]) videos[activeId] = [];
  videos[activeId].push({
    yt: yt,
    titel: titelEl.value.trim() || 'Zonder titel',
    ts: Date.now()
  });
  urlEl.value = ''; titelEl.value = '';
  saveVideos();
  renderVideos();
  toast('✅ Video toegevoegd');
}

function deleteVideo(idx) {
  if (!activeId || !videos[activeId]) return;
  const v = videos[activeId][idx];
  if (!v) return;
  if (!confirm('"' + v.titel + '" uit de lijst verwijderen?\n\n(De video zelf blijft op YouTube staan.)')) return;
  videos[activeId].splice(idx, 1);
  if (!videos[activeId].length) delete videos[activeId];
  saveVideos();
  renderVideos();
  toast('🗑️ Verwijderd');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function zoekLink(label, extra) {
  const q = encodeURIComponent(label + (extra ? ' ' + extra : ''));
  return q;
}

// ===== RENDER =====
function renderList(filter) {
  const el = document.getElementById('catList');
  const f = (filter || '').toLowerCase().trim();

  const items = categories.filter(c => {
    if (!f) return true;
    const n = (notes[c.id] || '').toLowerCase();
    return c.label.toLowerCase().includes(f) || (c.scope || '').toLowerCase().includes(f) || n.includes(f);
  });

  if (!items.length) {
    el.innerHTML = '<div class="cat-empty">Niets gevonden.</div>';
    return;
  }

  el.innerHTML = items.map(c => `
    <button class="cat-item${c.id === activeId ? ' active' : ''}" data-id="${c.id}">
      ${esc(c.label)}
      ${c.scope ? `<span class="scope">${esc(c.scope)}</span>` : ''}
    </button>
  `).join('');

  el.querySelectorAll('.cat-item').forEach(btn => {
    btn.addEventListener('click', () => openCategory(btn.dataset.id));
  });
}

function openCategory(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  activeId = id;

  document.getElementById('detailEmpty').hidden = true;
  document.getElementById('detailContent').hidden = false;
  document.getElementById('detailTitle').textContent = cat.label;
  document.getElementById('detailScope').textContent = cat.scope || '';

  const rdQuery = zoekLink(cat.label, cat.scope);
  const directLinksHtml = (cat.directLinks || [])
    .map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
    .join('');
  document.getElementById('detailLinks').innerHTML = `
    ${directLinksHtml}
    <a href="https://www.google.com/search?q=${rdQuery}+site:richtlijnendatabase.nl" target="_blank" rel="noopener">🔎 Zoek in Richtlijnendatabase</a>
    <a href="https://www.google.com/search?q=${rdQuery}+richtlijn+kinderrevalidatie" target="_blank" rel="noopener">🔎 Breder zoeken</a>
  `;

  const area = document.getElementById('notesArea');
  area.value = notes[id] || '';

  // videoveld leegmaken bij wisselen van onderwerp, zodat een half ingevulde
  // link niet per ongeluk bij de verkeerde categorie belandt
  document.getElementById('videoUrl').value = '';
  document.getElementById('videoTitel').value = '';
  document.getElementById('videoError').classList.remove('show');
  renderVideos();

  renderList(document.getElementById('zoek').value);
  document.getElementById('layout').classList.add('detail-active');
  document.getElementById('detail').scrollTop = 0;
}

function closeDetail() {
  activeId = null;
  document.getElementById('detailEmpty').hidden = false;
  document.getElementById('detailContent').hidden = true;
  document.getElementById('layout').classList.remove('detail-active');
}

// ===== NOTITIES AUTOSAVE =====
function scheduleSave() {
  const status = document.getElementById('saveStatus');
  status.textContent = 'Bezig met typen…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!activeId) return;
    notes[activeId] = document.getElementById('notesArea').value;
    saveNotes();
    status.textContent = '✓ Opgeslagen';
    renderList(document.getElementById('zoek').value);
    setTimeout(() => { if (status.textContent === '✓ Opgeslagen') status.textContent = ''; }, 2000);
  }, 500);
}

// ===== CATEGORIE TOEVOEGEN / VERWIJDEREN =====
function addCategory() {
  const label = prompt('Naam van het nieuwe aandachtsgebied:');
  if (!label || !label.trim()) return;
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  categories.push({ id, label: label.trim(), scope: '' });
  saveCategories();
  renderList(document.getElementById('zoek').value);
  openCategory(id);
  toast('✅ Toegevoegd');
}

function deleteCategory() {
  if (!activeId) return;
  const cat = categories.find(c => c.id === activeId);
  if (!cat) return;
  if (!confirm(`"${cat.label}" en de bijbehorende aantekeningen en video's verwijderen?`)) return;
  categories = categories.filter(c => c.id !== activeId);
  delete notes[activeId];
  delete videos[activeId];
  saveCategories();
  saveNotes();
  saveVideos();
  closeDetail();
  renderList(document.getElementById('zoek').value);
  toast('🗑️ Verwijderd');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

// ===== INIT =====
loadState();
renderList('');

document.getElementById('zoek').addEventListener('input', e => renderList(e.target.value));
document.getElementById('notesArea').addEventListener('input', scheduleSave);
document.getElementById('addCatBtn').addEventListener('click', addCategory);
document.getElementById('delCatBtn').addEventListener('click', deleteCategory);
document.getElementById('backBtn').addEventListener('click', closeDetail);
document.getElementById('videoAddBtn').addEventListener('click', addVideo);
document.getElementById('videoUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('videoTitel').focus();
});
document.getElementById('videoTitel').addEventListener('keydown', e => {
  if (e.key === 'Enter') addVideo();
});
