def kaart(pg, naam, kant=None):
    """Index van de spierkaart, elke keer opnieuw opgezocht (de lijst wordt hertekend)."""
    for k in range(pg.locator(".do-spier").count()):
        c = pg.locator(".do-spier").nth(k)
        if not c.inner_text().startswith(naam): continue
        if kant and kant not in c.locator(".do-kantknoppen button.aan").inner_text(): continue
        return c
    raise AssertionError("kaart niet gevonden: %s %s" % (naam, kant or ""))

def zetPlaatsen(pg, naam, n, kant=None):
    kaart(pg, naam, kant).locator("input[type=number]").first.fill(str(n)); pg.wait_for_timeout(250)

def splits(pg, naam):
    kaart(pg, naam).locator("button", has_text="links en rechts apart").click(); pg.wait_for_timeout(350)

def kies(pg, naam):
    pg.locator(".do-chip", has_text=naam).first.click(); pg.wait_for_timeout(250)

def vulBasis(pg, voorraad="600"):
    V=[10,15,20,25,40,55,50,80,110]
    for i,inp in enumerate(pg.query_selector_all("#doMatrixBody input")): inp.fill(str(V[i]))
    pg.fill("#doGewicht","22"); pg.fill("#doMaxKg","30"); pg.fill("#doMaxAbs","700")
    pg.fill("#doMaxPlaats","50"); pg.fill("#doVoorraad",voorraad); pg.wait_for_timeout(300)
