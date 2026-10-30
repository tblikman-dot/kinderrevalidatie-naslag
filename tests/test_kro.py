import sys, re, datetime
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
B="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
TOEGESTAAN = set(chr(c) for c in range(0x20,0x7F)) | {"\n"}

# Elke zin uit bijlage 1, letterlijk. Verandert er een woord in kro-data.js,
# dan valt deze toets om.
ZINNEN = [
    "Verwijzing naar KRO spreekuur",
    "Intern via een order",
    "Extern via een verwijsbrief (onder documenten in EPIC",
    "Via kinderrevalidatiearts",
    "Op advies orthopeed, via kinderrevalidatie orthopedie spreekuur Vogellanden of revalidatie Friesland.",
    "KRO 1e consult: indicatie chirurgische behandeling gesteld",
    "Revalidatiearts vraagt preoperatief MDO aan bij het secretariaat medische staf "
    "revalidatiegeneeskunde. Met betrokken revalidatiearts en paramedici",
    "Checklist invullen met ouders en orthopeed (zie bijlage 2)",
    "Klinimetrie consult aanvragen door revalidatiearts:",
    "Via order UMCG CvR locatie Beatrixoord indien kind niet elders bekend.",
    "Via verwijzend revalidatiearts indien patiënt bekend bij Treant, de Vogellanden of "
    "revalidatie Friesland.",
    "KRO 1e consult: mogelijk indicatie chirurgische behandeling",
    "Via order UMCG CvR locatie Beatrixoord",
    "Op indicatie gangbeeldanalyse in het UMCG aanvragen door revalidatiearts",
    "MDO klinimetrie met betrokken revalidatiearts en fysiotherapeut aanvragen door revalidatiearts",
    "Controle consult aanvragen op het KRO voor bespreken klinimetrie en behandelplan door revalidatiearts",
    "Klinimetrie pre operatief",
    "Uitvoeren in UMCG CvR locatie Beatrixoord indien patiënt niet elders bekend of wanneer "
    "specifieke informatie nodig is voor het bepalen van de juiste (chirurgische) behandeling. "
    "Fysiotherapeut en revalidatiearts noteren bevindingen in observatielijst EPIC",
    "Indien patiënt bekend is bij Treant, de Vogellanden of Revalidatie Friesland, dit op de "
    "locatie waar patiënt bekend is verrichten. Revalidatiearts elders noteert gegevens in CP register",
    "MDO klinimetrie pre operatief",
    "Aanwezig: revalidatiearts, orthopeed, fysiotherapeut en gangbeeldanalist",
    "1-2 weken na klinimetrie consult + gangbeeldanalyse",
    "KRO 2e consult: indicatie chirurgische behandeling gesteld",
    "Preoperatief MDO",
    "MDO met eigen behandelteam, checklist (bijlage 2) doornemen en afspraken maken wie wat "
    "doet, zowel pre als postoperatief",
    "Revalidatiearts maakt n.a.v. het preoperatief MDO een behandelplan brief en verstuurd "
    "deze naar alle betrokkenen",
    "Het preoperatief MDO wordt bij voorkeur 8-12 weken voor (chirurgische) behandeling gepland.",
    "Optioneel: kortdurende poliklinische revalidatiebehandeling ter voorbereiding",
    "Uitproberen voorzieningen, hulpmiddelen en houdingen pre operatief",
    "In het UMCG CvR locatie Beatrixoord indien patiënt hier bekend, indien patiënt al elders "
    "bekend dan in eigen regio organiseren indien nodig. Dit te bespreken tijdens het preoperatief MDO",
    "Opname UMCG",
    "De taken van paramedici en verpleegkundigen tijdens de klinische fase staan beschreven in bijlage 3",
    "Paramedici UMCG worden in consult gevraagd door de zaalarts Orthopedie, conform MDO behandelplan brief",
    "Bij ontslag zorgen de paramedici UMCG voor een overdracht naar de behandelaren die de "
    "therapie overnemen zoals bij het preoperatief MDO afgesproken",
    "De revalidatiearts vraagt de klinimetrie post operatief (6 maanden post operatief) aan in "
    "het UMCG indien patiënt daar onder behandeling, anders dit in eigen regio organiseren. "
    "Daarnaast zal een controle consult op het KRO worden aangevraagd nadat de klinimetrie verricht is",
    "Klinimetrie post operatief",
    "Uitvoeren in UMCG CvR locatie Beatrixoord indien patiënt niet elders bekend "
    "Fysiotherapeut en revalidatiearts noteren bevindingen in observatielijst EPIC",
    "6 maanden post operatief",
    "MDO klinimetrie post operatief",
    "KRO spreekuur controle consult post operatief",
    "Evalueren operatie, nabehandeling en klinimetrie bespreken",
    "Na MDO klinimetrie post operatief plannen",
    "Bij Multi-level operaties gangbeeldanalyse 1 en 2 jaar post operatief herhalen, aanvraag "
    "door revalidatiearts",
]

KLINIMETRIE = ["GAS doelen", "GMFM", "6 minuten looptest", "Pedi NL", "Pedi CAT",
               "Functionele kracht testen",
               "Gangbeeldanalyse (indien nog niet verricht voor de indicatie stelling)",
               "CP Child"]


def schuif(d, jaren=0, maanden=0, dagen=0):
    """Zelfde rekenregel als de pagina: maanden/jaren klemmen op de laatste dag."""
    j = d.year + jaren
    m = d.month - 1 + maanden
    j += m // 12; m = m % 12 + 1
    import calendar
    dag = min(d.day, calendar.monthrange(j, m)[1])
    return datetime.date(j, m, dag) + datetime.timedelta(days=dagen)

def nl(d): return "%02d-%02d-%d" % (d.day, d.month, d.year)


with sync_playwright() as p:
    b = p.chromium.launch(executable_path=B)
    ctx = b.new_context(viewport={"width": 390, "height": 900},
                        permissions=["clipboard-read", "clipboard-write"])
    pg = ctx.new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
    pg.goto("http://localhost:9052/kro.html"); pg.wait_for_timeout(600)

    fails = 0
    def check(n, ok, extra=""):
        global fails
        print(("OK  " if ok else "FAIL"), n, extra)
        if not ok: fails += 1

    def T(): return pg.input_value("#kroEpic")
    def P(): return pg.input_value("#kroEpicPlan")

    def veilig(t, naam):
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
        rest = re.findall(r'[{}]|\*\*\*', t)
        check(naam + ": geen onvervangen invulmarkering", not rest, "| " + str(rest[:4]))

    def stap(v): pg.check('input[name="stap"][value="%s"]' % v); pg.wait_for_timeout(250)
    def waar(v): pg.check('input[name="waar"][value="%s"]' % v); pg.wait_for_timeout(250)
    def kies(naam, v): pg.check('input[name="%s"][value="%s"]' % (naam, v)); pg.wait_for_timeout(250)
    def taken(): return pg.inner_text("#kroTaken")

    # ---------- tijdlijn: elke bronzin letterlijk ----------
    print("--- tijdlijn ---")
    pg.click("#kroTabLijn"); pg.wait_for_timeout(300)
    lijn = pg.inner_text("#kroLijn")
    for z in ZINNEN:
        check("letterlijk: " + z[:58], z in lijn)
    check("titel van bijlage 1",
          "BIJLAGE 1: Tijdlijn Kinderrevalidatie Orthopedie spreekuur (KRO)"
          in pg.inner_text("#kroLijnKop"))
    check("beide routes gemerkt", lijn.count("route A") >= 1 and lijn.count("route B") >= 3,
          "| A=%d B=%d" % (lijn.count("route A"), lijn.count("route B")))
    pg.click("#kroTabNu"); pg.wait_for_timeout(300)

    # ---------- leeg ----------
    print("\n--- leeg ---")
    check("leeg: tekstvak leeg", T() == "", "| " + T()[:60])
    check("leeg: vraagt om een moment", "Kies hierboven waar je staat" in taken())
    check("leeg: klinimetriekaart verborgen", not pg.locator("#kroKlinKaart").is_visible())

    # ---------- route A ----------
    print("\n--- route A: indicatie gesteld ---")
    stap("consult1a")
    t = taken()
    check("A: MDO aanvragen staat erbij",
          "Revalidatiearts vraagt preoperatief MDO aan bij het secretariaat" in t)
    check("A: checklist staat erbij", "Checklist invullen met ouders en orthopeed (zie bijlage 2)" in t)
    check("A: link naar bijlage 2", pg.locator('#kroTaken a[href="mdo-notitie.html"]').count() == 1)
    check("A: beide varianten zolang 'waar bekend' leeg is",
          "indien kind niet elders bekend" in t and "Via verwijzend revalidatiearts" in t)
    check("A: vraagt om de plaats", "Kies hierboven waar de patiënt bekend is" in t)

    waar("umcg")
    t = taken()
    check("A+UMCG: alleen de order-variant",
          "Via order UMCG CvR locatie Beatrixoord indien kind niet elders bekend." in t
          and "Via verwijzend revalidatiearts" not in t, "| " + t.replace("\n", " / ")[-200:])
    check("A+UMCG: geen let-op over elders", not pg.locator("#kroEldersLet").is_visible())

    waar("friesland")
    t = taken()
    check("A+elders: alleen de verwijzend-arts-variant",
          "Via verwijzend revalidatiearts indien patiënt bekend bij Treant" in t
          and "indien kind niet elders bekend" not in t, "| " + t.replace("\n", " / ")[-200:])
    check("A+elders: let-op verschijnt", pg.locator("#kroEldersLet").is_visible())
    check("A+elders: let-op noemt het CP register",
          "CP register" in pg.inner_text("#kroEldersLet"))

    tx = T(); veilig(tx, "route A")
    check("A: moment in de tekst",
          "Moment: KRO 1e consult: indicatie chirurgische behandeling gesteld" in tx)
    check("A: plaats in de tekst", "Patient is bekend bij Revalidatie Friesland." in tx)
    check("A: alles staat onder 'Nog te doen'",
          "Nog te doen:" in tx and "Aangevraagd of geregeld:" not in tx)

    # afvinken verplaatst de regel
    pg.locator('#kroTaken input[name="taak"]').first.check(); pg.wait_for_timeout(300)
    tx = T(); veilig(tx, "route A afgevinkt")
    check("A: afgevinkte taak verhuist", "Aangevraagd of geregeld:" in tx)
    kop = tx.split("Aangevraagd of geregeld:")[1].split("Nog te doen:")[0]
    check("A: de afgevinkte taak staat in het eerste blok",
          "Revalidatiearts vraagt preoperatief MDO" in kop, "| " + kop.replace("\n", " / ")[:120])

    # ---------- route B ----------
    print("\n--- route B: mogelijk indicatie ---")
    stap("consult1b")
    t = taken()
    for z in ["Op indicatie gangbeeldanalyse in het UMCG aanvragen door revalidatiearts",
              "MDO klinimetrie met betrokken revalidatiearts en fysiotherapeut aanvragen door revalidatiearts",
              "Controle consult aanvragen op het KRO voor bespreken klinimetrie en behandelplan door revalidatiearts"]:
        check("B: " + z[:48], z in t)
    check("B: geen MDO-aanvraag bij het secretariaat",
          "secretariaat medische staf" not in t)
    check("B: hierna volgt de klinimetrie",
          "Hierna volgt: Klinimetrie pre operatief" in pg.inner_text("#kroHierna"),
          "| " + pg.inner_text("#kroHierna"))
    check("B: noot over de ontbrekende variant",
          "zonder de variant" in pg.inner_text("#kroStapNoot"),
          "| " + pg.inner_text("#kroStapNoot")[:90])
    stap("consult1a")
    check("A: de tikfout peroperatief is gecorrigeerd",
          "peroperatief" not in taken(), "| " + taken().replace("\n", " / ")[:140])
    check("A: de noot vertelt dat de bron 'peroperatief' zei",
          "peroperatief" in pg.inner_text("#kroStapNoot")
          and "aanwijzing van de arts" in pg.inner_text("#kroStapNoot"),
          "| " + pg.inner_text("#kroStapNoot")[:120])
    stap("consult1b")

    # ---------- klinimetrie ----------
    print("\n--- klinimetrie ---")
    stap("klinimetrie_pre")
    check("klinimetriekaart verschijnt", pg.locator("#kroKlinKaart").is_visible())
    check("vraagt eerst om de GMFCS",
          "Kies hierboven de GMFCS" in pg.inner_text("#kroKlinLijst"))
    check("geen link naar de GMFCS-pagina (de GMFCS is bekend gegeven)",
          pg.locator('#kroKlinKaart a[href="gmfcs.html"]').count() == 0)

    kies("gmfcs", "i-iii")
    lst = pg.inner_text("#kroKlinLijst")
    # elke test uit de bron moet er letterlijk in staan
    for z in KLINIMETRIE:
        if z == "CP Child": continue
        check("letterlijk: " + z, z in lst, "| " + lst.replace("\n", " / "))
    check("I-III zonder leeftijd: beide Pedi's met hun grens",
          "Pedi NL (kind <4 jaar)" in lst and "Pedi CAT (kind > 4 jaar)" in lst, "| " + lst.replace("\n", " / "))
    kies("leeftijd", "jong")
    lst = pg.inner_text("#kroKlinLijst")
    check("jonger dan 4: Pedi NL, geen Pedi CAT",
          "Pedi NL" in lst and "Pedi CAT" not in lst, "| " + lst.replace("\n", " / "))
    kies("leeftijd", "oud")
    lst = pg.inner_text("#kroKlinLijst")
    check("ouder dan 4: Pedi CAT, geen Pedi NL",
          "Pedi CAT" in lst and "Pedi NL" not in lst, "| " + lst.replace("\n", " / "))
    check("altijd-blok staat er ook", "GAS doelen" in lst and "GMFM" in lst)
    check("de bovenste leeftijdsgroep heet '4 jaar of ouder'",
          "4 jaar of ouder" in pg.inner_text("#kroLeeftijd"),
          "| " + pg.inner_text("#kroLeeftijd").replace("\n", " / "))
    kn0 = pg.inner_text("#kroKlinNoten").replace("\n", " ")
    check("noot: precies 4 hoort bij de Pedi CAT",
          "precies 4" in kn0 and "Pedi CAT" in kn0, "| " + kn0[:180])
    check("I-III heeft geen CP Child", "CP Child" not in lst)

    kies("gmfcs", "iv-v")
    lst = pg.inner_text("#kroKlinLijst")
    check("letterlijk: CP Child", "CP Child" in lst, "| " + lst.replace("\n", " / "))
    check("kop van het klinimetrieblok", "* Te verrichten klinimetrie" in lst,
          "| " + lst.replace("\n", " / ")[:80])
    check("IV-V: geen looptest of Pedi",
          "6 minuten looptest" not in lst and "Pedi" not in lst, "| " + lst.replace("\n", " / "))
    check("IV-V: altijd-blok blijft", "GAS doelen" in lst and "GMFM" in lst)

    kies("gmfcs", "geen")
    lst = pg.inner_text("#kroKlinLijst")
    check("geen CP: wel GAS doelen",
          "GAS doelen" in lst, "| " + lst.replace("\n", " / "))
    check("geen CP: GEEN GMFM",
          "GMFM" not in lst, "| " + lst.replace("\n", " / "))
    check("geen CP: verder niets",
          "CP Child" not in lst and "6 minuten looptest" not in lst and "Pedi" not in lst,
          "| " + lst.replace("\n", " / "))

    kies("gmfcs", "i-iii"); kies("leeftijd", "oud"); waar("umcg")
    tx = T(); veilig(tx, "klinimetrie")
    check("klinimetrie in de Epic-tekst", "Te verrichten klinimetrie:" in tx)
    check("klinimetrie-regels in de tekst",
          all(z in tx for z in ["GAS doelen", "GMFM", "Pedi CAT"]),
          "| " + tx.split("Te verrichten klinimetrie:")[-1].replace("\n", " / "))
    check("niet-gekozen test staat er niet in", "Pedi NL" not in tx)
    check("6 maanden-regel hoort hier niet", "6 maanden post operatief" not in tx)

    # ---------- noten over de bron ----------
    print("\n--- bronnoten ---")
    kn = pg.inner_text("#kroKlinNoten")
    check("noot over de leeftijdsgrens van precies 4", "precies 4" in kn, "| " + kn[:120])
    check("noot over de GMFM alleen bij CP",
          "GMFM alleen bij CP" in kn or "GMFM" in kn and "alleen bij CP" in kn, "| " + kn[:200])
    check("noot over kinderen zonder CP", "zonder CP" in kn)

    # ---------- planning ----------
    print("\n--- planning ---")
    pg.click("#kroTabPlan"); pg.wait_for_timeout(300)

    # De gewone situatie: de operatiedatum is nog niet bekend. De tekst moet
    # dan nog steeds kloppen en plakbaar zijn, met de termijnen in woorden.
    pt = P(); veilig(pt, "planning zonder datums")
    check("zonder datum: tekstvak niet leeg", len(pt) > 80, "| " + pt[:70])
    check("zonder datum: operatiedatum staat als onbekend",
          "Datum operatie: nog niet bekend" in pt, "| " + pt.replace("\n", " / ")[:120])
    for w in ["Preoperatief MDO: nog te plannen",
              "Klinimetrie post operatief: 6 maanden post operatief",
              "Gangbeeldanalyse 1 jaar post operatief (alleen bij multi-level): 1 jaar post operatief",
              "Gangbeeldanalyse 2 jaar post operatief (alleen bij multi-level): 2 jaar post operatief",
              "MDO klinimetrie: 1-2 weken na klinimetrie consult + gangbeeldanalyse"]:
        check("zonder datum: " + w[:54], w in pt, "| " + pt.replace("\n", " / "))
    check("zonder datum: geen enkele datum verzonnen",
          not re.search(r'\d{2}-\d{2}-\d{4}', pt),
          "| " + str(re.findall(r'\d{2}-\d{2}-\d{4}', pt)))
    check("zonder datum: de 8-12 weken staan erbij",
          "bij voorkeur 8-12 weken voor (chirurgische) behandeling" in pt)

    # Alleen de MDO-datum. Daar volgt GEEN operatiedatum uit: de MDO-datum ligt
    # niet vast. Hij wordt alleen vermeld.
    mdo = datetime.date(2027, 2, 10)
    pg.fill("#kroDatumMdo", "2027-02-10"); pg.wait_for_timeout(400)
    pt = P(); veilig(pt, "planning met alleen de MDO-datum")
    check("MDO-datum wordt vermeld", "Datum preoperatief MDO: " + nl(mdo) in pt,
          "| " + pt.replace("\n", " / ")[:160])
    check("MDO-datum leidt GEEN operatiedatum af",
          "Operatie:" not in pt and "Afgeleid uit:" not in pt,
          "| " + pt.replace("\n", " / ")[:200])
    check("de operatiedatum blijft onbekend heten",
          "Datum operatie: nog niet bekend" in pt)
    check("het preoperatief MDO staat op de ingevulde datum",
          "Preoperatief MDO: " + nl(mdo) in pt, "| " + pt.replace("\n", " / ")[:200])
    check("de post-operatieve regels blijven in woorden",
          "Klinimetrie post operatief: 6 maanden post operatief" in pt)

    # Alleen de operatiedatum: dan is het MDO een venster.
    pg.fill("#kroDatumMdo", ""); pg.fill("#kroDatumOk", "2027-04-15"); pg.wait_for_timeout(400)
    ok = datetime.date(2027, 4, 15)
    pt = P(); veilig(pt, "planning met de operatiedatum")
    verwacht = [
        ("Preoperatief MDO", nl(schuif(ok, dagen=-84)) + " t/m " + nl(schuif(ok, dagen=-56))),
        ("Klinimetrie post operatief", nl(schuif(ok, maanden=6))),
        ("Gangbeeldanalyse 1 jaar post operatief", nl(schuif(ok, jaren=1))),
        ("Gangbeeldanalyse 2 jaar post operatief", nl(schuif(ok, jaren=2))),
    ]
    for naam, datum in verwacht:
        rs = [l for l in pt.split("\n") if l.startswith(naam)]
        check("datum klopt: " + naam, rs and rs[0].endswith(datum),
              "| " + str(rs) + " verwacht " + datum)
    check("planning noemt de bronzin",
          "(Het preoperatief MDO wordt bij voorkeur 8-12 weken voor (chirurgische) behandeling gepland.)" in pt)
    check("MDO klinimetrie nog in woorden", "MDO klinimetrie: 1-2 weken na" in pt)

    pg.fill("#kroDatumKlin", "2027-02-02"); pg.wait_for_timeout(400)
    kl = datetime.date(2027, 2, 2)
    r = [l for l in P().split("\n") if l.startswith("MDO klinimetrie:")]
    check("MDO klinimetrie 1-2 weken erna",
          r and r[0].endswith(nl(schuif(kl, dagen=7)) + " t/m " + nl(schuif(kl, dagen=14))),
          "| " + str(r))

    # maandoverloop: 31 augustus + 6 maanden mag geen 2 of 3 maart worden
    pg.fill("#kroDatumOk", "2027-08-31"); pg.wait_for_timeout(400)
    r = [l for l in P().split("\n") if l.startswith("Klinimetrie post operatief")]
    check("maandoverloop klemt op het maandeinde",
          r and r[0].endswith("29-02-2028"), "| " + str(r))

    # marge tussen MDO en operatie
    print("\n--- marge MDO-operatie ---")
    pg.fill("#kroDatumOk", "2027-03-10"); pg.fill("#kroDatumMdo", "2027-02-10")
    pg.wait_for_timeout(400)
    check("te krappe marge geeft een waarschuwing",
          pg.locator("#kroPlanWaarschuwing").is_visible())
    w = pg.inner_text("#kroPlanWaarschuwing")
    check("waarschuwing noemt het aantal weken", "4 weken" in w, "| " + w)
    check("waarschuwing staat ook in de Epic-tekst",
          "Let op: tussen het preoperatief MDO en de operatie" in P())
    pg.fill("#kroDatumOk", "2027-04-15"); pg.wait_for_timeout(400)
    check("goede marge: geen waarschuwing",
          not pg.locator("#kroPlanWaarschuwing").is_visible())
    check("en geen waarschuwing in de tekst", "Let op:" not in P())
    pg.fill("#kroDatumMdo", "2027-05-10"); pg.wait_for_timeout(400)
    check("MDO na de operatie wordt gemeld",
          "staat ná de operatie" in pg.inner_text("#kroPlanWaarschuwing"),
          "| " + pg.inner_text("#kroPlanWaarschuwing"))

    pg.click("#kroKopieerPlan"); pg.wait_for_timeout(500)
    check("planning kopieert", "Gekopieerd" in pg.inner_text("#kroMeldingPlan"))
    check("klembord planning", pg.evaluate("navigator.clipboard.readText()") == P())
    pg.click("#kroWisPlan"); pg.wait_for_timeout(300)
    check("planning leegmaken wist alle drie de velden",
          pg.input_value("#kroDatumOk") == "" and pg.input_value("#kroDatumMdo") == ""
          and pg.input_value("#kroDatumKlin") == "")
    check("en zet de tekst terug op de termijnen in woorden",
          "Datum operatie: nog niet bekend" in P())

    # ---------- kopieren en leegmaken op tab 1 ----------
    print("\n--- kopieren ---")
    pg.click("#kroTabNu"); pg.wait_for_timeout(300)
    pg.click("#kroKopieer"); pg.wait_for_timeout(500)
    check("kopieermelding", "Gekopieerd" in pg.inner_text("#kroMelding"))
    check("klembord gelijk aan het tekstvak",
          pg.evaluate("navigator.clipboard.readText()") == T())
    pg.click("#kroWis"); pg.wait_for_timeout(400)
    check("leegmaken wist alles", T() == "" and "Kies hierboven waar je staat" in taken())

    # ---------- niets bewaard ----------
    print("\n--- niets bewaard ---")
    stap("opname")
    check("iets gekozen", "Opname UMCG" in pg.inner_text("#kroTakenKop"))
    sleutels = pg.evaluate("Object.keys(localStorage)")
    check("niets in localStorage van deze pagina",
          not [k for k in sleutels if "kro" in k.lower()], "| " + str(sleutels))
    pg.reload(); pg.wait_for_timeout(600)
    check("na herladen is de keuze weg", T() == "" and "Kies hierboven" in taken())

    # ---------- telefoonbreedte ----------
    print("\n--- 390 px ---")
    stap("consult1a"); waar("friesland")
    breed = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
    check("geen horizontale scroll op 390 px", breed[0] <= breed[1] + 1, "| " + str(breed))

    # ---------- vindbaar en gekoppeld ----------
    print("\n--- vindbaar ---")
    pg2 = ctx.new_page()
    errs2 = []; pg2.on("pageerror", lambda e: errs2.append(str(e)))
    pg2.goto("http://localhost:9052/index.html"); pg2.wait_for_timeout(700)
    check("knop staat in het overzicht", pg2.locator('a[href="kro.html"]').count() >= 1)
    for woord in ["kro", "klinimetrie", "Beatrixoord", "stroomschema"]:
        pg2.fill("#zoek", woord); pg2.wait_for_timeout(500)
        check("te vinden op: " + woord, pg2.locator('a[href="kro.html"]').count() >= 1)
    check("startpagina zonder fouten", not errs2, "| " + str(errs2[:2]))

    pg3 = ctx.new_page()
    errs3 = []; pg3.on("pageerror", lambda e: errs3.append(str(e)))
    pg3.goto("http://localhost:9052/mdo-notitie.html"); pg3.wait_for_timeout(500)
    check("bijlage 2 verwijst terug naar het schema",
          pg3.locator('a[href="kro.html"]').count() >= 1)
    check("bijlage 2 noemt zichzelf zo", "bijlage 2" in pg3.inner_text(".mdo-intro").lower())
    check("mdo-pagina zonder fouten", not errs3, "| " + str(errs3[:2]))

    print("\nfails:", fails, "| errors:", errs)
    b.close()
