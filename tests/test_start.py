# De gedeelde kern van het naslagwerk: de balk op elke pagina, het zoekpalet,
# 'laatst geopend' en het springen naar een onderwerp. Draai met
# python3 -m http.server 9052 in de hoofdmap.
#
# Waar dit vooral op let: je moet vanaf ELKE pagina in een paar toetsen bij
# een ander hulpmiddel kunnen komen, en er mag daarbij niets verspringen of
# uit beeld vallen.
import glob
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright

B = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
URL = "http://localhost:9052/"
HOOFD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGINAS = sorted(os.path.basename(p) for p in glob.glob(os.path.join(HOOFD, "*.html")))

fails = 0
errs = []


def check(naam, ok, extra=""):
    global fails
    print(("OK  " if ok else "FAIL"), naam, extra)
    if not ok:
        fails += 1


with sync_playwright() as p:
    b = p.chromium.launch(executable_path=B)

    # ---------- de balk staat op elke pagina ----------
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errs.append(str(e)))
    zonder_balk, zonder_zoek, zonder_terug, te_breed, titel_mis = [], [], [], [], []
    for naam in PAGINAS:
        pg.goto(URL + naam)
        pg.wait_for_timeout(350)
        if pg.locator("header.topbar.krn-balk").count() != 1:
            zonder_balk.append(naam)
        if pg.locator(".krn-zoekknop").count() != 1:
            zonder_zoek.append(naam)
        terug = pg.locator(".krn-terug").count()
        if (naam == "index.html") != (terug == 0):
            zonder_terug.append(naam)
        if pg.evaluate("document.documentElement.scrollWidth") > 390:
            te_breed.append(naam)
        if not pg.locator(".topbar-title").inner_text().strip():
            titel_mis.append(naam)
    check("alle %d pagina's hebben precies een balk" % len(PAGINAS), not zonder_balk,
          "| " + str(zonder_balk))
    check("op elke pagina een zoekknop", not zonder_zoek, "| " + str(zonder_zoek))
    check("een terugknop overal behalve op het startscherm", not zonder_terug,
          "| " + str(zonder_terug))
    check("de balk maakt geen pagina te breed", not te_breed, "| " + str(te_breed))
    check("elke balk heeft een titel", not titel_mis, "| " + str(titel_mis))

    # de titel staat in het midden en loopt niet onder de knoppen door
    pg.goto(URL + "zenuwen.html")      # de langste titel
    pg.wait_for_timeout(400)
    doos = pg.evaluate("""() => {
        const r = s => document.querySelector(s).getBoundingClientRect();
        return { t: r('.topbar-title'), l: r('.krn-terug'), z: r('.krn-zoekknop') }; }""")
    check("de titel raakt de terugknop en de zoekknop niet",
          doos["t"]["left"] >= doos["l"]["right"] - 1 and doos["t"]["right"] <= doos["z"]["left"] + 1,
          "| titel %d-%d, terug tot %d, zoek vanaf %d" % (
              doos["t"]["left"], doos["t"]["right"], doos["l"]["right"], doos["z"]["left"]))
    midden = (doos["t"]["left"] + doos["t"]["right"]) / 2
    check("de titel staat in het midden", abs(midden - 195) <= 2, "| midden=%d" % midden)

    # de terugknop brengt je naar het startscherm
    pg.click(".krn-terug")
    pg.wait_for_timeout(500)
    check("de terugknop gaat naar het startscherm", pg.url.endswith("index.html"), "| " + pg.url)

    # een tik op de titel in de balk doet hetzelfde, vanaf elke pagina
    pg.goto(URL + "dosering.html")
    pg.wait_for_timeout(400)
    pg.click(".topbar-title")
    pg.wait_for_timeout(500)
    check("een tik op de titel gaat naar het startscherm", pg.url.endswith("index.html"),
          "| " + pg.url)
    # op het startscherm zelf sluit de titel een geopend onderwerp
    pg.goto(URL + "index.html#onderwerp=heup")
    pg.wait_for_timeout(600)
    pg.click(".topbar-title")
    pg.wait_for_timeout(400)
    check("op het startscherm sluit de titel het geopende onderwerp",
          pg.locator("#detailContent").is_hidden() and "#onderwerp" not in pg.url, "| " + pg.url)

    # het app-icoon: de bestanden bestaan en hebben de beloofde maat
    maten = pg.evaluate("""async () => { const uit = {};
        for (const [n, px] of [['icon-192.png',192],['icon-512.png',512],
                               ['icon-maskable-512.png',512],['apple-touch-icon.png',180]]) {
          const i = new Image(); i.src = n + '?t=' + Date.now();
          try { await i.decode(); uit[n] = i.naturalWidth === px && i.naturalHeight === px; }
          catch (e) { uit[n] = false; } }
        return uit; }""")
    check("de vier icoonbestanden bestaan en hebben de goede maat",
          all(maten.values()) and len(maten) == 4, "| " + str(maten))
    check("de iPhone krijgt het eigen icoon",
          pg.get_attribute("link[rel='apple-touch-icon']", "href") == "apple-touch-icon.png")

    # ---------- het zoekpalet ----------
    pg.goto(URL + "gmfcs.html")
    pg.wait_for_timeout(400)
    check("het palet is dicht bij het openen van een pagina",
          pg.locator(".krn-palet:not([hidden])").count() == 0)
    pg.click(".krn-zoekknop")
    pg.wait_for_timeout(400)
    check("de zoekknop opent het palet", pg.locator(".krn-palet.zichtbaar").count() == 1)
    check("het zoekveld heeft meteen de focus",
          pg.evaluate("document.activeElement.classList.contains('krn-palet-invoer')"))

    alle = pg.locator(".krn-palet-rij").count()
    in_indeling = pg.evaluate("KRN.hulpmiddelen().length")
    recent = pg.evaluate("KRN.recenteHulpmiddelen().length")
    # wat je het laatst opende staat er twee keer: bovenaan en in zijn groep
    check("zonder zoekterm staan alle hulpmiddelen erin",
          alle == in_indeling + recent and 1 <= recent <= 5,
          "| %d rijen, %d hulpmiddelen, %d laatst geopend" % (alle, in_indeling, recent))
    check("bovenaan staat wat je het laatst opende",
          pg.locator(".krn-palet-sectie").first.inner_text().strip().lower() == "laatst geopend"
          and "GMFCS" in pg.locator(".krn-palet-rij").first.inner_text())

    pg.keyboard.type("dos")
    pg.wait_for_timeout(300)
    titels = pg.locator(".krn-palet-titel").all_inner_texts()
    check("typen filtert: 'dos' vindt de doseringsplanner als eerste",
          titels and titels[0].startswith("Doseringsplanner"), "| " + str(titels[:4]))
    check("de treffer is gemarkeerd",
          pg.locator(".krn-palet-rij").first.locator("mark").inner_text().lower() == "dos")

    # zoeken op een woord dat niet in de naam staat, alleen in de zoekwoorden
    pg.fill(".krn-palet-invoer", "psoas")
    pg.wait_for_timeout(300)
    titels = pg.locator(".krn-palet-titel").all_inner_texts()
    check("'psoas' vindt de echopagina via de zoekwoorden",
          any("Echo landmarks" in t for t in titels), "| " + str(titels[:5]))

    pg.fill(".krn-palet-invoer", "qqqzzz")
    pg.wait_for_timeout(250)
    check("geen treffer: er staat dat er niets gevonden is",
          "Niets gevonden" in pg.inner_text(".krn-palet-lijst")
          and pg.locator(".krn-palet-rij").count() == 0)

    pg.keyboard.press("Escape")
    pg.wait_for_timeout(300)
    check("Escape sluit het palet", pg.locator(".krn-palet:not([hidden])").count() == 0)

    # sneltoetsen
    pg.keyboard.press("/")
    pg.wait_for_timeout(300)
    check("de toets / opent het palet", pg.locator(".krn-palet.zichtbaar").count() == 1)
    pg.keyboard.type("heupfoto")
    pg.wait_for_timeout(300)
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(600)
    check("Enter opent de eerste treffer", pg.url.endswith("heupfoto.html"), "| " + pg.url)

    pg.keyboard.press("Control+k")
    pg.wait_for_timeout(300)
    check("Ctrl+K opent het palet", pg.locator(".krn-palet.zichtbaar").count() == 1)
    # pijltje omlaag verplaatst de keuze
    eerst = pg.locator(".krn-palet-rij.actief .krn-palet-titel").inner_text()
    pg.keyboard.press("ArrowDown")
    pg.wait_for_timeout(150)
    daarna = pg.locator(".krn-palet-rij.actief .krn-palet-titel").inner_text()
    check("pijltje omlaag kiest de volgende", eerst != daarna and
          pg.locator(".krn-palet-rij.actief").count() == 1, "| %s -> %s" % (eerst, daarna))
    pg.keyboard.press("Control+k")
    pg.wait_for_timeout(250)
    check("nog een keer Ctrl+K sluit het weer",
          pg.locator(".krn-palet:not([hidden])").count() == 0)

    # In een invoerveld is / gewoon een teken. Anders kun je op de
    # doseringsplanner geen breuk of datum meer typen.
    pg.goto(URL + "dosering.html")
    pg.wait_for_timeout(500)
    pg.click("#doGewicht")
    pg.keyboard.press("/")
    pg.wait_for_timeout(250)
    check("in een invoerveld opent / het palet niet",
          pg.locator(".krn-palet:not([hidden])").count() == 0)

    # ---------- springen naar een onderwerp ----------
    pg.goto(URL + "kro.html")
    pg.wait_for_timeout(400)
    pg.keyboard.press("Control+k")
    pg.wait_for_timeout(250)
    pg.keyboard.type("sedatie")
    pg.wait_for_timeout(300)
    check("een onderwerp zonder eigen pagina is ook te vinden",
          pg.locator(".krn-palet-sectie", has_text="Onderwerpen").count() == 1)
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(800)
    check("Enter opent dat onderwerp op het startscherm",
          "index.html#onderwerp=sedatie" in pg.url
          and "Sedatie" in pg.inner_text("#detailTitle"), "| " + pg.url)
    pg.click("#backBtn")
    pg.wait_for_timeout(300)
    check("terug haalt het onderwerp uit het adres", "#onderwerp" not in pg.url, "| " + pg.url)
    # Het gesloten onderwerp bleef in de lijst gemarkeerd staan terwijl je al
    # terug was op het overzicht.
    pg.click("#tabOnder")
    pg.wait_for_timeout(250)
    check("na terug is er geen onderwerp meer gemarkeerd",
          pg.locator(".cat-item.active").count() == 0)
    ctx.close()

    # ---------- laatst geopend ----------
    ctx = b.new_context(viewport={"width": 1280, "height": 800})
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL + "index.html")
    pg.wait_for_timeout(600)
    check("eerste bezoek: geen 'laatst geopend'",
          pg.locator("[data-laatst-geopend]:not([hidden])").count() == 0)
    for naam in ("kro.html", "dosering.html", "heupfoto.html"):
        pg.goto(URL + naam)
        pg.wait_for_timeout(300)
    pg.goto(URL + "index.html")
    pg.wait_for_timeout(600)
    chips = pg.locator(".detail-empty .hm-chip span:last-child").all_inner_texts()
    check("drie pagina's geopend: ze staan er, nieuwste eerst",
          chips == ["Heupfoto beoordelen", "Doseringsplanner botox", "KRO: wat regelen?"],
          "| " + str(chips))
    opgeslagen = pg.evaluate("localStorage.getItem('krnLaatstGeopend')")
    check("bewaard worden alleen paginanamen, geen inhoud",
          opgeslagen == '["heupfoto.html","dosering.html","kro.html"]', "| " + str(opgeslagen))
    for naam in ("gmfcs.html", "rotatie.html", "myotomen.html", "kro.html"):
        pg.goto(URL + naam)
        pg.wait_for_timeout(250)
    pg.goto(URL + "index.html")
    pg.wait_for_timeout(600)
    chips = pg.locator(".detail-empty .hm-chip span:last-child").all_inner_texts()
    check("hooguit vijf, en een pagina staat er nooit twee keer",
          len(chips) == 5 and len(set(chips)) == 5 and chips[0] == "KRO: wat regelen?",
          "| " + str(chips))
    pg.fill("#zoek", "heup")
    pg.wait_for_timeout(300)
    check("tijdens het zoeken staat 'laatst geopend' er niet tussen",
          pg.locator("[data-laatst-geopend]:not([hidden])").count() == 0)
    pg.fill("#zoek", "")
    pg.wait_for_timeout(300)

    # ---------- het startscherm zelf ----------
    check("de grote zoekknop opent het palet",
          (pg.click("#startZoek"), pg.wait_for_timeout(350),
           pg.locator(".krn-palet.zichtbaar").count() == 1)[2])
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(250)

    # Geen emoji in het overzicht: die ogen op elk toestel anders. De gegevens
    # in indeling.js houden hun emoji; bij het tonen gaan ze eraf.
    rommel = pg.evaluate("""() => {
        const uit = new Set();
        for (const ch of document.querySelector('#hmStart').innerText +
                         document.querySelector('.topbar').innerText) {
          if (ch.codePointAt(0) >= 0x1F000) uit.add(ch);
        }
        return [...uit]; }""")
    check("geen emoji in het hulpmiddelenoverzicht en de balk", rommel == [], "| " + str(rommel))
    merkjes = pg.locator("#hmStart .krn-tegel").all_inner_texts()
    check("elk hulpmiddel heeft een merkje van twee letters",
          len(merkjes) == pg.locator("#hmStart .hm-rij").count()
          and all(len(m.strip()) == 2 for m in merkjes), "| " + str(merkjes[:6]))

    # De toastmelding zit verstopt met een transform. De binnenkomst-animatie
    # overschreef die eerst, en dan stond er een lege zwarte pil in beeld.
    pg.goto(URL + "index.html")
    pg.wait_for_timeout(900)
    toast = pg.evaluate("""() => { const t = document.getElementById('toast');
        const r = t.getBoundingClientRect(); const s = getComputedStyle(t);
        return { zichtbaar: s.opacity !== '0' && s.visibility !== 'hidden'
                 && r.top < innerHeight && r.bottom > 0 && r.width > 0 }; }""")
    check("de lege toastmelding staat niet in beeld", not toast["zichtbaar"], "| " + str(toast))

    # knoppen bij een onderwerp: zonder emoji, de volgorde 1-4 blijft
    pg.goto(URL + "index.html#onderwerp=botox")
    pg.wait_for_timeout(700)
    knoppen = pg.locator("#detailLinks a").all_inner_texts()
    check("de botulinestappen houden hun nummer",
          knoppen[:4] and [k[:2] for k in knoppen[:4]] == ["1.", "2.", "3.", "4."],
          "| " + str([k[:28] for k in knoppen[:4]]))
    check("geen emoji in de knoppen bij een onderwerp",
          not any(ord(ch) >= 0x1F000 or ch == "⃣" for k in knoppen for ch in k),
          "| " + str(knoppen[:3]))
    ctx.close()

    # ---------- op deze pagina: springen binnen een lange pagina ----------
    pg = b.new_context(viewport={"width": 390, "height": 800}).new_page()
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL + "dosering.html")
    pg.wait_for_timeout(600)
    check("lange pagina: de knop 'op deze pagina' staat in de balk",
          pg.locator(".krn-inhoudknop:not([hidden])").count() == 1)
    pg.click(".krn-inhoudknop")
    pg.wait_for_timeout(400)
    rijen = pg.locator(".krn-inhoud-rij span:last-child").all_inner_texts()
    koppen = pg.evaluate("""() => [...document.querySelectorAll('h2')]
        .filter(h => h.offsetParent && !h.closest('.krn-palet, .krn-inhoud'))
        .map(h => h.textContent.replace(/\\s+/g, ' ').trim())""")
    check("de lijst is precies de koppen van de pagina zelf", rijen == koppen and len(rijen) >= 3,
          "| %d rijen, %d koppen" % (len(rijen), len(koppen)))
    doel = rijen[5]
    pg.locator(".krn-inhoud-rij").nth(5).click()
    pg.wait_for_timeout(1100)
    plek = pg.evaluate("""(t) => { const h = [...document.querySelectorAll('h2')]
        .find(x => x.textContent.replace(/\\s+/g, ' ').trim() === t);
        return Math.round(h.getBoundingClientRect().top); }""", doel)
    check("een tik springt naar die kop, vlak onder de balk", 52 <= plek <= 90,
          "| '%s' staat op %d px" % (doel, plek))
    check("en de lijst is weer dicht", pg.locator(".krn-inhoud").count() == 0)
    lijn = pg.evaluate("""() => new DOMMatrix(getComputedStyle(
        document.querySelector('.krn-voortgang')).transform).a""")
    check("de voortgangslijn is meegegroeid", 0.05 < lijn < 1, "| " + str(round(lijn, 3)))
    pg.click(".krn-inhoudknop")
    pg.wait_for_timeout(300)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(250)
    check("Escape sluit de lijst", pg.locator(".krn-inhoud").count() == 0)

    # een korte pagina zonder koppen krijgt de knop niet
    pg.goto(URL + "neurogene-blaas.html")
    pg.wait_for_timeout(500)
    check("pagina zonder koppen: geen knop 'op deze pagina'",
          pg.locator(".krn-inhoudknop:not([hidden])").count() == 0)

    # Een pagina met tabbladen toont alleen de koppen van het zichtbare tabblad.
    pg.goto(URL + "kro.html")
    pg.wait_for_timeout(600)
    pg.click(".krn-inhoudknop")
    pg.wait_for_timeout(300)
    getoond = pg.locator(".krn-inhoud-rij").count()
    alle_h2 = pg.locator("h2").count()
    check("tabbladen: alleen zichtbare koppen in de lijst", 0 < getoond < alle_h2,
          "| %d getoond van %d" % (getoond, alle_h2))
    pg.close()

    # ---------- printen: de balk hoort niet op papier ----------
    pg = b.new_context(viewport={"width": 794, "height": 1123}).new_page()
    pg.goto(URL + "mdo-notitie.html")
    pg.wait_for_timeout(400)
    pg.emulate_media(media="print")
    pg.wait_for_timeout(200)
    check("op papier staat de balk er niet", not pg.locator(".krn-balk").is_visible())
    pg.close()

    print("\nfails:", fails, "| errors:", errs)
    b.close()
