import sys, re
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hulp import *
from playwright.sync_api import sync_playwright
B="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
TOEGESTAAN = set(chr(c) for c in range(0x20,0x7F)) | {"\n"}

with sync_playwright() as p:
    b=p.chromium.launch(executable_path=B)
    ctx=b.new_context(viewport={"width":390,"height":900}, permissions=["clipboard-read","clipboard-write"])
    pg=ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://localhost:9052/dosering.html"); pg.wait_for_timeout(700)
    fails=0
    def check(n, ok, extra=""):
        global fails
        print(("OK  " if ok else "FAIL"), n, extra)
        if not ok: fails+=1
    def T(): return pg.input_value("#doEpic")

    def veilig(t, naam):
        buiten = sorted(set(ch for ch in t if ch not in TOEGESTAAN))
        check(naam+": alleen ASCII", not buiten, "| "+str([hex(ord(c)) for c in buiten]))
        check(naam+": geen tabs", "\t" not in t)
        check(naam+": geen inspringing", not any(l[:1]==" " for l in t.split("\n")))
        check(naam+": geen autolijst-start",
              not [l for l in t.split("\n") if re.match(r'^([-*#+>o]|\d+[.)]|[a-z][.)])\s', l)],
              "| "+str([l for l in t.split("\n") if re.match(r'^([-*#+>o]|\d+[.)]|[a-z][.)])\s', l)][:2]))
        check(naam+": geen spaties aan regeleind", not [l for l in t.split("\n") if l != l.rstrip()])
        check(naam+": geen dubbele lege regel", "\n\n\n" not in t)
        check(naam+": geen lege begin/eindregel", t == t.strip("\n"))
        check(naam+": geen Epic-triggers", not re.search(r'[@{}\[\]$]|\*\*\*', t),
              "| "+str(re.findall(r'[@{}\[\]$]|\*\*\*', t)))

    # ---------- leeg ----------
    veilig(T(), "leeg")
    check("leeg meldt dat", "Nog geen doelspieren gekozen" in T(), "| "+T().replace("\n"," / "))

    # ---------- basisgeval ----------
    vulBasis(pg)
    kies(pg,"Pronator teres")
    pg.wait_for_timeout(400)
    t=T(); veilig(t,"basis")
    check("preparaat met merk en stof", "Preparaat: Botox (onabotulinumtoxineA)" in t)
    check("links blok", "LINKS - totaal 40 E" in t, "| "+t.replace("\n"," / "))
    check("rechts blok", "RECHTS - totaal 40 E" in t)
    check("1 plaats formulering", "LINKS Pronator teres: 40 E in 1 injectieplaats" in t)
    check("totaal met E/kg", "Totaal: 80 E bij 22 kg = 3,6 E/kg" in t)

    # ---------- eenzijdig: alleen dat blok ----------
    kaart(pg,"Pronator teres").locator('.do-kantknoppen button', has_text="Links").click(); pg.wait_for_timeout(450)
    t=T()
    check("alleen LINKS bij eenzijdig", "LINKS - totaal 40 E" in t and "RECHTS - totaal" not in t, "| "+t.replace("\n"," / "))
    kaart(pg,"Pronator teres").locator('.do-kantknoppen button', has_text="Beide").click(); pg.wait_for_timeout(450)

    # ---------- vier injectieplaatsen ----------
    kies(pg,"Rectus femoris"); pg.wait_for_timeout(300)
    zetPlaatsen(pg,"Rectus femoris",4)
    pg.wait_for_timeout(400)
    t=T(); veilig(t,"4 plaatsen")
    check("4 gelijke plaatsen gegroepeerd", "LINKS Rectus femoris: 80 E, verdeeld over 4 injectieplaatsen (4 x 20 E)" in t,
          "| "+[l for l in t.split("\n") if "Rectus" in l][:1].__str__())

    # ---------- ongelijke verdeling over 3 ----------
    kies(pg,"Semimembranosus"); zetPlaatsen(pg,"Semimembranosus",3); pg.wait_for_timeout(400)
    t=T()
    check("ongelijke verdeling uitgeschreven",
          "LINKS Semimembranosus: 80 E, verdeeld over 3 injectieplaatsen (30 E + 25 E + 25 E)" in t,
          "| "+[l for l in t.split("\n") if "Semimem" in l][:1].__str__())
    som=[l for l in t.split("\n") if "Semimem" in l][0]
    getallen=[int(x) for x in re.findall(r'(\d+) E', som)]
    check("som van de delen klopt met het totaal", getallen[0]==sum(getallen[1:]), "| "+str(getallen))

    # ---------- links en rechts verschillend ----------
    splits(pg,"Semimembranosus"); pg.wait_for_timeout(300)
    zetPlaatsen(pg,"Semimembranosus",2,"Rechts")
    kaart(pg,"Semimembranosus","Rechts").locator("select").nth(1).select_option("laag")
    pg.wait_for_timeout(600)
    t=T(); veilig(t,"L/R verschillend")
    links=t.split("LINKS - totaal")[1].split("RECHTS - totaal")[0]
    rechts=t.split("RECHTS - totaal")[1]
    check("links houdt 3 plaatsen", "verdeeld over 3 injectieplaatsen" in links)
    check("rechts krijgt 2 plaatsen", "2 x 25 E" in rechts, "| "+rechts.replace("\n"," / ")[:200])
    check("semimembranosus staat niet dubbel in links", links.count("Semimembranosus")==1)
    kopL=int(re.search(r'LINKS - totaal (\d+) E', t).group(1))
    kopR=int(re.search(r'RECHTS - totaal (\d+) E', t).group(1))
    check("subtotalen verschillen", kopL != kopR, "| %d vs %d" % (kopL, kopR))
    # Alleen de dosisregels tellen: die dragen hun kant als voorvoegsel.
    for pre, kop, naam in (("LINKS ", kopL, "links"), ("RECHTS ", kopR, "rechts")):
        rs=[l for l in t.split("\n") if l.startswith(pre) and re.search(r': (\d+) E', l)]
        som=sum(int(re.search(r': (\d+) E', l).group(1)) for l in rs)
        check("subtotaal %s = som van de %d regels" % (naam, len(rs)), som==kop,
              "| som %d, kop %d" % (som, kop))

    # ---------- tekort: meer plaatsen dan stappen ----------
    zetPlaatsen(pg,"Rectus femoris",12); pg.select_option("#doAfronding","20"); pg.wait_for_timeout(500)
    t=T(); veilig(t,"tekort")
    rf=[l for l in t.split("\n") if "Rectus" in l][0]
    check("tekort niet als '1 injectieplaats' weggeschreven",
          "in 1 injectieplaats" not in rf, "| "+rf)
    check("tekort benoemt de instelling", "12" in rf, "| "+rf)
    pg.select_option("#doAfronding","5"); zetPlaatsen(pg,"Rectus femoris",4); pg.wait_for_timeout(400)

    # ---------- krapte: spier valt af ----------
    pg.fill("#doVoorraad","60"); pg.wait_for_timeout(600)
    t=T(); veilig(t,"krapte")
    check("LET OP-blok verschijnt", "LET OP" in t, "| "+t.replace("\n"," / ")[-300:])
    check("afgevallen spier benoemd", "Niet behandeld, er was binnen de gestelde grenzen geen ruimte" in t)
    kop=t.split("LET OP")[1]
    namen=[l.split(" (")[0] for l in kop.split("\n") if l.endswith(")") and " (" in l]
    boven=t.split("LET OP")[0]
    check("er staan spieren in LET OP", len(namen)>0, "| "+kop[:120].replace("\n"," / "))
    for naam in namen:
        check("spier "+naam+" niet ook in LINKS/RECHTS", naam not in boven)
    pg.fill("#doVoorraad","600"); pg.wait_for_timeout(500)

    # ---------- lege tabelwaarde ----------
    pg.query_selector_all("#doMatrixBody input")[8].fill("")   # groot/hoog leeg
    kaart(pg,"Rectus femoris").locator("select").nth(1).select_option("hoog")
    pg.wait_for_timeout(600)
    t=T()
    check("ontbrekende tabelwaarde gemeld", "Geen dosis bepaald, de tabelwaarde ontbreekt" in t, "| "+t.replace("\n"," / ")[-260:])
    check("die spier niet in LINKS", "Rectus femoris" not in t.split("LET OP")[0].split("LINKS - totaal")[1])
    pg.query_selector_all("#doMatrixBody input")[8].fill("110")
    kaart(pg,"Rectus femoris").locator("select").nth(1).select_option("midden")
    pg.wait_for_timeout(500)

    # ---------- kopieerknop ----------
    pg.click("#doKopieer"); pg.wait_for_timeout(500)
    hint=pg.inner_text("#doKopieerHint")
    check("kopieermelding", "Gekopieerd" in hint, "| "+hint)
    klembord=pg.evaluate("navigator.clipboard.readText()")
    check("klembord = tekstvak", klembord==T(), "| verschil %d tekens" % abs(len(klembord)-len(T())))
    veilig(klembord, "klembord")

    pg.click("#doSelecteer"); pg.wait_for_timeout(300)
    sel=pg.evaluate("(()=>{const t=document.getElementById('doEpic');return [t.selectionStart,t.selectionEnd,t.value.length];})()")
    check("selecteer alles", sel[0]==0 and sel[1]==sel[2], "| "+str(sel))

    # ---------- geen patiëntgegevens mogelijk ----------
    check("geen invoerveld voor naam/datum buiten het tekstvak",
          pg.locator("#doEpic").count()==1)

    # ================= bevindingen uit de review, als regressietest =========
    print("\n--- review ---")
    pg.reload(); pg.wait_for_timeout(700)
    vulBasis(pg)

    # 1. Kant staat op ELKE dosisregel, niet alleen in de kop.
    kies(pg,"Soleus"); pg.wait_for_timeout(400)
    t=T()
    kop_uit = t.split("KLAARMAKEN")[0]
    dosisregels=[l for l in kop_uit.split("\n")
                 if re.search(r': \d+ E', l) and not l.startswith(("Totaal", "Maximaal", "Injectieplaatsen"))]
    check("elke dosisregel draagt de kant",
          all(l.startswith("LINKS ") or l.startswith("RECHTS ") for l in dosisregels),
          "| "+str(dosisregels[:2]))

    # 2. Volgorde gelijk aan het scherm.
    kies(pg,"Pronator teres"); pg.wait_for_timeout(300)
    kaart(pg,"Pronator teres").locator(".do-check input").nth(1).check(); pg.wait_for_timeout(600)
    scherm=[r.inner_text().split("\n")[0].split(" — ")[0] for r in pg.locator(".do-rij").all()]
    links=T().split("LINKS - totaal")[1].split("RECHTS")[0]
    tekst=[l.split(": ")[0].replace("LINKS ","") for l in links.split("\n") if ": " in l]
    check("volgorde tekst = volgorde scherm", scherm[:len(tekst)]==tekst, "| scherm %s tekst %s" % (scherm, tekst))

    # 3. Eigen aanpassingen worden niet overschreven.
    pg.click("#doEpic"); pg.keyboard.press("End")
    pg.locator("#doEpic").press_sequentially("\nEIGEN AANTEKENING")
    pg.wait_for_timeout(250)
    pg.click("#doGewicht"); pg.keyboard.press("End"); pg.keyboard.type("5"); pg.wait_for_timeout(600)
    check("eigen tekst blijft staan", "EIGEN AANTEKENING" in T(), "| "+T()[-80:].replace("\n"," / "))
    check("bijwerkknop verschijnt", pg.locator("#doVernieuw").is_visible())
    pg.click("#doVernieuw"); pg.wait_for_timeout(400)
    check("bijwerken vervangt de tekst", "EIGEN AANTEKENING" not in T())
    check("bijwerkknop weer weg", not pg.locator("#doVernieuw").is_visible())
    pg.fill("#doGewicht","22"); pg.wait_for_timeout(400)

    # 4. Kopieren filtert ook zelf getypte tekens.
    pg.click("#doEpic"); pg.keyboard.press("End")
    pg.evaluate("""() => { const t=document.getElementById('doEpic');
        t.value += '\\nGeplakt: \\u2014 \\u201Ckrom\\u201D \\u00d7 \\u00a0 \\u00b0C';
        t.dispatchEvent(new Event('input', {bubbles:true})); }""")
    pg.wait_for_timeout(250)
    check("vieze tekens staan er eerst wel in", "\u2014" in T())
    pg.click("#doKopieer"); pg.wait_for_timeout(500)
    veilig(T(), "na kopieren met eigen tekst")
    klem=pg.evaluate("navigator.clipboard.readText()")
    veilig(klem, "klembord met eigen tekst")
    check("em-dash omgezet", "-" in T() and "\u2014" not in klem)
    pg.click("#doVernieuw"); pg.wait_for_timeout(300)

    # 5. Tekort met een enkel depot wordt niet als '1 injectieplaats' weggeschreven.
    pg.on("dialog", lambda d: d.accept())
    pg.click("#doWisSessie"); pg.wait_for_timeout(400)
    kies(pg,"Flexor pollicis longus")
    kaart(pg,"Flexor pollicis longus").locator("select").nth(1).select_option("laag")
    zetPlaatsen(pg,"Flexor pollicis longus",3)
    pg.select_option("#doAfronding","10"); pg.wait_for_timeout(600)
    regel=[l for l in T().split("\n") if "Flexor pollicis" in l][0]
    check("tekort niet verzwegen", "in 1 injectieplaats" not in regel and "blijven leeg" in regel, "| "+regel)
    pg.select_option("#doAfronding","5"); pg.wait_for_timeout(400)

    # 6. Grens per kg zonder gewicht wordt niet geclaimd als toegepast.
    pg.fill("#doGewicht",""); pg.fill("#doMaxKg","30"); pg.wait_for_timeout(600)
    check("niet-toegepaste grens benoemd", "niet toegepast" in T(), "| "+[l for l in T().split("\n") if "E/kg" in l].__str__())
    pg.fill("#doGewicht","22"); pg.wait_for_timeout(400)
    check("mét gewicht wel toegepast", "niet toegepast" not in T() and "= 660 E" in T(),
          "| "+[l for l in T().split("\n") if "E/kg" in l].__str__())

    # 7. Regels blijven kort genoeg om leesbaar te blijven.
    pg.click("#doWisSessie"); pg.wait_for_timeout(300)
    for n in ["Rectus femoris","Semimembranosus","Semitendinosus","Biceps femoris",
              "Gastrocnemius mediaal","Gastrocnemius lateraal","Soleus","Tibialis posterior"]:
        kies(pg,n)
    pg.fill("#doVoorraad","40"); pg.wait_for_timeout(800)
    t=T(); veilig(t,"veel afgevallen spieren")
    check("LET OP zet elke spier op een eigen regel",
          max(len(l) for l in t.split("\n")) < 100, "| langste %d: %s" % (max(len(l) for l in t.split("\n")), max(t.split("\n"), key=len)[:110]))
    check("afgevallen spieren met kant erbij", "(beide)" in t, "| "+t.split("LET OP")[1][:160].replace("\n"," / "))

    print("\nfails:",fails,"| errors:",errs)
    b.close()
