# Naslag Kinderrevalidatie — werkafspraken

Persoonlijk naslagwerk voor een revalidatiearts kindergeneeskunde. Statische site op GitHub
Pages, publiek maar onvindbaar (`robots.txt` + `noindex`), zonder wachtwoord. Geen build, geen
framework: losse HTML-pagina's, één `style.css`, één `app.js`.

## Harde regels

- **Geen patiëntgegevens.** Dit is een openbare pagina. Geen naam, geboortedatum of
  patiëntnummer — ook niet als voorbeeld, ook niet in een notitie of een spiernaam. Bij elk veld
  waar iets ingevuld wordt, moet dat op het scherm staan.
- **Verzin geen klinische getallen.** Een afkapwaarde, dosis, leeftijdsgrens of interval komt uit
  een bron die erbij genoemd wordt, of hij komt er niet in. Staat het niet in de bron, dan staat
  dát er: "niet in de richtlijn". Eerder vragen dan aannemen.
- **Bron erbij.** Welke richtlijn, welke editie, welk jaar. En of het overgetypt is uit een
  schermafbeelding of uit het document zelf — dat is niet hetzelfde.
- **Overgenomen materiaal alleen met een licentie die publiceren toestaat.** Dit is een openbare
  repo. Plaatjes, tekeningen of code van elders komen er alleen in als de licentie het toelaat,
  en dan mét de licentietekst in het bestand (zie `anatomie-data.js`, MIT). Geen beeld van het
  web "omdat het handig is", en geen materiaal van de instelling zonder dat de gebruiker zegt
  dat het mag.
- **Geen namen van personen.** Geen sprekers, geen collega's, geen auteurs-als-autoriteit.
  Instelling en richtlijn mogen genoemd worden.
- **Geen operatietechniek.** De gebruiker is revalidatiearts, geen operateur. Wat de chirurg
  technisch doet hoort er niet in; wat eromheen geregeld moet worden wel.
- **Afwijkingen in een bron benoemen, niet gladstrijken.** Een vreemde verhouding, een
  doorgehaald getal, een typefout in de brontabel: laat het zien in plaats van het stil te
  corrigeren.

## Bij elke wijziging

- **`CACHE_VERSIE` in `sw.js` omhoog.** Altijd. Anders blijven oude bestanden op de telefoon
  hangen en ziet de gebruiker zijn eigen wijziging niet. Dit is de fout die het vaakst gemaakt is.
- **Tests draaien.** `python3 -m http.server 9052` in de map, dan
  `cd tests && ./alles.sh test_rook.py test_dossier.py test_mdo.py test_kro.py test_start.py`. `alles.sh` kijkt ook naar exitcode,
  tracebacks en console-errors — niet alleen naar regels die met FAIL beginnen. Een suite die
  halverwege crasht gaf eerder "0 fails" en werd ten onrechte als groen gelezen.
- **Een test die faalt na een bedoelde wijziging**: eerst nagaan of de code klopt, dan de
  verwachting bijwerken — en in het antwoord zeggen dat de test is aangepast, niet alleen dat
  alles groen is.
- **Zelf nakijken op telefoonbreedte** (390 px). Geen horizontale scroll, geen afgesneden tabel.
- **Nieuwe pagina?** Dan ook: opnemen in `APP_BESTANDEN` in `sw.js`, een knop in `indeling.js`,
  en zoekwoorden zodat de pagina terug te vinden is. Geef die knop `kort` en `groep` mee, anders
  staat de pagina niet in het overzicht op het startscherm en niet in het zoekpalet. En zet
  onderaan de pagina de vier scripts: `indeling.js`, `kern.js`, `palet.js`, `inhoud.js` — dan
  krijgt hij vanzelf de balk, de zoekknop en 'op deze pagina'. `test_start.py` valt om als een
  pagina de balk mist.

## Hoe de app in elkaar zit

- `index.html` + `app.js`: het startscherm met de onderwerpen en je eigen aantekeningen.
- **`indeling.js` is de enige plek waar een hulpmiddel staat**: de onderwerpen met zoekwoorden en
  `directLinks` naar de losse pagina's, plus de groepen. Het startscherm en het zoekpalet lezen
  er allebei uit. Niet op een tweede plek bijhouden.
- **De gedeelde kern**, op elke pagina geladen:
  - `kern.js` — de balk bovenaan (terugknop, zoekknop), de lijniconen, de tweeletterige merkjes
    op de tegeltjes en 'laatst geopend';
  - `palet.js` — het zoekpalet (`/` of Ctrl+K): vanaf elke pagina naar een hulpmiddel of
    onderwerp;
  - `inhoud.js` — 'op deze pagina' (de h2-koppen van de pagina zelf) en de voortgangslijn.
  De opmaak hiervan staat in `style.css`, prefix `krn-`.
- **Een pagina bouwt zijn eigen balk niet meer.** `kern.js` vult de bestaande `header.topbar` aan,
  of maakt er een als hij ontbreekt.
- **Onderwerp openen via het adres:** `index.html#onderwerp=<id>`.
- **De titel in de balk is een knop naar het startscherm**, op elke pagina (`kern.js`).
- **Het app-icoon** komt uit `icoon-bron.svg` via `tests/maak-icoon.py`. Teken niet in de PNG's;
  die worden overschreven.
- Eén pagina is één bestand: eigen `<style>`, eigen `<script>`, geen gedeelde JS-modules behalve
  de data-bestanden.
- **CSS-prefix per pagina** om botsingen te voorkomen: `do-` (dosering), `rcp-`/`ro-`, `bd-`,
  `mdo-` (MDO-notitie), `kro-` (KRO-spreekuur), `cc-` (claude-code), `nb-` (neurogene blaas),
  `krn-` (de gedeelde kern: balk, palet, inhoud),
  `mt-`. Nieuwe pagina:
  nieuwe prefix.
- **Klinische getallen die twee pagina's gebruiken, staan in één bestand.** `rcp-data.js`
  (`window.RCP_APPENDIX2`) is de enige plek waar de RCP-doseringen staan; `dosering.html` en
  `rcp-spieren.html` lezen eruit. Niet overtypen in een tweede pagina.
- **`localStorage` alleen voor instellingen.** Wat per patiënt wordt ingevuld (gewicht, spieren,
  doses) wordt met opzet niet bewaard en verdwijnt bij het sluiten.
- `multiplier.js`, `fotos.js`: eveneens gedeelde data, zelfde regel.
- `epictekst.js` bevat `naarAscii()`: de opschoning voor tekst die in een dossiereditor geplakt
  wordt. `dosering.html`, `mdo-notitie.html` en `kro.html` gebruiken hem; niet opnieuw schrijven.
- **De Emla-smeerinstructie staat hier niet meer.** Die is een losse app geworden:
  `tblikman-dot/emla-smeerinstructie`, live op https://tblikman-dot.github.io/emla-smeerinstructie/ .
  De knop in `app.js` wijst daarheen. Wijzig de tekst of de foto's dus daar, niet hier, en zet
  er geen tweede kopie terug.

## Vormgeving

De vormtaal is die van apple.com, dezelfde als de Emla-app: systeemletter, veel wit,
grijstinten en één blauw accent. Niets van die site overgenomen; alleen de manier van vormgeven.

- **Alle kleuren komen uit de acht variabelen bovenaan `style.css`.** Elke pagina leest ze. Geen
  nieuwe vaste kleur voor iets wat een variabele kan zijn.
- **Geen emoji in de bediening.** Lijniconen uit `kern.js` (`KRN.icoon`) of kale woorden. De
  knopteksten in `indeling.js` beginnen nog met een emoji; `knopTekst()` haalt die er bij het
  tonen af. De cijfers 1-4 bij de botulinestappen zijn een volgorde en blijven staan.
- **Alleen licht.** De pagina's hebben eigen vaste kleurvlakken (waarschuwingen, tekeningen) die
  op een donkere achtergrond niet nagekeken zijn. Een donkere stand is dus niet 'even aanzetten'.
- **Beweging is bijzaak.** Alles achter `prefers-reduced-motion`. Een animatie op `body > *` met
  `fill-mode: both` overschreef eerder de transform waarmee de toastmelding verstopt zit; daarom
  `backwards`, en zwevende lagen doen niet mee.
- **Let op met naampatronen.** De regel die de dubbele "Terug naar de naslag"-links verbergt
  (`a[class$="-terug"]`) verborg eerst ook de terugknop in de balk zelf. Er zit nu een toets op.

## Tekst voor het dossier (Epic)

In `dosering.html`, sectie *Voor het dossier*. De tekst moet zonder opmaakschade in een
dossiereditor te plakken zijn:

- Alleen ASCII (`naarAscii()` doet de vervanging en de accentstrip), LF, geen tabs, geen
  inspringing, geen regels die eindigen op een spatie, geen drie opeenvolgende newlines.
- Geen regel die begint met `- * + # > |` of met `1.` / `a)` — een tekstverwerker maakt daar een
  opsomming van en verbouwt de rest. `naarAscii()` zet er een punt en een spatie voor.
- Het klembord wordt opnieuw door `naarAscii()` gehaald bij het kopiëren; het tekstvak is een
  `<textarea>` zodat er `text/plain` op het klembord komt en geen HTML.
- **Eigen tekst van de gebruiker nooit overschrijven.** `dossierVuil` / `dossierAuto` houden bij
  of er met de hand in gewerkt is; dan komt er een knop *Bijwerken* in plaats van een stille
  overschrijving.
- Waarschuwingen die op het scherm staan, moeten ook in de tekst staan — anders staat er in het
  dossier een schema zonder de reden waarom het geknepen is.

## Git

- Commits gaan direct naar `main`. Geen PR voor deze app.
- Commitberichten in het Nederlands, één regel die zegt wat er inhoudelijk verandert
  (zie de geschiedenis: "Een spier kan niet twee keer geselecteerd worden").
- Geen modelnaam, geen gegenereerd-door-regel in de code, de commits of de pagina's.

## Toon

Nederlands, nuchter, korte zinnen. Geen uitroeptekens, geen marketing, geen "geweldig".
Onzekerheid wordt benoemd, niet weggeschreven. Wordt er een fout gevonden: zeggen wat er fout
was en doorgaan, zonder uitweiden.
