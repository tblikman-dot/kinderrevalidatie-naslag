import sys, re
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
B="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
TOEGESTAAN = set(chr(c) for c in range(0x20,0x7F)) | {"\n"}

# De zinnen uit de aangeleverde checklist, letterlijk, maar met de accenten
# weggehaald zoals naarAscii dat doet. Deze lijst is de toets op "niets
# herschreven": staat een zin hier niet meer woord voor woord in de uitvoer,
# dan is er iets aan de brontekst veranderd.
MDO_ZINNEN = [
    "Richtlijnen ten aanzien van de nabehandeling werden besproken:",
    "Het advies tav de postoperatieve revalidatie behandeling is:",
    "Klinische revalidatiebehandeling",
    "Direct na ziekenhuisopname voor OK",
    "Hierbij willen we onze collega's van revalidatie centrum Beetsterzwaag vragen "
    "patient en ouders op te roepen voor een kennismaking op hun afdeling",
    "Poliklinische revalidatiebehandeling via ......",
    "Therapieen en voorstel frequenties (nader af te stemmen in het MDO met "
    "behandelaren (ET/FT/LOGO/Psy)):",
    "Hydrotherapie",
    "Psychologische/pedagogische begeleiding",
    "Paramedische begeleiding eerste lijn",
    "Overig, namelijk: ....",
    "Post operatief beperkingen in het mobiliseren nodig",
    "Beperkingen tav maximale bewegingsuitslagen (bijv. Beperkingen maximale "
    "flexie/abductie heup postoperatief)",
    "Welke specificeren .....",
    "Gedurende xx weken",
    "Partieel belast mobiliseren, namelijk .. procent van het lichaams gewicht "
    "gedurende .. weken",
    "Adviezen post operatief tav houding en rekken",
    "Buiklig opbouwen tot",
    "Duur ..... min ...... x per dag",
    "Heup spreiding",
    "Staan in statafel in milde abductie",
    "Langzit",
    "Verwachting dat post-operatieve adviezen tav houding/mobiliseren haalbaar zijn "
    "voor patient (bijv. Buiklig mogelijk indien geadviseerd).",
    "Postoperatief gips",
    "Type gips: ....",
    "Aantal weken: ....",
    "Tijdens gipswissel orthesen aanmeten (zie 6)",
    "Ortheses aanmeten",
    "Type orthese ....",
    "Dag orthese ......",
    "Draagadvies: .......",
    "Nacht orthese ......",
    "Vereiste voorzieningen",
    "Spreidvoorziening: ....",
    "Stavoorziening in abductie: ....",
    "Loophulp: ....",
    "Ligvoorziening: ....",
    "Tillift ....",
    "Zitorthese aanpassing ....",
    "Pre-operatief extra inzet paramedici nodig (nader af te stemmen in het MDO met "
    "behandelaren (ET/FT/LOGO/Psy)",
    "Psychologische/pedagogische begeleiding ter voorbereiding op operatieve behandeling",
    "Logopedie voor beoordeling slikfunctie",
    "Fysiotherapie ter bevordering van de conditie",
    "Fysiotherapie voor uitproberen/introduceren nieuwe hulpmiddelen/voorzieningen",
    "Dietetiek gericht op het optimaliseren van de voedingsstatus",
    "Ergotherapie ter beoordeling/optimalisering van voorziening",
    "Gedurende de opname in het UMCG lijkt extra Inzet psychologische/ pedagogische "
    "begeleiding vooraf en rondom de operatie",
    "Organiseren via ....",
]

# De keuzes die elkaar uitsluiten; die kunnen niet in dezelfde doorloop staan.
MDO_ZINNEN_ANDERE_KEUZE = [
    "Nee, patient mag mobiliseren op geleide van kunnen",
    "Ja met aanpassing namelijk ....",
    "Nee, oude orthesen (concept .....) weer gebruiken.",
    "Niet van toepassing",
]

SPREEK_ZINNEN = [
    "Patiente/ouders/verzorgers kreeg uitleg over bovengenoemde conclusie.",
    "In het gezamenlijke consult met kinderorthopeed en kinderrevalidatiearts werd "
    "onderstaand behandelvoorstel gedaan met als doel: ***.",
    "Patiente / { ouders/pleegouders/verzorgers} kregen een voorstel voor een "
    "operatieve ingreep: ***.",
    "De procedure () de mogelijke complicatie's (zoals bloeding, infectie, falen, "
    "zenuwletsel, pijn, angst) en de alternatieven (niets doen, ....)zijn besproken.",
    "Patient / { ouders/pleegouders/verzorgers } {zijn akkoord / zijn niet akkoord/ "
    "denken nog verder na} t.a.v. de voorgestelde ingreep conform WGBO.",
    "Pre-operatief zal een MDO met de behandelaren van patient/patiente (ET/FT/Logo/Psy) "
    "en behandelaren in het UMCG (ergotherapeut, fysiotherapeut en revalidatiearts) "
    "plaatsvinden om de voorzieningen te checken en onderling af te stemmen over de "
    "voorbereiding van de operatie en de nabehandeling.",
    "Pre- en 3/6 maanden postoperatief zal klinimetrie consult gepland worden in het UMCG "
    "voor het afnemen van klinimetrie.",
    "Patiente / { ouders/pleegouders/verzorgers} zijn akkoord met:",
    "Deelname CP register ja/nee",
    "MDO / afstemming met behandelaren uit regio: ja/nee",
    "Verzenden van deze brief naar behandelaren (ET/FT/Logo/Rev arts) uit regio: ja/nee",
]

# Alles wat aangevinkt kan worden, in de volgorde waarin het aangezet moet
# worden (ouder voor kind, anders is het kind nog verborgen).
BESPREEK_ZINNEN = [
    "Pre-operatief",
    "Organiseren voorzieningen/checken voorzieningen",
    "Oefenen gebruik voorzieningen?",
    "Psychologische voorbereiding?",
    "Voedingsstatus?",
    "Conditie pre operatief optimaliseren?",
    "Slikken veilig evt. In liggende houding?",
    "Toiletgang",
    "Schoolgang",
    "Opname UMCG",
    "Bij ontslag overdracht naar ....",
    "Gips",
    "Spalken aanmeten",
    "Aanpassing rolstoel",
    "Post operatief",
    "Therapie frequentie, FT, ET, psy, hydrotherapie? Waar?",
    "Controle?",
]

BESPREEK_AAN = [
    "b1.voorz", "b1.oefenen", "b1.psy", "b1.voeding", "b1.conditie", "b1.slikken",
    "b1.toilet", "b1.school",
    "b2.overdracht", "b2.gips", "b2.spalken", "b2.rolstoel",
    "b3.therapie", "b3.controle",
]

ALLES_AAN = [
    "p1.klin", "p1.opname", "p1.opname.direct", "p1.beetster", "p1.poli",
    "p1.ther", "p1.ther.ft", "p1.ther.ft.freq", "p1.ther.et", "p1.ther.et.freq",
    "p1.ther.hydro", "p1.ther.hydro.freq", "p1.ther.psy", "p1.ther.psy.freq",
    "p1.eerste", "p1.ft1", "p1.et1", "p1.ov1",
    "p2.ja", "p2.ja.onbelast", "p2.ja.rom", "p2.ja.rom.welke", "p2.ja.rom.duur",
    "p2.ja.partieel",
    "p3.buiklig", "p3.buiklig.duur", "p3.spreiding", "p3.spreiding.duur",
    "p3.statafel", "p3.statafel.duur", "p3.langzit", "p3.langzit.duur", "p3.ov3",
    "p4.ja",
    "p5.ja", "p5.ja.type", "p5.ja.weken", "p5.ja.wissel",
    "p6.ja", "p6.ja.type", "p6.ja.dag", "p6.ja.dag.advies", "p6.ja.nacht",
    "p6.ja.nacht.advies",
    "p7.spreid", "p7.sta", "p7.loop", "p7.lig", "p7.tillift", "p7.zit", "p7.ov7",
    "p8.ja", "p8.ja.psy", "p8.ja.logo", "p8.ja.conditie", "p8.ja.hulpmiddel",
    "p8.ja.dieet", "p8.ja.ergo",
    "p9.ja", "p9.ja.via",
]

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=B)
    ctx = b.new_context(viewport={"width": 390, "height": 900},
                        permissions=["clipboard-read", "clipboard-write"])
    pg = ctx.new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
    pg.goto("http://localhost:9052/mdo-notitie.html"); pg.wait_for_timeout(600)

    fails = 0
    def check(n, ok, extra=""):
        global fails
        print(("OK  " if ok else "FAIL"), n, extra)
        if not ok: fails += 1

    def T(): return pg.input_value("#mdoEpic")
    def S(): return pg.input_value("#mdoSpreek")

    def veilig(t, naam, epic_markers_ok=False):
        buiten = sorted(set(ch for ch in t if ch not in TOEGESTAAN))
        check(naam + ": alleen ASCII", not buiten, "| " + str([hex(ord(c)) for c in buiten]))
        check(naam + ": geen tabs", "\t" not in t)
        check(naam + ": geen inspringing", not any(l[:1] == " " for l in t.split("\n")))
        slecht = [l for l in t.split("\n") if re.match(r'^([-*#+>o]|\d+[.)]|[a-z][.)])\s', l)]
        check(naam + ": geen autolijst-start", not slecht, "| " + str(slecht[:2]))
        check(naam + ": geen spaties aan regeleind",
              not [l for l in t.split("\n") if l != l.rstrip()])
        check(naam + ": geen dubbele lege regel", "\n\n\n" not in t)
        check(naam + ": geen lege begin/eindregel", t == t.strip("\n"))
        if not epic_markers_ok:
            # In de MDO-tekst mag geen {veld} of *** blijven staan: dat zou een
            # invulmarkering zijn die niet vervangen is.
            rest = re.findall(r'[{}]|\*\*\*', t)
            check(naam + ": geen onvervangen invulmarkering", not rest, "| " + str(rest[:4]))

    def vink(pad):
        pg.check('input[data-pad="%s"]:not([data-veld])' % pad)

    def vul(pad, veld, waarde):
        pg.fill('[data-pad="%s"][data-veld="%s"]' % (pad, veld), waarde)

    # ---------- leeg ----------
    print("--- leeg ---")
    t = T()
    veilig(t, "leeg")
    check("leeg: kop staat er", t.startswith("MDO-CHECKLIST"), "| " + t[:40])
    check("leeg: aanhef staat er", MDO_ZINNEN[0] in t)
    check("leeg: alle negen punten gemeld als niet ingevuld",
          t.count("NOG NIET INGEVULD") == 1 and
          all(("(%d) " % n) in t.split("NOG NIET INGEVULD")[1] for n in range(1, 10)),
          "| " + t.split("NOG NIET INGEVULD")[-1].replace("\n", " / ")[:160])
    # Geen enkel getal dat niet van de puntnummering komt: de app verzint geen
    # weken, procenten of frequenties.
    zonder_nr = re.sub(r'\(\d\)', '', t)
    check("leeg: geen zelf verzonnen getallen", not re.search(r'\d', zonder_nr),
          "| " + str(re.findall(r'.{0,30}\d.{0,30}', zonder_nr)[:3]))

    # ---------- onderliggende keuzes zijn verborgen tot de regel aan staat ----
    print("\n--- verbergen ---")
    check("onderliggende keuze verborgen bij start",
          not pg.locator('input[data-pad="p2.ja.onbelast"]:not([data-veld])').is_visible())
    vink("p2.ja"); pg.wait_for_timeout(200)
    check("onderliggende keuze zichtbaar na aanvinken",
          pg.locator('input[data-pad="p2.ja.onbelast"]:not([data-veld])').is_visible())
    check("punt 2 staat niet meer bij de ontbrekende punten",
          "(2) " not in T().split("NOG NIET INGEVULD")[-1])

    # ---------- een ingevuld veld komt in de tekst, leeg blijft de plaatshouder ----
    print("\n--- velden ---")
    vink("p2.ja.onbelast"); pg.wait_for_timeout(200)
    check("leeg veld houdt de plaatshouder uit de bron",
          "Onbelast mobiliseren gedurende .... weken" in T(),
          "| " + str([l for l in T().split("\n") if "Onbelast" in l]))
    vul("p2.ja.onbelast", "weken", "6"); pg.wait_for_timeout(250)
    check("ingevuld veld komt in de tekst",
          "Onbelast mobiliseren gedurende 6 weken" in T(),
          "| " + str([l for l in T().split("\n") if "Onbelast" in l]))

    # ---------- radio sluit de andere keuze uit ----------
    print("\n--- radio ---")
    vink("p2.nee"); pg.wait_for_timeout(250)
    t = T()
    check("Nee-zin letterlijk", MDO_ZINNEN_ANDERE_KEUZE[0] in t,
          "| " + str([l for l in t.split("\n") if "geleide" in l]))
    check("de Ja-regels zijn verdwenen", "Onbelast mobiliseren" not in t)
    check("ingevulde weken zijn ook weg", "gedurende 6 weken" not in t)
    vink("p2.ja"); pg.wait_for_timeout(250)
    check("terug naar Ja brengt de eerdere invulling terug",
          "Onbelast mobiliseren gedurende 6 weken" in T())

    # ---------- keuzeveld voor het centrum ----------
    print("\n--- centrum ---")
    vink("p1.opname"); pg.wait_for_timeout(200)
    check("centrum onbepaald geeft de bronregel",
          "Opname kliniek (revalidatie Friesland/Roessingh/overig)" in T(),
          "| " + str([l for l in T().split("\n") if "Opname kliniek" in l]))
    pg.select_option('select[data-pad="p1.opname"][data-veld="centrum"]', "Roessingh")
    pg.wait_for_timeout(250)
    check("gekozen centrum staat in de tekst", "Opname kliniek (Roessingh)" in T(),
          "| " + str([l for l in T().split("\n") if "Opname kliniek" in l]))
    check("vrij tekstveld blijft verborgen bij een vast centrum",
          not pg.locator('input[data-pad="p1.opname"][data-veld="centrum__vrij"]').is_visible())
    pg.select_option('select[data-pad="p1.opname"][data-veld="centrum"]', "overig")
    pg.wait_for_timeout(250)
    check("vrij tekstveld verschijnt bij overig",
          pg.locator('input[data-pad="p1.opname"][data-veld="centrum__vrij"]').is_visible())
    check("overig zonder tekst blijft 'overig'", "Opname kliniek (overig)" in T(),
          "| " + str([l for l in T().split("\n") if "Opname kliniek" in l]))
    vul("p1.opname", "centrum__vrij", "Vogellanden"); pg.wait_for_timeout(250)
    check("eigen centrum vervangt het woord overig",
          "Opname kliniek (Vogellanden)" in T(),
          "| " + str([l for l in T().split("\n") if "Opname kliniek" in l]))
    pg.select_option('select[data-pad="p1.opname"][data-veld="centrum"]', "revalidatie Friesland")
    pg.wait_for_timeout(250)

    # ---------- punt 7 is een uitklaplijst, zoals de bron vraagt ----------
    print("\n--- punt 7 ---")
    check("punt 7 is een uitklaplijst", pg.locator("details.mdo-uitklap").count() == 1)
    check("punt 7 staat dicht bij het openen",
          not pg.locator('input[data-pad="p7.spreid"]:not([data-veld])').is_visible())
    pg.locator("details.mdo-uitklap summary").click(); pg.wait_for_timeout(200)
    check("punt 7 gaat open", pg.locator('input[data-pad="p7.spreid"]:not([data-veld])').is_visible())

    # ---------- alles aan: elke bronzin letterlijk terug ----------
    print("\n--- alles aan ---")
    for pad in ALLES_AAN:
        try:
            vink(pad)
        except Exception as e:
            check("aanvinken lukt: " + pad, False, "| " + str(e)[:90])
    pg.wait_for_timeout(500)
    t = T()
    veilig(t, "alles aan")
    check("geen punt meer ontbrekend", "NOG NIET INGEVULD" not in t,
          "| " + t.split("NOG NIET INGEVULD")[-1].replace("\n", " / ")[:120])
    for z in MDO_ZINNEN:
        check("letterlijk: " + z[:58], z in t)

    # De uitsluitende keuzes, in een tweede doorloop.
    for pad in ["p2.nee", "p4.aanpassing", "p6.oud"]:
        vink(pad)
    pg.wait_for_timeout(400)
    t2 = T()
    veilig(t2, "andere keuzes")
    for z in MDO_ZINNEN_ANDERE_KEUZE[:3]:
        check("letterlijk: " + z[:58], z in t2)
    vink("p6.nvt"); pg.wait_for_timeout(300)
    check("letterlijk: " + MDO_ZINNEN_ANDERE_KEUZE[3], MDO_ZINNEN_ANDERE_KEUZE[3] in T())

    # ---------- niets dat niet uit de bron komt ----------
    print("\n--- geen eigen tekst ---")
    VERBODEN = ["conform de richtlijn", "volgens protocol", "zie bijlage", "advies van de app",
                "geadviseerd wordt", "wij adviseren", "aanbevolen", "Let op:", "TODO",
                "Bron:", "patientnummer", "geboortedatum"]
    for w in VERBODEN:
        check("komt niet voor: " + w, w.lower() not in T().lower())

    # ---------- kopieren ----------
    print("\n--- kopieren ---")
    pg.click("#mdoKopieer"); pg.wait_for_timeout(500)
    check("kopieermelding", "Gekopieerd" in pg.inner_text("#mdoMelding"),
          "| " + pg.inner_text("#mdoMelding"))
    klem = pg.evaluate("navigator.clipboard.readText()")
    check("klembord gelijk aan het tekstvak", klem == T(),
          "| verschil %d tekens" % abs(len(klem) - len(T())))
    veilig(klem, "klembord")

    # ---------- leegmaken ----------
    print("\n--- leegmaken ---")
    pg.click("#mdoWis"); pg.wait_for_timeout(400)
    t = T()
    check("leegmaken zet alles terug", "NOG NIET INGEVULD" in t and "Onbelast" not in t,
          "| " + t.replace("\n", " / ")[:140])
    check("leegmaken wist ook de ingevulde velden",
          pg.input_value('[data-pad="p2.ja.onbelast"][data-veld="weken"]') == "")

    # ---------- spreekkamer ----------
    print("\n--- spreekkamer ---")
    pg.click("#mdoTabSpreek"); pg.wait_for_timeout(300)
    s = S()
    veilig(s, "spreekkamer", epic_markers_ok=True)
    for z in SPREEK_ZINNEN:
        check("letterlijk: " + z[:58], z in s)
    check("spreekkamer houdt de ***-markering", s.count("***") == 2,
          "| %d x" % s.count("***"))
    check("spreekkamer houdt de keuzelijsten", s.count("{") == 4 and s.count("}") == 4,
          "| { %d  } %d" % (s.count("{"), s.count("}")))
    check("spreekkamer houdt de ja/nee-regels", s.count("ja/nee") == 3,
          "| %d x" % s.count("ja/nee"))
    check("spreekkamer valt niet te wijzigen",
          pg.get_attribute("#mdoSpreek", "readonly") is not None)
    pg.click("#mdoKopieerSpreek"); pg.wait_for_timeout(500)
    check("spreekkamer kopieert", "Gekopieerd" in pg.inner_text("#mdoMeldingSpreek"))
    check("klembord spreekkamer", pg.evaluate("navigator.clipboard.readText()") == S())

    # ---------- bespreekpunten ----------
    print("\n--- bespreekpunten ---")
    pg.click("#mdoTabBespreek"); pg.wait_for_timeout(300)
    check("bespreekpunten: kop uit de bron",
          pg.inner_text("#mdoBespreekKop") == "MDO pre operatief, bespreekpunten:",
          "| " + pg.inner_text("#mdoBespreekKop"))
    check("bespreekpunten: leeg tekstvak zolang er niets aan staat",
          pg.input_value("#mdoBespreekEpic") == "",
          "| " + pg.input_value("#mdoBespreekEpic")[:80])
    pg.click("#mdoKopieerBespreek"); pg.wait_for_timeout(400)
    check("bespreekpunten: leeg kopieren meldt dat",
          "nog niets" in pg.inner_text("#mdoMeldingBespreek"),
          "| " + pg.inner_text("#mdoMeldingBespreek"))
    for pad in BESPREEK_AAN:
        try:
            vink(pad)
        except Exception as e:
            check("aanvinken lukt: " + pad, False, "| " + str(e)[:90])
    pg.wait_for_timeout(400)
    tb = pg.input_value("#mdoBespreekEpic")
    veilig(tb, "bespreekpunten")
    check("bespreekpunten: kop boven de tekst",
          tb.startswith("MDO PRE OPERATIEF, BESPREEKPUNTEN"), "| " + tb[:50])
    for z in BESPREEK_ZINNEN:
        check("letterlijk: " + z[:58], z in tb)
    vul("b2.overdracht", "naar", "eerste lijn"); pg.wait_for_timeout(300)
    check("bespreekpunten: ingevuld veld komt erin",
          "Bij ontslag overdracht naar eerste lijn" in pg.input_value("#mdoBespreekEpic"))
    check("bespreekpunten: uitgezette punten blijven eruit",
          "Toiletgang" in pg.input_value("#mdoBespreekEpic"))
    pg.uncheck('input[data-pad="b1.toilet"]:not([data-veld])'); pg.wait_for_timeout(300)
    check("bespreekpunten: uitgezet punt verdwijnt",
          "Toiletgang" not in pg.input_value("#mdoBespreekEpic"))
    pg.click("#mdoWisBespreek"); pg.wait_for_timeout(300)
    check("bespreekpunten: leegmaken maakt het tekstvak leeg",
          pg.input_value("#mdoBespreekEpic") == "")
    check("bespreekpunten: leegmaken raakt de MDO-checklist niet",
          "NOG NIET INGEVULD" in T() and T().startswith("MDO-CHECKLIST"))

    # ---------- de drie tabbladen ----------
    print("\n--- tabbladen ---")
    for knop, vlak in [("#mdoTabMdo", "#mdoVlakMdo"),
                       ("#mdoTabBespreek", "#mdoVlakBespreek"),
                       ("#mdoTabSpreek", "#mdoVlakSpreek")]:
        pg.click(knop); pg.wait_for_timeout(200)
        zichtbaar = [v for v in ["#mdoVlakMdo", "#mdoVlakBespreek", "#mdoVlakSpreek"]
                     if pg.locator(v).is_visible()]
        check("tab " + knop + " toont alleen " + vlak, zichtbaar == [vlak], "| " + str(zichtbaar))

    # ---------- niets bewaard ----------
    print("\n--- niets bewaard ---")
    pg.click("#mdoTabMdo"); pg.wait_for_timeout(200)
    vink("p5.ja"); vink("p5.ja.type"); pg.wait_for_timeout(200)
    vul("p5.ja.type", "type", "bovenbeensgips"); pg.wait_for_timeout(300)
    check("eerst wel in de tekst", "bovenbeensgips" in T())
    sleutels = pg.evaluate("Object.keys(localStorage)")
    check("niets in localStorage van deze pagina",
          not [k for k in sleutels if "mdo" in k.lower()], "| " + str(sleutels))
    pg.reload(); pg.wait_for_timeout(600)
    check("na herladen is de invulling weg", "bovenbeensgips" not in T())
    check("na herladen staat niets aangevinkt", "NOG NIET INGEVULD" in T())

    # ---------- telefoonbreedte ----------
    print("\n--- 390 px ---")
    for pad in ALLES_AAN[:20]:
        try: vink(pad)
        except Exception: pass
    pg.wait_for_timeout(400)
    breed = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
    check("geen horizontale scroll op 390 px", breed[0] <= breed[1] + 1, "| " + str(breed))

    # ---------- vindbaar vanaf de startpagina ----------
    print("\n--- vindbaar ---")
    pg2 = ctx.new_page()
    errs2 = []; pg2.on("pageerror", lambda e: errs2.append(str(e)))
    pg2.goto("http://localhost:9052/index.html"); pg2.wait_for_timeout(700)
    check("knop staat in het hulpmiddelenoverzicht",
          pg2.locator('a[href="mdo-notitie.html"]').count() >= 1)
    pg2.fill("#zoek", "epic"); pg2.wait_for_timeout(500)
    check("te vinden op het woord epic",
          pg2.locator('a[href="mdo-notitie.html"]').count() >= 1)
    pg2.fill("#zoek", "spreekkamer"); pg2.wait_for_timeout(500)
    check("te vinden op het woord spreekkamer",
          pg2.locator('a[href="mdo-notitie.html"]').count() >= 1)
    check("startpagina zonder fouten", not errs2, "| " + str(errs2[:2]))

    print("\nfails:", fails, "| errors:", errs)
    b.close()
