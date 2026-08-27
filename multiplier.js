// ============================================================================
// MULTIPLIER.JS - de multipliertabel van Paley, gedeeld door de rekenpagina's.
//
// Gebruikt door groeisturing.html en epifysiodese.html. Bewust een los bestand:
// de tabel is met de hand uit een PDF gelezen en op twee punten gecorrigeerd,
// en dat soort werk mag niet in twee kopieen uit elkaar gaan lopen.
//
// Levert vier dingen aan de pagina's:
//   MULTIPLIERS              de ruwe tabel
//   multiplierVoor()         factor bij een leeftijd
//   multiplierTot()          laatste leeftijd in de tabel voor dit geslacht
//   leeftijdBijMultiplier()  de omgekeerde weg: bij welke leeftijd hoort deze
//                            factor? Nodig om een uiterste operatieleeftijd
//                            terug te rekenen uit een benodigde correctie.
// ============================================================================

// ---------------------------------------------------------------------------
// MULTIPLIERTABEL (Paley e.a.), overgenomen uit Tabel 1 van:
//   Mills G, Nelson S. An improved spreadsheet for calculating limb length
//   discrepancy and epiphysiodesis timing using the multiplier method.
//   J Child Orthop 2016;10:313-319. Open access.
//
// Elke rij: [skeletleeftijd in jaren, factor jongens, factor meisjes].
// null bij meisjes = de tabel geeft daar geen waarde meer; ze zijn uitgegroeid.
//
// Twee dingen uit de bron die aandacht nodig hadden. Beide zijn hier verwerkt
// en staan ook zichtbaar op de pagina, zodat het controleerbaar blijft:
//
// 1. ZETFOUT. Bij 3,08 jaar staat voor meisjes 3,03 afgedrukt, terwijl de buren
//    2,05 (bij 3,00) en 2,01 (bij 3,17) zijn. Twee onafhankelijke uitlezingen
//    van de PDF geven allebei 3,03, dus het is een fout in de publicatie en
//    geen leesfout. Hier staat 2,03. Met 3,03 zou een verschil van 2 cm als
//    6 cm voorspeld worden in plaats van 4 cm. Nagerekend in de Multiplier-app
//    zelf (Bone Length, meisje 3 jr 1 mnd, 100 cm in -> 203,2 cm uit): die
//    gebruikt 2,032, dus de fout zit alleen in de gedrukte tabel.
// 2. ONTBREKENDE RIJ. De gedrukte tabel loopt in vier kolommen van 51 rijen:
//    204 van de 205 mogelijke leeftijden. Leeftijd 12,75 valt tussen kolom 3
//    (eindigt op 12,67) en kolom 4 (begint op 12,83) en ontbreekt daardoor.
//    Hier ingevuld als het midden tussen de buren.
//
// Na beide correcties daalt de reeks netjes monotoon naar 1,00; dat is
// gecontroleerd voor beide geslachten.
const MULT_ZETFOUT = { leeftijd: '3,08 jaar', gedrukt: '3,03', gebruikt: '2,03' };
const MULT_ONTBRAK = { leeftijd: '12,75 jaar' };

const MULTIPLIERS = [
  [0.00,5.08,4.63],[0.08,4.93,4.49],[0.17,4.77,4.35],[0.25,4.62,4.22],[0.33,4.47,4.08],
  [0.42,4.31,3.94],[0.50,4.16,3.8],[0.58,4.01,3.66],[0.67,3.85,3.52],[0.75,3.7,3.39],
  [0.83,3.55,3.25],[0.92,3.39,3.11],[1.00,3.24,2.97],[1.08,3.19,2.92],[1.17,3.13,2.87],
  [1.25,3.08,2.83],[1.33,3.02,2.78],[1.42,2.97,2.73],[1.50,2.92,2.68],[1.58,2.86,2.63],
  [1.67,2.81,2.58],[1.75,2.75,2.54],[1.83,2.7,2.49],[1.92,2.64,2.44],[2.00,2.59,2.39],
  [2.08,2.56,2.36],[2.17,2.53,2.33],[2.25,2.5,2.31],[2.33,2.47,2.28],[2.42,2.44,2.25],
  [2.50,2.41,2.22],[2.58,2.38,2.19],[2.67,2.35,2.16],[2.75,2.32,2.14],[2.83,2.29,2.11],
  [2.92,2.26,2.08],[3.00,2.23,2.05],[3.08,2.21,2.03],[3.17,2.19,2.01],[3.25,2.17,2.0],
  [3.33,2.15,1.98],[3.42,2.13,1.96],[3.50,2.12,1.94],[3.58,2.1,1.92],[3.67,2.08,1.9],
  [3.75,2.06,1.89],[3.83,2.04,1.87],[3.92,2.02,1.85],[4.00,2.0,1.83],[4.08,1.99,1.82],
  [4.17,1.97,1.8],[4.25,1.96,1.79],[4.33,1.94,1.77],[4.42,1.93,1.76],[4.50,1.91,1.75],
  [4.58,1.9,1.73],[4.67,1.88,1.72],[4.75,1.87,1.7],[4.83,1.85,1.69],[4.92,1.84,1.67],
  [5.00,1.82,1.66],[5.08,1.81,1.65],[5.17,1.8,1.64],[5.25,1.78,1.62],[5.33,1.77,1.61],
  [5.42,1.76,1.6],[5.50,1.75,1.59],[5.58,1.73,1.57],[5.67,1.72,1.56],[5.75,1.71,1.55],
  [5.83,1.7,1.54],[5.92,1.68,1.52],[6.00,1.67,1.51],[6.08,1.66,1.5],[6.17,1.65,1.5],
  [6.25,1.65,1.49],[6.33,1.64,1.48],[6.42,1.63,1.48],[6.50,1.62,1.47],[6.58,1.61,1.46],
  [6.67,1.6,1.46],[6.75,1.6,1.45],[6.83,1.59,1.44],[6.92,1.58,1.44],[7.00,1.57,1.43],
  [7.08,1.56,1.42],[7.17,1.55,1.41],[7.25,1.55,1.41],[7.33,1.54,1.4],[7.42,1.53,1.39],
  [7.50,1.52,1.38],[7.58,1.51,1.37],[7.67,1.5,1.36],[7.75,1.5,1.36],[7.83,1.49,1.35],
  [7.92,1.48,1.34],[8.00,1.47,1.33],[8.08,1.46,1.32],[8.17,1.46,1.32],[8.25,1.45,1.31],
  [8.33,1.44,1.31],[8.42,1.43,1.3],[8.50,1.43,1.3],[8.58,1.42,1.29],[8.67,1.41,1.28],
  [8.75,1.4,1.28],[8.83,1.4,1.27],[8.92,1.39,1.27],[9.00,1.38,1.26],[9.08,1.37,1.25],
  [9.17,1.37,1.25],[9.25,1.36,1.24],[9.33,1.36,1.24],[9.42,1.35,1.23],[9.50,1.35,1.23],
  [9.58,1.34,1.22],[9.67,1.33,1.21],[9.75,1.33,1.21],[9.83,1.32,1.2],[9.92,1.32,1.2],
  [10.00,1.31,1.19],[10.08,1.3,1.19],[10.17,1.3,1.18],[10.25,1.29,1.18],[10.33,1.29,1.17],
  [10.42,1.28,1.17],[10.50,1.28,1.16],[10.58,1.27,1.16],[10.67,1.26,1.15],[10.75,1.26,1.15],
  [10.83,1.25,1.14],[10.92,1.25,1.14],[11.00,1.24,1.13],[11.08,1.24,1.13],[11.17,1.23,1.12],
  [11.25,1.23,1.12],[11.33,1.22,1.11],[11.42,1.22,1.11],[11.50,1.21,1.1],[11.58,1.21,1.1],
  [11.67,1.2,1.09],[11.75,1.2,1.09],[11.83,1.19,1.08],[11.92,1.19,1.08],[12.00,1.18,1.07],
  [12.08,1.18,1.07],[12.17,1.17,1.06],[12.25,1.17,1.06],[12.33,1.16,1.06],[12.42,1.16,1.05],
  [12.50,1.16,1.05],[12.58,1.15,1.05],[12.67,1.15,1.04],[12.75,1.145,1.04],[12.83,1.14,1.04],
  [12.92,1.13,1.03],[13.00,1.13,1.03],[13.08,1.13,1.03],[13.17,1.12,1.03],[13.25,1.12,1.02],
  [13.33,1.11,1.02],[13.42,1.11,1.02],[13.50,1.11,1.02],[13.58,1.1,1.01],[13.67,1.1,1.01],
  [13.75,1.09,1.01],[13.83,1.09,1.01],[13.92,1.08,1.0],[14.00,1.08,1.0],[14.08,1.08,null],
  [14.17,1.07,null],[14.25,1.07,null],[14.33,1.07,null],[14.42,1.06,null],[14.50,1.06,null],
  [14.58,1.06,null],[14.67,1.05,null],[14.75,1.05,null],[14.83,1.05,null],[14.92,1.04,null],
  [15.00,1.04,null],[15.08,1.04,null],[15.17,1.04,null],[15.25,1.03,null],[15.33,1.03,null],
  [15.42,1.03,null],[15.50,1.03,null],[15.58,1.02,null],[15.67,1.02,null],[15.75,1.02,null],
  [15.83,1.02,null],[15.92,1.01,null],[16.00,1.01,null],[16.08,1.01,null],[16.17,1.01,null],
  [16.25,1.01,null],[16.33,1.01,null],[16.42,1.01,null],[16.50,1.01,null],[16.58,1.0,null],
  [16.67,1.0,null],[16.75,1.0,null],[16.83,1.0,null],[16.92,1.0,null],[17.00,1.0,null]
];

// Factor bij een leeftijd. Tussen twee tabelwaarden wordt lineair
// geinterpoleerd; boven de tabel is er geen groei meer, dus 1,00.
function multiplierVoor(leeftijd, geslacht) {
  const kol = (geslacht === 'jongen') ? 1 : 2;
  const eerste = MULTIPLIERS[0];
  const laatste = MULTIPLIERS[MULTIPLIERS.length - 1];

  if (leeftijd <= eerste[0]) return eerste[kol];
  if (leeftijd >= laatste[0]) return (laatste[kol] === null) ? 1.0 : laatste[kol];

  for (let i = 0; i < MULTIPLIERS.length - 1; i++) {
    const a = MULTIPLIERS[i], b = MULTIPLIERS[i + 1];
    if (leeftijd >= a[0] && leeftijd <= b[0]) {
      const va = a[kol], vb = b[kol];
      if (va === null && vb === null) return 1.0;   // meisje voorbij de tabel
      if (va === null) return vb;
      if (vb === null) return va;
      if (b[0] === a[0]) return va;
      return va + (vb - va) * (leeftijd - a[0]) / (b[0] - a[0]);
    }
  }
  return 1.0;
}

// Laatste leeftijd waarvoor de tabel voor dit geslacht nog een waarde geeft.
function multiplierTot(geslacht) {
  const kol = (geslacht === 'jongen') ? 1 : 2;
  for (let i = MULTIPLIERS.length - 1; i >= 0; i--) {
    if (MULTIPLIERS[i][kol] !== null) return MULTIPLIERS[i][0];
  }
  return 0;
}

// De omgekeerde weg: bij welke leeftijd hoort deze factor? De tabel daalt met
// de leeftijd, dus we zoeken van boven naar beneden naar het interval waarin de
// waarde valt en interpoleren daarbinnen lineair terug naar een leeftijd.
//
// Let op bij het lezen van de uitkomst: de tabel is op twee decimalen
// gepubliceerd, waardoor opeenvolgende leeftijden dezelfde factor delen. De
// teruggerekende leeftijd is daardoor tot ongeveer een maand onnauwkeurig en
// valt bij gelijke waarden op de jongste leeftijd binnen dat plateau - de
// voorzichtige kant, want dat is de vroegste datum.
function leeftijdBijMultiplier(factor, geslacht) {
  const kol = (geslacht === 'jongen') ? 1 : 2;
  const rijen = MULTIPLIERS.filter(r => r[kol] !== null);
  if (!isFinite(factor) || !rijen.length) return NaN;

  if (factor >= rijen[0][kol]) return rijen[0][0];

  const laatste = rijen[rijen.length - 1];
  if (factor <= laatste[kol]) {
    for (const r of rijen) if (r[kol] <= factor) return r[0];
    return laatste[0];
  }

  for (let i = 0; i < rijen.length - 1; i++) {
    const boven = rijen[i][kol], onder = rijen[i + 1][kol];
    if (boven >= factor && factor >= onder) {
      if (boven === onder) return rijen[i][0];
      const deel = (boven - factor) / (boven - onder);
      return rijen[i][0] + deel * (rijen[i + 1][0] - rijen[i][0]);
    }
  }
  return NaN;
}
