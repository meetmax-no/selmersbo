# TODO – Selmersbo

Status og resterende opgaver for den nye selmersbo.dk.
Marker: 🛠 = udvikleropgave · 👤 = indhold I selv udfylder (via CMS'et på `/admin`).

## ✅ Færdigt og live (CMS-styret)

- **Forside** – inkl. **Aktuelle links** (seniorside, avisartikel, Oplev Hørsholm) redigerbare i CMS
- **Nyheder** – fast besked, planlagte foredrag og månedens program (i modal)
- **Aktiviteter** – 25 aktiviteter med billeder, status og "læs mere"-modal
- **Udflugter** – med modal og tilmelding på kontoret
- **Udlejning** – rigtige vilkår og priser
- **Nyhedsbreve** – 13 måneder som læsbar tekst i modal (ingen PDF)
- **Galleri**
- **Om os** – formål, daglig ledelse, bestyrelse (med portrætter), de frivillige
- **Vedtægter** + **Privatlivspolitik** – egne sider, linket fra bunden
- **MobilePay** – rigtigt nummer (95956) + officielt logo + CMS
- **Indstillinger** – kontakt + åbningstider ét sted, vises overalt
- **Årstidstemaer** – efterår / vinter / forår / sommer (vælges i CMS)
- **Søg** – søger i hele siden (også personer), ingen cookies
- **Genveje** i bunden – redigerbare i CMS
- CMS på `/admin`, automatisk deploy til Vercel

## 🔧 Gjenstår

### B. Indhold I selv udfylder 👤 (via CMS)
1. Resterende **aktivitetsbilleder** (dem vi endnu ikke har koblet på)
2. Flere **galleribilleder** efter behov (14 rigtige er lagt ind)

### C. Funktionelle detaljer 🛠
3. **Redirect** `/mobile-pay` → `/mobilepay` (+ redirects fra gamle Bricksite-URL'er)

### D. Design & lancering 🛠
5. **Domæne-cutover** `selmersbo.dk` → Vercel (og skift evt. `site` i astro.config hvis nødvendigt)
6. *(valgfrit)* **Vercel Web Analytics** (cookieless besøgstal)

## Nyligt færdigt

- Om os · Vedtægter · Privatlivspolitik
- MobilePay (nummer, logo, klikbar betalingsknap)
- Indstillinger · Genveje · 4 årstidstemaer · Søg
- Forside (hero + velkomst) redigerbar i CMS
- Galleri (14 rigtige billeder) + Quiz-side
- **Generalforsamling** (dagsorden + indkaldelse, beretning, referater)
- Rigtigt **logo** i top og bund
- Tilgængelighedserklæring fjernet (efter aftale)
- **SEO**: sitemap, robots.txt, OG-delebillede, canonical/Open Graph
- **Redaktør-guide** på dansk (REDAKTOER-GUIDE.md + delt side)
- **Google-kort** indlejret på forsiden

## Anbefalet rækkefølge

1. Redirects + kort (funktionelle detaljer)
2. SEO (polish)
3. Domæne-cutover + redaktør-guide → lancering
