// kern.js — wat elke pagina van het naslagwerk deelt.
//
//  1. De balk bovenaan: op elke pagina dezelfde, met een terugknop naar het
//     startscherm en een zoekknop. Pagina's zonder balk krijgen er een.
//  2. De lijst met hulpmiddelen, afgeleid uit indeling.js (de enige bron).
//  3. 'Laatst geopend': welke hulpmiddelen je het laatst gebruikte. Dat is een
//     instelling van dit toestel, geen patiëntgegeven: er staat alleen in
//     wélke pagina's geopend zijn.
//  4. De lijniconen. Geen emoji: die ogen op elk toestel anders en rommelig.
//
// Het zoekpalet zelf staat in palet.js. Dit bestand moet na indeling.js komen.
(function () {
  'use strict';

  var OPSLAG_RECENT = 'krnLaatstGeopend';
  var MAX_RECENT = 5;
  var pagina = location.pathname.split('/').pop() || 'index.html';
  var isStart = (pagina === 'index.html');

  // ---------- iconen ----------
  var PAD = {
    zoek:   '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    terug:  '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
    extern: '<path d="M9.5 6.5h8v8M17.5 6.5L7 17"/>',
    klok:   '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    bewaar: '<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 19.5h14"/>',
    plus:   '<path d="M12 5v14M5 12h14"/>',
    pen:    '<path d="M4.5 19.5l1-4L16 5a1.8 1.8 0 0 1 2.6 0l.4.4a1.8 1.8 0 0 1 0 2.6L8.5 18.5z"/><path d="M14.5 6.5l3 3"/>',
    weg:    '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10 10.5v5.5M14 10.5v5.5"/>',
    camera: '<path d="M3.4 7.9h3l1.3-2.1h8.6l1.3 2.1h3a1.6 1.6 0 0 1 1.6 1.6v7.9a1.6 1.6 0 0 1-1.6 1.6H3.4a1.6 1.6 0 0 1-1.6-1.6V9.5a1.6 1.6 0 0 1 1.6-1.6Z"/><circle cx="12" cy="13.4" r="3.4"/>',
    onderwerp: '<path d="M5 7h14M5 12h14M5 17h9"/>',
    // één icoon per groep hulpmiddelen
    cp:     '<path d="M14.5 4.5l5 5M17 7l-8.6 8.6a2 2 0 0 1-1.4.6H5.5v-1.5a2 2 0 0 1 .6-1.4L14.7 4.7M5.5 18.5L3 21M10.5 10l2 2M13 7.5l2 2"/>',
    heup:   '<circle cx="12.5" cy="9.5" r="3.3"/><path d="M5.5 7.5a8 8 0 0 1 14 0M11 12.5L9 20.5M14.5 12.2l1.5 8.3"/>',
    been:   '<rect x="3" y="8.5" width="18" height="7.5" rx="1.5"/><path d="M7 8.5v3M11 8.5v4M15 8.5v3M19 8.5v2"/>',
    zenuw:  '<path d="M12 21v-6.5M12 14.5c0-4-5-3.5-5-7.5M12 14.5c0-4 5-3.5 5-7.5M12 14.5V5.5"/><circle cx="7" cy="5.5" r="1.4"/><circle cx="17" cy="5.5" r="1.4"/><circle cx="12" cy="4" r="1.4"/>',
    ok:     '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3.2h6v1.3M8.8 12.8l2.2 2.2 4.2-4.4"/>',
    opleiden: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5v4.2c1.6 1.5 3.4 2.2 5.5 2.2s3.9-.7 5.5-2.2v-4.2M21.5 9.5v5"/>',
    app:    '<path d="M8.5 8l-4 4 4 4M15.5 8l4 4-4 4M13.2 6l-2.4 12"/>',
  };

  function icoon(naam, klas) {
    return '<svg class="krn-icoon' + (klas ? ' ' + klas : '') + '" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + (PAD[naam] || PAD.app) + '</svg>';
  }

  // Twee letters uit de naam, als merkje op het tegeltje. Afgeleid, dus er hoeft
  // niets extra bijgehouden te worden: 'GMFCS per leeftijd' wordt GM,
  // 'Spastisch of dystoon?' wordt Sd, 'Emla-smeerinstructie' wordt Em.
  // Een icoon per groep bleek misleidend: dan kreeg GMFCS een injectiespuit.
  var STOP = { of: 1, per: 1, en: 1, voor: 1, na: 1, van: 1, de: 1, het: 1, volgens: 1, wat: 1 };
  function merk(naam) {
    var woorden = String(naam || '').split(/[\s\-:&/]+/).map(function (w) {
      return w.replace(/[^A-Za-z\u00C0-\u024F]/g, '');
    }).filter(function (w) { return w && !STOP[w.toLowerCase()]; });
    if (!woorden.length) return '\u2022';
    var een = woorden[0];
    // een afkorting in hoofdletters (GMFCS, KRO, MDO) levert zijn eerste twee letters
    if (een.length > 1 && een === een.toUpperCase()) return een.slice(0, 2);
    if (woorden.length === 1) return een.charAt(0).toUpperCase() + een.charAt(1).toLowerCase();
    // een afkorting als tweede woord (DDH) houdt zijn hoofdletter
    var twee = woorden[1];
    var t = (twee.length > 1 && twee === twee.toUpperCase()) ? twee.charAt(0) : twee.charAt(0).toLowerCase();
    return een.charAt(0).toUpperCase() + t;
  }

  // Een gekleurd tegeltje met het merkje; de tint per groep komt uit style.css.
  function groepTegel(groep, naam) {
    var g = PAD[groep] ? groep : 'app';
    return '<span class="krn-tegel krn-tegel-' + g + '" aria-hidden="true">' +
      (naam ? merk(naam) : icoon(g)) + '</span>';
  }

  // ---------- hulpmiddelen ----------
  // Op het startscherm bestaat de levende lijst 'categories' (met wat de
  // gebruiker zelf toevoegde); op de andere pagina's alleen de standaardindeling.
  function indeling() {
    if (typeof categories !== 'undefined' && categories && categories.length) return categories;
    return (typeof DEFAULT_CATS !== 'undefined') ? DEFAULT_CATS : [];
  }

  function hulpmiddelen() {
    var gezien = {}, uit = [];
    indeling().forEach(function (cat) {
      (cat.directLinks || []).forEach(function (l) {
        if (!l.kort || gezien[l.url]) return;
        gezien[l.url] = true;
        uit.push({ kort: l.kort, url: l.url, groep: l.groep || 'app',
                   label: l.label, cat: cat.label, zoek: l.zoek || '' });
      });
    });
    return uit;
  }

  function groepNaam(id) {
    var lijst = (typeof HM_GROEPEN !== 'undefined') ? HM_GROEPEN : [];
    for (var i = 0; i < lijst.length; i++) if (lijst[i].id === id) return lijst[i].naam;
    return '';
  }

  function isExtern(url) { return /^https?:/i.test(url); }

  // zonder hoofdletters en accenten, zodat 'epifysiodese' ook 'Epifysiodese' vindt
  function normaliseer(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // ---------- laatst geopend ----------
  function recentLijst() {
    try {
      var l = JSON.parse(localStorage.getItem(OPSLAG_RECENT) || '[]');
      return Array.isArray(l) ? l.filter(function (u) { return typeof u === 'string'; }) : [];
    } catch (e) { return []; }
  }

  function recentErbij(url) {
    if (!url) return;
    var l = recentLijst().filter(function (u) { return u !== url; });
    l.unshift(url);
    try { localStorage.setItem(OPSLAG_RECENT, JSON.stringify(l.slice(0, MAX_RECENT))); } catch (e) {}
  }

  // de hulpmiddelen die bij de bewaarde adressen horen, nieuwste eerst
  function recenteHulpmiddelen() {
    var alle = hulpmiddelen();
    return recentLijst().map(function (u) {
      return alle.filter(function (h) { return h.url === u; })[0];
    }).filter(Boolean);
  }

  // Is deze pagina zelf een hulpmiddel? Dan telt het openen ervan mee.
  if (!isStart) {
    var ikzelf = hulpmiddelen().filter(function (h) { return h.url === pagina; })[0];
    if (ikzelf) recentErbij(ikzelf.url);
  }

  // ---------- de balk ----------
  function maakBalk() {
    var balk = document.querySelector('header.topbar');
    if (!balk) {
      // vier pagina's hadden geen balk; die krijgen dezelfde als de rest
      var kop = document.querySelector('h1');
      balk = document.createElement('header');
      balk.className = 'topbar';
      balk.innerHTML = '<div class="topbar-title"></div>';
      balk.firstChild.textContent = kop ? kop.textContent.trim() : document.title;
      document.body.insertBefore(balk, document.body.firstChild);
    }
    balk.classList.add('krn-balk');

    if (!isStart && !balk.querySelector('.krn-terug')) {
      var terug = document.createElement('a');
      terug.className = 'krn-terug';
      terug.href = 'index.html';
      terug.setAttribute('aria-label', 'Terug naar het startscherm');
      terug.innerHTML = icoon('terug') + '<span>Naslag</span>';
      balk.insertBefore(terug, balk.firstChild);
    }

    if (!balk.querySelector('.krn-zoekknop')) {
      var zoek = document.createElement('button');
      zoek.type = 'button';
      zoek.className = 'krn-zoekknop';
      zoek.setAttribute('aria-label', 'Zoeken en springen naar een hulpmiddel');
      zoek.title = 'Zoeken (toets / of Ctrl+K)';
      zoek.innerHTML = icoon('zoek');
      zoek.addEventListener('click', function () {
        if (window.KRN && KRN.openPalet) KRN.openPalet();
      });
      // op het startscherm vóór de back-upknop, anders helemaal rechts
      var eersteKnop = balk.querySelector('.add-cat-btn');
      if (eersteKnop) balk.insertBefore(zoek, eersteKnop); else balk.appendChild(zoek);
    }

    // Een tik op de titel in de balk brengt je naar het startscherm, vanaf
    // elke pagina. Op het startscherm zelf sluit hij een geopend onderwerp en
    // gaat hij naar boven.
    var titel = balk.querySelector('.topbar-title');
    if (titel && !titel.dataset.krnThuis) {
      titel.dataset.krnThuis = '1';
      titel.setAttribute('role', 'link');
      titel.setAttribute('tabindex', '0');
      titel.title = 'Naar het startscherm';
      var naarHuis = function () {
        if (!isStart) { location.href = 'index.html'; return; }
        if (typeof closeDetail === 'function') closeDetail();
        var vlak = document.getElementById('detail');
        if (vlak) vlak.scrollTop = 0;
        window.scrollTo(0, 0);
      };
      titel.addEventListener('click', naarHuis);
      titel.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); naarHuis(); }
      });
    }

    // de titel blijft in het midden: links en rechts even breed houden
    balk.classList.toggle('krn-balk-start', isStart);
  }

  maakBalk();

  window.KRN = {
    icoon: icoon,
    groepTegel: groepTegel,
    merk: merk,
    groepNaam: groepNaam,
    hulpmiddelen: hulpmiddelen,
    indeling: indeling,
    isExtern: isExtern,
    normaliseer: normaliseer,
    recenteHulpmiddelen: recenteHulpmiddelen,
    recentErbij: recentErbij,
    isStart: isStart,
  };
})();
