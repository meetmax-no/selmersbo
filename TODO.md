# TODO – Selmersbo

Status og resterende opgaver for den nye selmersbo.dk.
Marker: 🛠 = udvikleropgave · 👤 = indhold I selv udfylder (via CMS'et på `/admin`).

## ✅ Færdigt og live (CMS-styret)

- **Forside**
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

### A. Indhold der skal flyttes / gøres redigerbart 🛠
1. **Generalforsamling** – rigtig dato, dagsorden og dokumenter + CMS
2. **Forsidens velkomsttekst / hero** gøres redigerbar i CMS

### B. Indhold I selv udfylder 👤 (via CMS)
3. Resterende **aktivitetsbilleder** (dem vi endnu ikke har koblet på)
4. Rigtige **galleribilleder**
5. **Tilgængelighedserklæring** – officiel tekst (er eksempel nu)

### C. Funktionelle detaljer 🛠
6. **Redirect** `/mobile-pay` → `/mobilepay` (+ redirects fra gamle Bricksite-URL'er)
7. **Kort** på forsiden: rigtigt indlejret kort eller behold link

### D. Design & lancering 🛠
8. Rigtigt **logo/wordmark** (er stiliseret "S" nu)
9. **SEO**: OG-delebillede, `sitemap.xml`, `robots.txt`
10. **Domæne-cutover** `selmersbo.dk` → Vercel
11. Kort **redaktør-guide** ("sådan logger du ind og redigerer")
12. *(valgfrit)* **Vercel Web Analytics** (cookieless besøgstal)

## Anbefalet rækkefølge

1. Generalforsamling + hero-tekst redigerbar (sidste indhold)
2. Redirects + kort (funktionelle detaljer)
3. Logo + SEO (polish)
4. Domæne-cutover + redaktør-guide → lancering
