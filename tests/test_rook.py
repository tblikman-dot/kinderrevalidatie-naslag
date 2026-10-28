# Rooktest over de hele app: opent elke pagina, controleert op console-errors,
# ontbrekende bestanden en horizontale scroll. Vervangt de suites die met de
# container verdwenen; bewust in de repo gezet zodat dat niet weer gebeurt.
import sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hulp import *
from playwright.sync_api import sync_playwright
B="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
PAGINAS=["index.html","dosering.html","rcp-spieren.html","rotatie.html",
         "metatarsus.html","heupecho.html","heupfoto.html","groeisturing.html","epifysiodese.html",
         "beslisboom-heup.html","gmfcs.html","doelspieren.html","spasticiteit-dystonie.html",
         "myotomen.html","zenuwen.html","zenuwherstel.html","beenlengte.html","heupdysplasie.html",
         "hipscreen.html","tetheredcord.html","neurogene-blaas.html","ddh-stroomschema.html","claude-code.html",
         "emla.html","echo-landmarks.html"]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=B)
    fails=0
    for naam in PAGINAS:
        pg=b.new_context(viewport={"width":390,"height":844}).new_page()
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        bad=[]; pg.on("response", lambda r: bad.append((r.url.split("/")[-1],r.status)) if r.status>=400 else None)
        pg.goto("http://localhost:9052/"+naam); pg.wait_for_timeout(500)
        sw=pg.evaluate("document.documentElement.scrollWidth")
        ok = not errs and not bad and sw<=390
        if not ok: fails+=1
        print(("OK  " if ok else "FAIL"), naam, "| scrollWidth", sw,
              ("| errors "+str(errs) if errs else ""), ("| 4xx "+str(bad) if bad else ""))
        pg.close()

    # kern van de doseringsplanner blijft werken
    pg=b.new_context(viewport={"width":390,"height":900}).new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://localhost:9052/dosering.html"); pg.wait_for_timeout(600)
    def check(n, ok, extra=""):
        global fails
        print(("OK  " if ok else "FAIL"), n, extra)
        if not ok: fails+=1
    check("36 spieren in de kiezer", pg.locator(".do-chip").count()==36, "| "+str(pg.locator(".do-chip").count()))
    check("6 contra-indicaties", pg.locator("#doCI label").count()==6)
    check("9 dosisvelden", len(pg.query_selector_all("#doMatrixBody input"))==9)
    check("drie plafondvelden", all(pg.locator(s).count()==1 for s in ["#doMaxKg","#doMaxAbs","#doMaxPlaats"]))
    vulBasis(pg); kies(pg,"Soleus"); pg.wait_for_timeout(400)
    uit=pg.inner_text("#doUit")
    check("schema rekent", "Soleus — beide kanten" in uit and "160 E" in uit, "| "+" ".join(uit.split())[:140])
    check("spuitjes geteld", "Klaarmaken:" in uit)
    check("RCP-bereik op de kaart", "RCP BOTOX" in pg.locator(".do-spier").first.inner_text())
    pg.fill("#doLeeftijd","4"); pg.wait_for_timeout(400)
    check("richtlijn 25 E/kg", "25 E/kg" in pg.inner_text("#doRichtlijn"))
    check("lokaal protocol", "Lokaal behandelprotocol" in pg.inner_text("#doRichtlijn"))
    check("dossiertekst gevuld", "PLAN VOOR DEZE SESSIE" in pg.input_value("#doEpic"))
    pg.close()

    # startscherm: het hulpmiddelenoverzicht
    ctx=b.new_context(viewport={"width":390,"height":844})
    pg=ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://localhost:9052/index.html"); pg.wait_for_timeout(600)
    rijen=pg.locator("#hmLijst .hm-rij")
    check("hulpmiddelen op het startscherm", rijen.count()>=23, "| "+str(rijen.count()))
    check("in groepen", pg.locator("#hmLijst .hm-groep").count()==6)

    # een knop in dit overzicht mag nooit naar een niet-bestaande pagina wijzen
    hrefs=[rijen.nth(i).get_attribute("href") for i in range(rijen.count())]
    stuk=[h for h in hrefs if ctx.request.get("http://localhost:9052/"+h).status>=400]
    check("geen dode links", not stuk, "| "+str(stuk))
    check("geen dubbele", len(hrefs)==len(set(hrefs)), "| "+str(len(hrefs)-len(set(hrefs)))+" dubbel")

    pg.click("#tabOnder"); pg.wait_for_timeout(250)
    check("tabblad wisselt", pg.locator("#catList").is_visible() and not pg.locator("#hmLijst").is_visible())
    pg.fill("#zoek","heup"); pg.wait_for_timeout(350)
    check("zoeken toont beide panelen",
          pg.locator("#panelHulp").is_visible() and pg.locator("#panelOnder").is_visible())
    check("zoeken filtert de hulpmiddelen", 0 < pg.locator("#hmLijst .hm-rij").count() < 23,
          "| "+str(pg.locator("#hmLijst .hm-rij").count()))
    pg.fill("#zoek",""); pg.wait_for_timeout(300)
    check("na wissen weer één paneel", not pg.locator("#panelHulp").is_visible())
    pg.close()

    pg=b.new_context(viewport={"width":1280,"height":880}).new_page()
    pg.goto("http://localhost:9052/index.html"); pg.wait_for_timeout(600)
    check("breed scherm: overzicht naast de onderwerpen",
          pg.locator("#hmStart .hm-rij").first.is_visible()
          and pg.locator("#panelOnder").is_visible()
          and not pg.locator(".tabs").is_visible())
    pg.locator("#catList .cat-item").first.click(); pg.wait_for_timeout(300)
    check("breed scherm: terugknop aanwezig", pg.locator("#backBtn").is_visible())
    pg.click("#backBtn"); pg.wait_for_timeout(250)
    check("breed scherm: terug op het overzicht", pg.locator("#hmStart .hm-rij").first.is_visible())

    print("\nfails:",fails,"| errors:",errs)
    b.close()
