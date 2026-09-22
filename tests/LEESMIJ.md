# Tests

Playwright-tests voor de app. Ze stonden eerder buiten de repo en verdwenen
toen de werkomgeving opnieuw werd opgezet; daarom staan ze nu hier.

## Draaien

```
python3 -m http.server 9052          # in de map met de html-bestanden
cd tests && ./alles.sh test_rook.py test_dossier.py
```

`alles.sh` kijkt niet alleen naar regels die met FAIL beginnen, maar ook naar
de exitcode, naar tracebacks en naar console-errors. Dat is er met opzet in
gezet: een suite die halverwege crasht gaf eerder "0 fails" en werd ten
onrechte als groen gelezen.

## Wat waar getoetst wordt

- `test_rook.py` — elke pagina opent zonder console-errors, zonder 4xx en
  zonder horizontale scroll op 390px, plus de kern van de doseringsplanner.
- `test_dossier.py` — de tekst voor het dossier: alleen ASCII, geen tabs,
  geen inspringing, geen regel die een tekstverwerker tot opsomming maakt,
  geen tekens die in een dossiereditor een eigen betekenis hebben, kloppende
  subtotalen, en het klembord dat gelijk is aan het tekstvak.

`hulp.py` bevat de gedeelde handgrepen (een spierkaart opzoeken, splitsen,
aantal plaatsen zetten). Spierkaarten worden hertekend, dus zoek ze elke
keer opnieuw op in plaats van een index vast te houden.
