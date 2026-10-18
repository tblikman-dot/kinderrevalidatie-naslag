# Emla-smeerinstructie: de acht regio's, het briefje en de tekst voor de brief.
#
# Waar dit vooral op let: de zinnen moeten lETTERLIJK die van de poster zijn
# (ze zijn overgetypt, niet herschreven), het briefje moet op één A4 passen, en
# er mag niets bewaard worden.
import sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright

B = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
URL = "http://localhost:9052/emla.html"

# Letterlijk van de poster. Wijkt een zin hiervan af, dan is er iets herschreven.
ZINNEN = [
    "Smeer het midden van de voorzijde van het bovenbeen in, over de gehele lengte van de rectus femoris.",
    "Smeer de volledige voorzijde van het bovenbeen in (quadricepsregio), van heup tot net boven de knie.",
    "Smeer de binnenzijde van het bovenbeen in, over de volledige adductorenregio (van lies tot knie).",
    "Smeer de achterzijde van het bovenbeen in, over de volledige hamstringsregio (van bilplooi tot net boven de knie).",
    "Smeer de volledige kuit in, van net onder de knieplooi tot aan de hiel (triceps surae-regio: gastrocnemius en soleus).",
    "Smeer de voorzijde van het onderbeen in, over de volledige voorste onderbeenregio (van knie tot enkel).",
    "Smeer de mediale zijde van de voet in, over de spierbuik van de abductor hallucis.",
    "Smeer de onderkant van de voet in, van de hiel tot aan de tenen.",
]
ALLE = ["Rectus femoris", "Quadricepsregio", "Adductorenregio", "Hamstringsregio",
        "Triceps surae-regio", "Voorzijde onderbeen", "Mediale zijde van de voet",
        "Plantaire zijde van de voet"]

fails = 0


def check(naam, ok, extra=""):
    global fails
    print(("OK  " if ok else "FAIL"), naam, extra)
    if not ok:
        fails += 1


def kies(pg, naam):
    pg.locator(".em-kaart", has_text=naam).first.click()
    pg.wait_for_timeout(90)


with sync_playwright() as p:
    b = p.chromium.launch(executable_path=B)
    pg = b.new_context(viewport={"width": 390, "height": 900}).new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL)
    pg.wait_for_timeout(500)

    check("acht regio's", pg.locator(".em-kaart").count() == 8,
          "| " + str(pg.locator(".em-kaart").count()))
    check("geen horizontale scroll", pg.evaluate("document.documentElement.scrollWidth") <= 390)
    check("leeg briefje legt uit wat te doen", "Kies hierboven" in pg.inner_text("#emBlad"))
    check("leeg: geen tekst voor de brief", pg.input_value("#emEpic") == "")

    data = pg.evaluate("() => EMLA.regios.map(r => r.zin)")
    ontbreekt = [z for z in ZINNEN if z not in data]
    check("zinnen letterlijk van de poster", not ontbreekt, "| anders: " + str(ontbreekt)[:160])
    check("elke regio heeft een tekening",
          pg.evaluate("() => EMLA.regios.every(r => /<svg/.test(r.svg))"))

    # kiezen, kant wisselen
    kies(pg, "Rectus femoris")
    blad = pg.inner_text("#emBlad")
    check("standaard beide zijden", "beide zijden" in blad)
    pg.locator(".em-kaart", has_text="Rectus femoris").first.locator(".em-kant", has_text="Links").click()
    pg.wait_for_timeout(200)
    blad = pg.inner_text("#emBlad")
    check("kant komt op het briefje", "links" in blad and "beide zijden" not in blad)
    kies(pg, "Triceps surae-regio")
    pg.wait_for_timeout(150)
    check("tweede regio erbij", pg.locator(".em-bladregio").count() == 2)
    kies(pg, "Triceps surae-regio")  # weer uit
    pg.wait_for_timeout(150)
    check("nog eens tikken zet hem weer uit", pg.locator(".em-bladregio").count() == 1)

    # tijd terugrekenen
    pg.fill("#emTijd", "14:30")
    pg.wait_for_timeout(250)
    check("60 minuten eerder", "13:30" in pg.inner_text("#emUitkomst"))
    check("tijd staat op het briefje", "13:30" in pg.inner_text("#emBlad"))
    pg.fill("#emTijd", "00:30")
    pg.wait_for_timeout(250)
    check("over middernacht heen", "23:30" in pg.inner_text("#emUitkomst"),
          "| " + pg.inner_text("#emUitkomst"))
    pg.fill("#emTijd", "")
    pg.wait_for_timeout(200)
    check("zonder tijd de algemene regel",
          "Minimaal 60 minuten" in pg.inner_text("#emBlad") and pg.inner_text("#emUitkomst") == "")

    # tekst voor de brief: moet zonder opmaakschade te plakken zijn
    for naam in ALLE:
        if naam not in ("Rectus femoris",):
            kies(pg, naam)
    pg.fill("#emTijd", "09:15")
    pg.wait_for_timeout(400)
    t = pg.input_value("#emEpic")
    check("alles in de tekst", all(z.split(",")[0][:40] for z in ZINNEN) and len(t) > 900,
          "| " + str(len(t)) + " tekens")
    check("alleen ASCII", all(ord(c) < 127 for c in t),
          "| " + str(sorted({c for c in t if ord(c) >= 127})))
    check("geen tabs", "\t" not in t)
    check("geen inspringing", not any(r.startswith(" ") for r in t.split("\n")))
    check("geen regel die een opsomming wordt",
          not any(r[:2] in ("- ", "* ", "# ", "> ", "+ ") or
                  (r[:1].isdigit() and r[1:2] in (".", ")"))
                  for r in t.split("\n")))
    check("geen spaties aan het regeleind", not any(r != r.rstrip() for r in t.split("\n")))
    check("geen drie lege regels achter elkaar", "\n\n\n" not in t)
    check("8 regio's in de tekst", sum(t.count(n) for n in ALLE) >= 8)
    check("terugrekentijd in de tekst", "08:15" in t, "| " + t.split("\n")[2][:70])
    check("bron erbij", "UMCG Centrum voor Revalidatie" in t)

    # leegmaken en herladen laten niets achter
    pg.click("#emWis")
    pg.wait_for_timeout(250)
    check("leegmaken werkt", pg.locator(".em-bladregio").count() == 0 and pg.input_value("#emTijd") == "")
    kies(pg, "Hamstringsregio")
    pg.fill("#emTijd", "11:00")
    pg.wait_for_timeout(200)
    opgeslagen = pg.evaluate("() => Object.keys(localStorage).filter(k => /emla/i.test(k))")
    check("niets in localStorage", opgeslagen == [], "| " + str(opgeslagen))
    pg.reload()
    pg.wait_for_timeout(500)
    check("na herladen leeg", pg.locator(".em-bladregio").count() == 0)
    pg.close()

    # printweergave: alleen het briefje, en het past op één A4
    # (A4 min 12mm marges is ongeveer 703 x 1032 px bij 96 dpi)
    pg = b.new_context(viewport={"width": 703, "height": 1032}).new_page()
    pg.goto(URL)
    pg.wait_for_timeout(400)
    for naam in ALLE:
        kies(pg, naam)
    # het zwaarste geval: alles aangevinkt én een tijd ingevuld
    pg.fill("#emTijd", "14:30")
    pg.wait_for_timeout(300)
    pg.emulate_media(media="print")
    pg.wait_for_timeout(200)
    hoogte = pg.evaluate("document.body.scrollHeight")
    check("acht regio's én een tijd passen op één A4", hoogte <= 1032, "| " + str(hoogte) + " px")
    check("app-onderdelen staan niet op papier",
          not pg.locator(".topbar").is_visible()
          and not pg.locator("#emRaster").is_visible()
          and not pg.locator("#emEpic").is_visible())
    check("het briefje staat er wel op", pg.locator("#emBlad").is_visible())
    pg.close()

    print("\nfails:", fails, "| errors:", errs)
    b.close()
