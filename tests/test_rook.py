# Rooktest over de hele app: opent elke pagina, controleert op console-errors,
# ontbrekende bestanden en horizontale scroll. Vervangt de suites die met de
# container verdwenen; bewust in de repo gezet zodat dat niet weer gebeurt.
import sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hulp import *
from playwright.sync_api import sync_playwright
B="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
PAGINAS=["index.html","dosering.html","rcp-spieren.html","perioperatief.html","rotatie.html",
         "metatarsus.html","heupecho.html","heupfoto.html","groeisturing.html","epifysiodese.html",
         "beslisboom-heup.html","gmfcs.html","doelspieren.html","spasticiteit-dystonie.html",
         "myotomen.html","zenuwen.html","zenuwherstel.html","beenlengte.html","heupdysplasie.html",
         "hipscreen.html","tetheredcord.html","neurogene-blaas.html","ddh-stroomschema.html"]
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
    print("\nfails:",fails,"| errors:",errs)
    b.close()
