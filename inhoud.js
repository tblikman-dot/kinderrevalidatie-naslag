// inhoud.js — de weg vinden binnen een lange pagina.
//
//  1. 'Op deze pagina': een knop in de balk die de koppen van de pagina laat
//     zien; een tik en je staat er. De lijst komt uit de h2-koppen die de
//     pagina zelf al heeft, er wordt niets bij verzonnen. Hij wordt opgebouwd
//     op het moment van openen, zodat een pagina met tabbladen (KRO, MDO)
//     alleen de koppen van het zichtbare tabblad toont.
//  2. Een dunne voortgangslijn onder de balk: hoe ver je in de pagina bent.
//
// Alleen op de losse pagina's, niet op het startscherm. Komt na kern.js.
(function () {
  'use strict';
  if (!window.KRN || KRN.isStart) return;
  var balk = document.querySelector('header.topbar');
  if (!balk) return;

  function zichtbareKoppen() {
    var uit = [];
    document.querySelectorAll('h2').forEach(function (h) {
      if (h.closest('.krn-palet, .krn-inhoud')) return;
      // offsetParent is null zodra de kop (of een ouder) verborgen is
      if (!h.offsetParent) return;
      var tekst = (h.textContent || '').replace(/\s+/g, ' ').trim();
      if (tekst) uit.push({ el: h, tekst: tekst });
    });
    return uit;
  }

  // ---------- op deze pagina ----------
  var vlak = null;

  function sluit() {
    if (!vlak) return;
    vlak.remove();
    vlak = null;
    knop.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', buitenKlik, true);
    document.removeEventListener('keydown', toets, true);
  }
  function buitenKlik(e) {
    if (vlak && !vlak.contains(e.target) && !knop.contains(e.target)) sluit();
  }
  function toets(e) { if (e.key === 'Escape') { e.stopPropagation(); sluit(); } }

  function open() {
    var koppen = zichtbareKoppen();
    vlak = document.createElement('div');
    vlak.className = 'krn-inhoud';
    vlak.setAttribute('role', 'menu');
    var kop = document.createElement('div');
    kop.className = 'krn-inhoud-kop';
    kop.textContent = 'Op deze pagina';
    vlak.appendChild(kop);
    koppen.forEach(function (k, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'krn-inhoud-rij';
      b.setAttribute('role', 'menuitem');
      b.innerHTML = '<span class="krn-inhoud-nr">' + (i + 1) + '</span>';
      var t = document.createElement('span');
      t.textContent = k.tekst;
      b.appendChild(t);
      b.addEventListener('click', function () {
        sluit();
        k.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      vlak.appendChild(b);
    });
    document.body.appendChild(vlak);
    knop.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', buitenKlik, true);
    document.addEventListener('keydown', toets, true);
  }

  var knop = document.createElement('button');
  knop.type = 'button';
  knop.className = 'krn-inhoudknop';
  knop.setAttribute('aria-label', 'Op deze pagina: spring naar een onderdeel');
  knop.setAttribute('aria-expanded', 'false');
  knop.title = 'Op deze pagina';
  knop.innerHTML = KRN.icoon('onderwerp');
  knop.addEventListener('click', function () { if (vlak) sluit(); else open(); });

  // Pas tonen als er echt iets te kiezen valt. Het aantal zichtbare koppen kan
  // veranderen (tabbladen), dus dit wordt bij elke wijziging opnieuw bekeken.
  function werkKnopBij() { knop.hidden = zichtbareKoppen().length < 3; }
  // eigen klasse, niet die van de zoekknop: anders zijn er twee 'zoekknoppen'
  var zoek = balk.querySelector('.krn-zoekknop');
  balk.insertBefore(knop, zoek);
  werkKnopBij();
  document.addEventListener('click', function () { setTimeout(werkKnopBij, 60); });

  // ---------- voortgangslijn ----------
  var lijn = document.createElement('div');
  lijn.className = 'krn-voortgang';
  lijn.setAttribute('aria-hidden', 'true');
  balk.appendChild(lijn);
  var bezig = false;
  function meet() {
    bezig = false;
    var d = document.documentElement;
    var ruimte = d.scrollHeight - d.clientHeight;
    // op een korte pagina zegt zo'n lijn niets
    var deel = ruimte > d.clientHeight * 0.6 ? Math.min(1, Math.max(0, d.scrollTop / ruimte)) : 0;
    lijn.style.transform = 'scaleX(' + deel.toFixed(4) + ')';
  }
  window.addEventListener('scroll', function () {
    if (!bezig) { bezig = true; requestAnimationFrame(meet); }
  }, { passive: true });
  window.addEventListener('resize', meet);
  meet();
})();
