// palet.js — het zoekpalet: vanaf elke pagina in één keer naar een ander
// hulpmiddel of onderwerp. Openen met de zoekknop in de balk, met de toets /
// of met Ctrl+K (⌘K). Typen filtert, pijltjes kiezen, Enter opent, Esc sluit.
//
// Zonder zoekterm staat bovenaan wat je het laatst opende; dat is tijdens een
// consult meestal precies wat je weer nodig hebt.
//
// Leest alles uit KRN (kern.js); dit bestand moet daar dus na komen.
(function () {
  'use strict';
  if (!window.KRN) return;

  var el, invoer, lijstEl;
  var keuzes = [];      // wat er nu in de lijst staat, in volgorde
  var actief = 0;       // welke daarvan gekozen is
  var vorigeFocus = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // De treffer in de naam vet zetten. Zoeken gaat zonder accenten en
  // hoofdletters; de posities kloppen zolang de tekst daardoor niet van lengte
  // verandert, en anders blijft de naam gewoon onbewerkt.
  function metTreffer(tekst, nq) {
    var n = KRN.normaliseer(tekst);
    var i = nq ? n.indexOf(nq) : -1;
    if (i < 0 || n.length !== tekst.length) return esc(tekst);
    return esc(tekst.slice(0, i)) + '<mark>' + esc(tekst.slice(i, i + nq.length)) + '</mark>' +
      esc(tekst.slice(i + nq.length));
  }

  // ---------- zoeken ----------
  function hmKeuze(h) {
    return { soort: 'hm', titel: h.kort, sub: KRN.groepNaam(h.groep), url: h.url,
             groep: h.groep, extern: KRN.isExtern(h.url) };
  }

  function zoek(q) {
    var nq = KRN.normaliseer(q.trim());
    var alle = KRN.hulpmiddelen();
    var secties = [];

    if (!nq) {
      var recent = KRN.recenteHulpmiddelen();
      if (recent.length) secties.push({ kop: 'Laatst geopend', rijen: recent.map(hmKeuze) });
      (typeof HM_GROEPEN !== 'undefined' ? HM_GROEPEN : []).forEach(function (g) {
        var rijen = alle.filter(function (h) { return h.groep === g.id; }).map(hmKeuze);
        if (rijen.length) secties.push({ kop: g.naam, rijen: rijen });
      });
      return secties;
    }

    // hulpmiddelen: een treffer in de naam weegt zwaarder dan een in de zoekwoorden
    var hm = [];
    alle.forEach(function (h) {
      var kort = KRN.normaliseer(h.kort);
      var score = kort.indexOf(nq) === 0 ? 0 : kort.indexOf(nq) > 0 ? 1 :
        KRN.normaliseer(h.label + ' ' + h.cat).indexOf(nq) >= 0 ? 2 :
        KRN.normaliseer(h.zoek).indexOf(nq) >= 0 ? 3 : -1;
      if (score >= 0) hm.push({ score: score, h: h });
    });
    hm.sort(function (a, b) { return a.score - b.score; });
    if (hm.length) secties.push({ kop: 'Hulpmiddelen', rijen: hm.map(function (x) { return hmKeuze(x.h); }) });

    var onder = [];
    KRN.indeling().forEach(function (c) {
      var naam = KRN.normaliseer(c.label);
      var score = naam.indexOf(nq) === 0 ? 0 : naam.indexOf(nq) > 0 ? 1 :
        KRN.normaliseer(c.scope).indexOf(nq) >= 0 ? 2 :
        KRN.normaliseer(c.zoekwoorden).indexOf(nq) >= 0 ? 3 : -1;
      if (score >= 0) onder.push({ score: score, c: c });
    });
    onder.sort(function (a, b) { return a.score - b.score; });
    if (onder.length) {
      secties.push({ kop: 'Onderwerpen', rijen: onder.slice(0, 6).map(function (x) {
        return { soort: 'onderwerp', titel: x.c.label, sub: x.c.scope || 'Onderwerp',
                 url: 'index.html#onderwerp=' + encodeURIComponent(x.c.id), groep: null };
      }) });
    }
    return secties;
  }

  // ---------- tekenen ----------
  function teken() {
    var q = invoer.value;
    var nq = KRN.normaliseer(q.trim());
    var secties = zoek(q);
    keuzes = [];
    var html = secties.map(function (s) {
      return '<div class="krn-palet-sectie">' + esc(s.kop) + '</div>' + s.rijen.map(function (r) {
        var i = keuzes.push(r) - 1;
        var tegel = r.soort === 'hm' ? KRN.groepTegel(r.groep, r.titel)
          : '<span class="krn-tegel krn-tegel-onderwerp">' + KRN.icoon('onderwerp') + '</span>';
        return '<a class="krn-palet-rij" role="option" data-i="' + i + '" href="' + esc(r.url) + '">' +
          tegel +
          '<span class="krn-palet-tekst"><span class="krn-palet-titel">' + metTreffer(r.titel, nq) +
          '</span><span class="krn-palet-sub">' + esc(r.sub) + '</span></span>' +
          (r.extern ? KRN.icoon('extern', 'krn-palet-extern') : '') + '</a>';
      }).join('');
    }).join('');

    lijstEl.innerHTML = html ||
      '<div class="krn-palet-leeg">Niets gevonden voor “' + esc(q.trim()) + '”.</div>';
    actief = 0;
    markeer();
  }

  function markeer() {
    var rijen = lijstEl.querySelectorAll('.krn-palet-rij');
    for (var i = 0; i < rijen.length; i++) {
      var aan = (i === actief);
      rijen[i].classList.toggle('actief', aan);
      rijen[i].setAttribute('aria-selected', aan ? 'true' : 'false');
      if (aan && rijen[i].scrollIntoView) rijen[i].scrollIntoView({ block: 'nearest' });
    }
  }

  // ---------- openen en sluiten ----------
  function kies(i) {
    var r = keuzes[i];
    if (!r) return;
    if (r.soort === 'hm') KRN.recentErbij(r.url);
    sluit();
    location.href = r.url;
  }

  function open() {
    if (!el) bouw();
    if (!el.hidden) return;
    vorigeFocus = document.activeElement;
    invoer.value = '';
    el.hidden = false;
    document.documentElement.classList.add('krn-palet-open');
    teken();
    // een tel later, zodat de overgang zichtbaar is en het toetsenbord opkomt
    requestAnimationFrame(function () { el.classList.add('zichtbaar'); invoer.focus(); });
  }

  function sluit() {
    if (!el || el.hidden) return;
    el.classList.remove('zichtbaar');
    el.hidden = true;
    document.documentElement.classList.remove('krn-palet-open');
    if (vorigeFocus && vorigeFocus.focus) { try { vorigeFocus.focus(); } catch (e) {} }
  }

  function bouw() {
    el = document.createElement('div');
    el.className = 'krn-palet';
    el.hidden = true;
    el.innerHTML =
      '<div class="krn-palet-vlak" role="dialog" aria-modal="true" aria-label="Zoeken in het naslagwerk">' +
        '<div class="krn-palet-kop">' + KRN.icoon('zoek') +
          '<input type="text" inputmode="search" enterkeyhint="go" class="krn-palet-invoer" ' +
            'placeholder="Zoek een hulpmiddel of onderwerp" autocomplete="off" ' +
            'autocapitalize="off" spellcheck="false" aria-label="Zoekterm">' +
          '<button type="button" class="krn-palet-sluit" aria-label="Sluiten">esc</button>' +
        '</div>' +
        '<div class="krn-palet-lijst" role="listbox"></div>' +
        '<div class="krn-palet-voet"><span><kbd>↑</kbd><kbd>↓</kbd> kiezen</span>' +
          '<span><kbd>↵</kbd> openen</span><span><kbd>esc</kbd> sluiten</span></div>' +
      '</div>';
    document.body.appendChild(el);
    invoer = el.querySelector('.krn-palet-invoer');
    lijstEl = el.querySelector('.krn-palet-lijst');

    invoer.addEventListener('input', teken);
    el.querySelector('.krn-palet-sluit').addEventListener('click', sluit);
    // tik naast het vlak sluit
    el.addEventListener('mousedown', function (e) { if (e.target === el) sluit(); });

    lijstEl.addEventListener('click', function (e) {
      var rij = e.target.closest('.krn-palet-rij');
      if (!rij) return;
      e.preventDefault();
      kies(Number(rij.dataset.i));
    });
    lijstEl.addEventListener('mousemove', function (e) {
      var rij = e.target.closest('.krn-palet-rij');
      if (!rij || Number(rij.dataset.i) === actief) return;
      actief = Number(rij.dataset.i);
      markeer();
    });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); sluit(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); actief = Math.min(actief + 1, keuzes.length - 1); markeer(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); actief = Math.max(actief - 1, 0); markeer(); }
      else if (e.key === 'Enter') { e.preventDefault(); kies(actief); }
    });
  }

  // ---------- sneltoetsen ----------
  function inTekstveld(t) {
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (el && !el.hidden) sluit(); else open();
      return;
    }
    // de toets / opent het palet, behalve als je ergens aan het typen bent
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !inTekstveld(e.target)) {
      e.preventDefault();
      open();
    }
  });

  KRN.openPalet = open;
  KRN.sluitPalet = sluit;
})();
