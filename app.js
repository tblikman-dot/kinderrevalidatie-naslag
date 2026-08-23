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
  { id: 'ortho-ok', label: 'Orthopedische operaties bij kinderen', scope: 'Ingrepen, timing, SEMLS — techniek en beeldmateriaal' },
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


// ===== EXTRA INHOUDSBLOKKEN =====
// Blokken die ik later toevoeg aan een bestaand onderwerp. Elk blok heeft een
// eigen id; toegepaste ids worden onthouden, zodat een blok precies één keer
// wordt aangevuld en je eigen aanpassingen nooit worden overschreven.
const EXTRA_BLOKKEN = [
  {
    id: 'ob-cp-heup-1',
    cat: 'heup',
    html: `<h3>Spastische heup bij CP — evaluatie &amp; beleid</h3>
<div class="bron">BRON: Orthobullets, onderwerp CP-heup (overgetypt uit schermafbeeldingen). Amerikaanse bron — kan afwijken van de Nederlandse richtlijn; die blijft leidend. Passages die op de schermafbeelding waren afgesneden zijn weggelaten, niet aangevuld.</div>

<p><strong>Presentatie — symptomen</strong></p>
<ul>
<li>Heup- en/of liespijn</li>
<li>Moeite met zitten</li>
<li>Moeite met perineale verzorging/hygi&euml;ne</li>
</ul>

<p><strong>Lichamelijk onderzoek</strong></p>
<ul>
<li>Op zichzelf een onbetrouwbare diagnostische beoordeling</li>
<li>Verminderde heup-ROM</li>
<li>Pijn bij heupbeweging</li>
<li>Loopproblemen door lever arm dysfunction</li>
</ul>

<p><strong>Beeldvorming — r&ouml;ntgen</strong></p>
<ul>
<li>AP en frog lateral (indien mogelijk)</li>
<li>Heupabductie &lt; 45&deg; met parti&euml;le ontbloting van de femurkop op de r&ouml;ntgenfoto = "at risk"-heup</li>
</ul>

<p><strong>Reimers migratie-index</strong></p>
<ul>
<li>Percentage van de femurkop zonder acetabulaire bedekking</li>
<li>Meest accurate methode om heupstabiliteit vast te stellen en te vervolgen</li>
<li>&lt; 33% = at risk</li>
<li>&gt; 33% = gesubluxeerde heup</li>
</ul>

<p><strong>CT</strong></p>
<ul>
<li>Meer van nut voor operatieplanning dan voor diagnostiek</li>
<li>3D-reconstructie helpt bij het plannen van acetabulaire correctie</li>
<li>CT-scanogram bruikbaar om femorale versie te meten bij een geplande derotatie-osteotomie</li>
</ul>

<p><strong>Niet-operatief</strong></p>
<ul>
<li>Observatie bij milde gevallen</li>
<li>[Passage over fysiotherapie was op de schermafbeelding afgesneden]</li>
</ul>

<div class="tabel-titel">Beleid per stadium</div>
<div class="tabel-scroll"><table>
<tr><th>Stadium</th><th>Kenmerken</th><th>Behandeling</th></tr>
<tr><td>Hip at risk</td><td>Heupabductie &lt; 45&deg; met parti&euml;le ontbloting van de femurkop op r&ouml;ntgen; Reimers-index &lt; 33%</td><td>Botox A in spastische spieren (leeftijd &lt; 3) om operatie uit te stellen. Poging tot voorkomen van luxatie met adductorenrelease, psoasrelease, hamstringverlenging (leeftijd 3&ndash;4). Vermijd obturatorius-neurectomie</td></tr>
<tr><td>Hip subluxation</td><td>Reimers-index &gt; 33%; onderbroken Shenton-lijn</td><td>Adductorentenotomie als abductie beperkt is. Bij persisterende subluxatie: proximale femorale varus-derotatie-osteotomie (leeftijd 5&ndash;6). Bekkenosteotomie als er acetabulaire insufficiëntie is</td></tr>
<tr><td>Spastic dislocation</td><td>Volledig geluxeerde heup; Reimers-index &gt; 100%</td><td>Open repositie met varus-derotatie-osteotomie, plus femorale verkorting en bekkenosteotomie&euml;n</td></tr>
<tr><td>Windswept hips</td><td>Abductie van de ene heup met adductie van de contralaterale heup</td><td>Brace op de geadduceerde heup, met of zonder tenotomie, en opheffen van de abductiecontractuur van de geabduceerde heup</td></tr>
</table></div>

<div class="tabel-titel">Spastische heupdysplasie vs. DDH</div>
<div class="tabel-scroll"><table>
<tr><th>Factor</th><th>Spastisch</th><th>Ontwikkelings- (DDH)</th></tr>
<tr><td>Bevindingen bij geboorte</td><td>Heup meestal normaal</td><td>Heup meestal afwijkend</td></tr>
<tr><td>Leeftijd met risico</td><td>Meestal normaal in 1e levensjaar; herkend na 2 jaar</td><td>Meestal herkend in 1e levensjaar</td></tr>
<tr><td>Detectie</td><td>R&ouml;ntgen in de meeste gevallen nodig</td><td>Lichamelijk onderzoek in de meeste gevallen</td></tr>
<tr><td>Etiologie</td><td>Spastische spieren duwen de femurkop uit een normaal acetabulum; bekkenobliquiteit</td><td>Mechanische factoren (stuit), ligamentaire laxiteit, abnormale acetabulaire groei</td></tr>
<tr><td>Progressie in de kindertijd</td><td>Progressieve subluxatie komt vaak voor</td><td>Progressieve subluxatie zeldzaam</td></tr>
<tr><td>Natuurlijk beloop</td><td>Pijn bij veel gesubluxeerde/geluxeerde heupen in 2e of 3e decennium</td><td>Pijn bij veel gesubluxeerde heupen in 4e of 5e decennium</td></tr>
<tr><td>Acetabulaire deficiëntie</td><td>Meestal posterosuperieur</td><td>Meestal anterieur</td></tr>
<tr><td>Vroege maatregelen</td><td>Spierverlenging</td><td>Pavlik-bandage of gesloten repositie</td></tr>
<tr><td>Gemist of gefaald</td><td>Heuposteotomie&euml;n, vaak zonder open repositie</td><td>Gesloten of open repositie, vaak zonder osteotomie (v&oacute;&oacute;r 18 maanden)</td></tr>
<tr><td>Salvage</td><td>Castle resectie-interpositie-artroplastiek</td><td>Meestal totale heupartroplastiek</td></tr>
</table></div>`
  },
  {
    id: 'ob-cp-ok-1',
    cat: 'ortho-ok',
    html: `<h3>Spastische heup bij CP — operatieve opties</h3>
<div class="bron">BRON: Orthobullets, onderwerp CP-heup (overgetypt uit schermafbeeldingen). Amerikaanse bron — kan afwijken van de Nederlandse richtlijn; die blijft leidend. Afgesneden passages zijn weggelaten, niet aangevuld. Zie ook "Heupscreening bij CP" voor evaluatie en de beleidstabel.</div>

<p><strong>Weke delen</strong></p>
<ul>
<li>Heupadductoren- en psoasrelease met abductiebrace
<ul>
<li>Indicaties: kinderen &lt; 6 jaar met Reimers-index &gt; 25/33&ndash;60% en beperkte abductie (overweeg bij "at risk"-heupen)</li>
<li>Elk bewijs van progressieve subluxatie bij &lt; 8 jaar</li>
<li>Kan ook als aanvulling op botingrepen worden gebruikt</li>
<li>Doelen: heupsubluxatie en -luxatie voorkomen; comfortabel zitten behouden</li>
</ul>
</li>
</ul>

<p><strong>Reconstructief</strong></p>
<ul>
<li>Proximale femorale osteotomie met shelf-vormende (Dega) osteotomie en weke-delenrelease
<ul>
<li>Indicaties: kinderen &gt; 4 jaar of Reimers-index &gt; 60%</li>
<li>Bij een ernstig dysplastische CP-heup het beste alle pathologie in &eacute;&eacute;n stadium behandelen</li>
</ul>
</li>
</ul>

<p><strong>Salvage</strong></p>
<ul>
<li>Valgus support osteotomie (femurkopresectie + valgiserende subtrochant&egrave;re femorale osteotomie, bijv. McHale-techniek)
<ul>
<li>Indicatie: salvage-techniek bij symptomatische, chronisch geluxeerde heupen bij CP</li>
</ul>
</li>
<li>Castle resectie-interpositie-artroplastiek
<ul>
<li>Indicaties: chronisch geluxeerde heupen, vooral bij volwassen CP-populatie; niet kunnen lopen, wel staan om te transfereren (GMFCS 5)</li>
</ul>
</li>
<li>Totale heupartroplastiek
<ul>
<li>Indicaties: lopende pati&euml;nten en rolstoelgebruikers die kunnen staan om te transfereren</li>
<li>Resultaat: 85% 10-jaarsoverleving bij CP-pati&euml;nten</li>
</ul>
</li>
<li>Heuparthrodese
<ul>
<li>Indicaties: jonge pati&euml;nten; lopende pati&euml;nten en rolstoelgebruikers die kunnen staan om te transfereren</li>
</ul>
</li>
<li>Girdlestone-procedure
<ul>
<li>Wordt niet meer uitgevoerd: veroorzaakt steevast pijn</li>
<li>Oorzaak: gebrek aan weke-deleninterpositie tussen doorgenomen femur en acetabulum leidt tot proximale femorale migratie</li>
</ul>
</li>
</ul>`
  },
];

const STORAGE_BLOKKEN = 'krnToegepasteBlokken';

function pasExtraBlokkenToe() {
  let toegepast = [];
  try {
    const t = localStorage.getItem(STORAGE_BLOKKEN);
    toegepast = t ? JSON.parse(t) : [];
  } catch (e) { toegepast = []; }

  let veranderd = false;
  EXTRA_BLOKKEN.forEach(blok => {
    if (toegepast.includes(blok.id)) return;
    const bestaand = notes[blok.cat] || '';
    notes[blok.cat] = bestaand ? (bestaand + blok.html) : blok.html;
    toegepast.push(blok.id);
    veranderd = true;
  });

  if (veranderd) {
    saveNotes();
    try { localStorage.setItem(STORAGE_BLOKKEN, JSON.stringify(toegepast)); } catch (e) {}
  }
}

const STORAGE_CATS = 'krnCategories';
const STORAGE_NOTES = 'krnNotes';
const STORAGE_VIDEOS = 'krnVideos';
const STORAGE_LINKS = 'krnLinks';

let categories = [];
let notes = {};
let videos = {};        // { catId: [ {yt, titel, ts} ] }
let links = {};         // { catId: [ {url, titel, ts} ] }
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

  try {
    const l = localStorage.getItem(STORAGE_LINKS);
    links = l ? JSON.parse(l) : {};
  } catch (e) { links = {}; }

  // Startnotities eenmalig invullen — nooit iets overschrijven wat al bestaat
  // (ook niet een bewust leeggemaakt veld: alleen bij volledig ontbrekende sleutel).
  let seeded = false;
  for (const id in DEFAULT_NOTES) {
    if (!(id in notes)) { notes[id] = DEFAULT_NOTES[id]; seeded = true; }
  }

  // Aantekeningen die nog platte tekst zijn omzetten naar opgemaakte tekst.
  // Gebeurt eenmalig; wat al HTML is blijft ongemoeid.
  for (const id in notes) {
    const n = notes[id];
    if (typeof n === 'string' && n.trim() && !lijktOpHtml(n)) {
      notes[id] = platteTekstNaarHtml(n);
      seeded = true;
    }
  }
  if (seeded) saveNotes();

  pasExtraBlokkenToe();
}

function saveCategories() {
  localStorage.setItem(STORAGE_CATS, JSON.stringify(categories));
}
function saveNotes() {
  localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
}
// ===== OPGEMAAKTE AANTEKENINGEN =====
// Aantekeningen worden als HTML bewaard. Oudere notities (en de startnotities
// uit het boek) zijn platte tekst; die worden eenmalig omgezet, waarbij
// "== Kop ==" een echte kop wordt en "- " regels een opsomming.
function lijktOpHtml(s) {
  return /<(p|h[1-6]|ul|ol|li|br|strong|b|em|i|mark|div|span)\b[^>]*>/i.test(s);
}

function platteTekstNaarHtml(txt) {
  const regels = String(txt).replace(/\r\n/g, '\n').split('\n');
  const uit = [];
  let inLijst = false;

  const sluitLijst = () => { if (inLijst) { uit.push('</ul>'); inLijst = false; } };

  regels.forEach(regel => {
    const r = regel.trim();

    if (!r) { sluitLijst(); return; }

    const kop = r.match(/^==\s*(.+?)\s*==$/);
    if (kop) { sluitLijst(); uit.push('<h3>' + esc(kop[1]) + '</h3>'); return; }

    const item = r.match(/^[-·•]\s+(.*)$/);
    if (item) {
      if (!inLijst) { uit.push('<ul>'); inLijst = true; }
      uit.push('<li>' + esc(item[1]) + '</li>');
      return;
    }

    sluitLijst();
    uit.push('<p>' + esc(r) + '</p>');
  });

  sluitLijst();
  return uit.join('');
}

function platteTekst(html) {
  if (!lijktOpHtml(html)) return String(html);
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}

function opmaakKnop(cmd) {
  const area = document.getElementById('notesArea');
  area.focus();
  try { document.execCommand('styleWithCSS', false, false); } catch (e) {}

  switch (cmd) {
    case 'kop': {
      // al een kop? dan terug naar gewone alinea
      const inKop = !!(window.getSelection().anchorNode &&
        window.getSelection().anchorNode.parentElement &&
        window.getSelection().anchorNode.parentElement.closest('h3'));
      document.execCommand('formatBlock', false, inKop ? 'p' : 'h3');
      break;
    }
    case 'bold':   document.execCommand('bold'); break;
    case 'italic': document.execCommand('italic'); break;
    case 'ul':     document.execCommand('insertUnorderedList'); break;
    case 'mark': {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { toast('Selecteer eerst wat tekst'); return; }
      // bestaande markering weghalen, anders markeren
      const al = sel.anchorNode && sel.anchorNode.parentElement &&
                 sel.anchorNode.parentElement.closest('mark');
      if (al) {
        const ouder = al.parentNode;
        while (al.firstChild) ouder.insertBefore(al.firstChild, al);
        ouder.removeChild(al);
      } else {
        const bereik = sel.getRangeAt(0);
        const m = document.createElement('mark');
        try { bereik.surroundContents(m); }
        catch (e) { m.appendChild(bereik.extractContents()); bereik.insertNode(m); }
      }
      sel.removeAllRanges();
      break;
    }
    case 'clear':
      document.execCommand('removeFormat');
      document.execCommand('formatBlock', false, 'p');
      break;
  }
  scheduleSave();
}

function saveVideos() {
  localStorage.setItem(STORAGE_VIDEOS, JSON.stringify(videos));
}
function saveLinks() {
  localStorage.setItem(STORAGE_LINKS, JSON.stringify(links));
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

// ===== AFBEELDINGEN & LINKS =====
// Een URL wordt eerst als afbeelding geprobeerd; lukt dat niet (webpagina,
// Google Foto's-album, hotlink geblokkeerd), dan valt hij terug op een link.
function isVeiligeUrl(s) {
  try {
    const u = new URL(s.trim());
    return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null;
  } catch (e) { return null; }
}

function renderLinks() {
  const el = document.getElementById('linkLijst');
  const list = (activeId && links[activeId]) ? links[activeId] : [];

  if (!list.length) {
    el.innerHTML = '<div class="video-leeg">Nog geen afbeelding of link bij dit onderwerp.</div>';
    return;
  }

  el.innerHTML = list.map((l, i) => `
    <div class="link-item">
      <div class="video-item-head">
        <div class="video-item-titel">${esc(l.titel)}</div>
        <button class="video-item-del" data-idx="${i}" title="Uit lijst verwijderen">✕</button>
      </div>
      <a href="${esc(l.url)}" target="_blank" rel="noopener" class="link-thumb" data-idx="${i}">
        <img src="${esc(l.url)}" alt="${esc(l.titel)}" loading="lazy">
      </a>
      <a href="${esc(l.url)}" target="_blank" rel="noopener" class="link-fallback" data-idx="${i}" hidden>
        🔗 <span class="link-url">${esc(l.url)}</span>
      </a>
    </div>
  `).join('');

  // afbeelding niet te laden -> toon in plaats daarvan de link
  el.querySelectorAll('.link-thumb img').forEach(img => {
    img.addEventListener('error', () => {
      const idx = img.closest('.link-thumb').dataset.idx;
      img.closest('.link-thumb').hidden = true;
      const fb = el.querySelector(`.link-fallback[data-idx="${idx}"]`);
      if (fb) fb.hidden = false;
    });
  });

  el.querySelectorAll('.video-item-del').forEach(btn => {
    btn.addEventListener('click', () => deleteLink(parseInt(btn.dataset.idx, 10)));
  });
}

function addLink() {
  if (!activeId) return;
  const urlEl = document.getElementById('linkUrl');
  const titelEl = document.getElementById('linkTitel');
  const errEl = document.getElementById('linkError');

  const url = isVeiligeUrl(urlEl.value);
  if (!url) {
    errEl.textContent = '⚠️ Dat lijkt geen geldige link. Plak een adres dat begint met https://';
    errEl.classList.add('show');
    return;
  }
  errEl.classList.remove('show');

  if (!links[activeId]) links[activeId] = [];
  links[activeId].push({
    url: url,
    titel: titelEl.value.trim() || 'Zonder titel',
    ts: Date.now()
  });
  urlEl.value = ''; titelEl.value = '';
  saveLinks();
  renderLinks();
  toast('✅ Link toegevoegd');
}

function deleteLink(idx) {
  if (!activeId || !links[activeId]) return;
  const l = links[activeId][idx];
  if (!l) return;
  if (!confirm('"' + l.titel + '" uit de lijst verwijderen?')) return;
  links[activeId].splice(idx, 1);
  if (!links[activeId].length) delete links[activeId];
  saveLinks();
  renderLinks();
  toast('🗑️ Verwijderd');
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

// ===== ZOEKEN =====
// Zoekt in de titel, de omschrijving, je aantekeningen, én in de titels van
// video's en links — een video als "Gans-osteotomie" moet gewoon vindbaar zijn.
// Accenten worden genegeerd, zodat "Silfverskiold" ook "Silfverskiöld" vindt.
function normaliseer(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function fragmentRond(tekst, term, lengte = 60) {
  const pos = normaliseer(tekst).indexOf(term);
  if (pos === -1) return tekst.slice(0, lengte);
  const start = Math.max(0, pos - Math.floor(lengte / 3));
  const stuk = tekst.slice(start, start + lengte).replace(/\s+/g, ' ').trim();
  return (start > 0 ? '…' : '') + stuk + (start + lengte < tekst.length ? '…' : '');
}

function zoekTreffer(cat, filter) {
  if (!filter) return { raak: true };
  const f = normaliseer(filter);

  if (normaliseer(cat.label).includes(f)) return { raak: true };
  if (normaliseer(cat.scope).includes(f)) return { raak: true };

  const video = (videos[cat.id] || []).find(v => normaliseer(v.titel).includes(f));
  if (video) return { raak: true, hint: '🎬 ' + video.titel };

  const link = (links[cat.id] || [])
    .find(l => normaliseer(l.titel).includes(f) || normaliseer(l.url).includes(f));
  if (link) return { raak: true, hint: '🔗 ' + link.titel };

  const tekst = platteTekst(notes[cat.id] || '');
  if (normaliseer(tekst).includes(f)) {
    return { raak: true, hint: '📝 ' + fragmentRond(tekst, f) };
  }

  return { raak: false };
}

// ===== RENDER =====
function renderList(filter) {
  const el = document.getElementById('catList');
  const f = (filter || '').toLowerCase().trim();

  const treffers = new Map();
  const items = categories.filter(c => {
    const t = zoekTreffer(c, f);
    if (t.raak && t.hint) treffers.set(c.id, t.hint);
    return t.raak;
  });

  if (!items.length) {
    el.innerHTML = '<div class="cat-empty">Niets gevonden.</div>';
    return;
  }

  // Slepen kan alleen in de volledige lijst: bij een actief zoekfilter zie je
  // maar een deel, en dan zou "naar boven slepen" een onvoorspelbare plek geven.
  const kanSlepen = !f;

  el.innerHTML = items.map(c => `
    <div class="cat-item${c.id === activeId ? ' active' : ''}" data-id="${c.id}" role="button" tabindex="0">
      ${kanSlepen ? '<span class="cat-grip" title="Sleep omhoog of omlaag om te verplaatsen">⠿</span>' : ''}
      <span class="cat-text">${esc(c.label)}${c.scope ? `<span class="scope">${esc(c.scope)}</span>` : ''}${
        treffers.has(c.id) ? `<span class="treffer">${esc(treffers.get(c.id))}</span>` : ''
      }</span>
    </div>
  `).join('');

  el.querySelectorAll('.cat-item').forEach(rij => {
    rij.addEventListener('click', () => {
      if (netGesleept) return;          // niet openen na afloop van een sleep
      openCategory(rij.dataset.id);
    });
    rij.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCategory(rij.dataset.id); }
    });
  });

  if (kanSlepen) {
    el.querySelectorAll('.cat-grip').forEach(grip => {
      grip.addEventListener('pointerdown', e => startSlepen(e, grip.closest('.cat-item')));
    });
  }
}

// ===== VOLGORDE AANPASSEN DOOR SLEPEN =====
// Pointer events i.p.v. HTML5 drag-and-drop: dat laatste werkt niet op touch,
// en deze app wordt vooral op de telefoon gebruikt.
let sleepState = null;
let netGesleept = false;
let autoScrollTimer = null;

function startSlepen(e, rij) {
  if (!rij || e.button > 0) return;
  e.preventDefault();

  sleepState = { rij: rij, pointerId: e.pointerId, verplaatst: false };
  rij.classList.add('slepend');
  try { rij.setPointerCapture(e.pointerId); } catch (err) {}

  document.addEventListener('pointermove', tijdensSlepen);
  document.addEventListener('pointerup', stopSlepen);
  document.addEventListener('pointercancel', stopSlepen);
}

function tijdensSlepen(e) {
  if (!sleepState) return;
  e.preventDefault();
  sleepState.verplaatst = true;

  const lijst = document.getElementById('catList');
  const y = e.clientY;

  // bepaal achter welk item de gesleepte rij hoort
  const andere = [...lijst.querySelectorAll('.cat-item:not(.slepend)')];
  let erachter = null;
  for (const it of andere) {
    const r = it.getBoundingClientRect();
    if (y > r.top + r.height / 2) erachter = it;
  }
  if (erachter) erachter.after(sleepState.rij);
  else lijst.prepend(sleepState.rij);

  autoScroll(y);
}

// meescrollen als je bij de rand van de lijst komt
function autoScroll(y) {
  const kolom = document.getElementById('sidebar');
  const r = kolom.getBoundingClientRect();
  const rand = 60;
  let stap = 0;
  if (y < r.top + rand) stap = -8;
  else if (y > r.bottom - rand) stap = 8;

  clearInterval(autoScrollTimer);
  if (stap) autoScrollTimer = setInterval(() => { kolom.scrollTop += stap; }, 16);
}

function stopSlepen(e) {
  if (!sleepState) return;
  clearInterval(autoScrollTimer);
  document.removeEventListener('pointermove', tijdensSlepen);
  document.removeEventListener('pointerup', stopSlepen);
  document.removeEventListener('pointercancel', stopSlepen);

  const rij = sleepState.rij;
  const wasVerplaatst = sleepState.verplaatst;
  rij.classList.remove('slepend');
  try { rij.releasePointerCapture(sleepState.pointerId); } catch (err) {}
  sleepState = null;

  if (!wasVerplaatst) return;

  // nieuwe volgorde uit de DOM overnemen
  const nieuweVolgorde = [...document.querySelectorAll('#catList .cat-item')]
    .map(el => categories.find(c => c.id === el.dataset.id))
    .filter(Boolean);

  if (nieuweVolgorde.length === categories.length) {
    categories = nieuweVolgorde;
    saveCategories();
    toast('↕️ Volgorde opgeslagen');
  }

  // voorkom dat de klik na het loslaten de categorie opent
  netGesleept = true;
  setTimeout(() => { netGesleept = false; }, 50);
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
  area.innerHTML = notes[id] || '';
  clearTimeout(saveTimer);
  document.getElementById('saveStatus').textContent = '';

  // videoveld leegmaken bij wisselen van onderwerp, zodat een half ingevulde
  // link niet per ongeluk bij de verkeerde categorie belandt
  document.getElementById('videoUrl').value = '';
  document.getElementById('videoTitel').value = '';
  document.getElementById('videoError').classList.remove('show');
  renderVideos();

  document.getElementById('linkUrl').value = '';
  document.getElementById('linkTitel').value = '';
  document.getElementById('linkError').classList.remove('show');
  renderLinks();

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
    notes[activeId] = document.getElementById('notesArea').innerHTML;
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
  if (!confirm(`"${cat.label}" en alle bijbehorende aantekeningen, video's en links verwijderen?`)) return;
  categories = categories.filter(c => c.id !== activeId);
  delete notes[activeId];
  delete videos[activeId];
  delete links[activeId];
  saveCategories();
  saveNotes();
  saveVideos();
  saveLinks();
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

// toolbar: mousedown i.p.v. click, anders raakt de selectie kwijt bij het aanklikken
document.getElementById('notesToolbar').addEventListener('mousedown', e => {
  const btn = e.target.closest('button');
  if (!btn || !btn.dataset.cmd) return;   // bijv. de uitklapknop: geen opmaakknop
  e.preventDefault();
  opmaakKnop(btn.dataset.cmd);
});

// plakken zonder meegekomen opmaak van websites/Word
document.getElementById('notesArea').addEventListener('paste', e => {
  e.preventDefault();
  const tekst = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, tekst);
});
document.getElementById('addCatBtn').addEventListener('click', addCategory);
document.getElementById('delCatBtn').addEventListener('click', deleteCategory);
document.getElementById('backBtn').addEventListener('click', closeDetail);
// notitieveld groter/kleiner; keuze onthouden
const STORAGE_UITKLAP = 'krnNotesUitgeklapt';

function pasUitklapToe() {
  const area = document.getElementById('notesArea');
  const btn = document.getElementById('uitklapBtn');
  const uit = area.classList.contains('uitgeklapt');
  btn.textContent = uit ? '⤡ Kleiner' : '⤢ Groter';
  btn.title = uit ? 'Notitieveld weer inkorten' : 'Hele notitie in één keer tonen';
}

document.getElementById('uitklapBtn').addEventListener('click', () => {
  const area = document.getElementById('notesArea');
  area.classList.toggle('uitgeklapt');
  try { localStorage.setItem(STORAGE_UITKLAP, area.classList.contains('uitgeklapt') ? '1' : '0'); } catch (e) {}
  pasUitklapToe();
});

try {
  if (localStorage.getItem(STORAGE_UITKLAP) === '1') {
    document.getElementById('notesArea').classList.add('uitgeklapt');
  }
} catch (e) {}
pasUitklapToe();

document.getElementById('videoAddBtn').addEventListener('click', addVideo);
document.getElementById('videoUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('videoTitel').focus();
});
document.getElementById('videoTitel').addEventListener('keydown', e => {
  if (e.key === 'Enter') addVideo();
});
document.getElementById('linkAddBtn').addEventListener('click', addLink);
document.getElementById('linkUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('linkTitel').focus();
});
document.getElementById('linkTitel').addEventListener('keydown', e => {
  if (e.key === 'Enter') addLink();
});
