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
  `cd tests && ./alles.sh test_rook.py test_dossier.py`. `alles.sh` kijkt ook naar exitcode,
  tracebacks en console-errors — niet alleen naar regels die met FAIL beginnen. Een suite die
  halverwege crasht gaf eerder "0 fails" en werd ten onrechte als groen gelezen.
- **Een test die faalt na een bedoelde wijziging**: eerst nagaan of de code klopt, dan de
  verwachting bijwerken — en in het antwoord zeggen dat de test is aangepast, niet alleen dat
  alles groen is.
- **Zelf nakijken op telefoonbreedte** (390 px). Geen horizontale scroll, geen afgesneden tabel.
- **Nieuwe pagina?** Dan ook: opnemen in `APP_BESTANDEN` in `sw.js`, een knop in `app.js`, en
  zoekwoorden zodat de pagina terug te vinden is. Geef die knop `kort`, `icoon` en `groep` mee,
  anders staat de pagina niet in het hulpmiddelenoverzicht op het startscherm.

## Hoe de app in elkaar zit

- `index.html` + `app.js`: de categorieën met zoekwoorden en `directLinks` naar de losse pagina's.
- Eén pagina is één bestand: eigen `<style>`, eigen `<script>`, geen gedeelde JS-modules behalve
  de data-bestanden.
- **CSS-prefix per pagina** om botsingen te voorkomen: `do-` (dosering), `rcp-`/`ro-`, `bd-`,
  `po-` (perioperatief), `cc-` (claude-code), `nb-` (neurogene blaas), `mt-`. Nieuwe pagina:
  nieuwe prefix.
- **Klinische getallen die twee pagina's gebruiken, staan in één bestand.** `rcp-data.js`
  (`window.RCP_APPENDIX2`) is de enige plek waar de RCP-doseringen staan; `dosering.html` en
  `rcp-spieren.html` lezen eruit. Niet overtypen in een tweede pagina.
- **`localStorage` alleen voor instellingen.** Wat per patiënt wordt ingevuld (gewicht, spieren,
  doses) wordt met opzet niet bewaard en verdwijnt bij het sluiten.
- `multiplier.js`, `fotos.js`: eveneens gedeelde data, zelfde regel.

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
