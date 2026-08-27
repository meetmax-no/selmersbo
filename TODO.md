# TODO – Selmersbo

Status og resterende opgaver for den nye selmersbo.dk.
Marker: 🛠 = udvikleropgave · 👤 = indhold I selv udfylder (via CMS'et på `/admin`).

## ✅ Færdigt og live (CMS-styret)

- Forside
- **Nyheder** – fast besked, planlagte foredrag og månedens program (åbnes i modal)
- **Indstillinger** – kontakt + åbningstider redigeres ét sted, vises overalt
- **Aktiviteter** – 25 aktiviteter med billeder, status og "læs mere"-modal
- Udflugter
- **Udlejning** – rigtige vilkår og priser
- **Nyhedsbreve** – 13 måneder som læsbar tekst i modal (ingen PDF)
- Galleri
- CMS på `/admin`, automatisk deploy til Vercel

## 🔧 Gjenstår

### A. Flyt rigtigt indhold + gør redigerbart 🛠
1. ~~**Indstillinger (singleton)** – åbningstider + kontakt~~ ✅ *færdig*
2. **Om os** – flyt rigtigt indhold fra selmersbo.dk + CMS
3. **Mobile Pay** – rigtigt MobilePay-nummer + rigtig tekst + CMS (+ ret slug til `/mobile-pay`)
4. **Generalforsamling** – rigtig dato, dagsorden og dokumenter + CMS
5. ~~**Nyheder** – fast besked + foredrag + månedens program~~ ✅ *færdig*
6. **Forsidens velkomsttekst / hero** gøres redigerbar

### B. Indhold I udfylder 👤 (via CMS)
7. Resterende **aktivitetsbilleder** (dem vi endnu ikke har koblet på)
8. Rigtige **galleribilleder**
9. **Tilgængelighedserklæring** – officiel tekst (er eksempel nu)

### C. Funktionelle detaljer 🛠
10. Nyheder "Læs mere" → rigtige links
11. **Slug-parity** `/mobile-pay` + redirects fra de gamle Bricksite-URL'er
12. **Kort** på forsiden: rigtigt indlejret kort eller behold link

### D. Design & lancering
13. Rigtigt **logo/wordmark** (er stiliseret "S" nu)
14. **SEO**: OG-delebillede, `sitemap.xml`, `robots.txt`
15. **Domæne-cutover** `selmersbo.dk` → Vercel
16. Kort **redaktør-guide** ("sådan logger du ind og redigerer")
17. *(valgfrit)* privatlivsvenlig **analytics**

## Anbefalet rækkefølge

1. Indstillinger (åbningstider + kontakt)
2. Enkeltsiderne: Om os / Mobile Pay / Generalforsamling
3. Nyheder-tjek + funktionelle detaljer
4. Domæne + redaktør-guide → lancering
5. Polish (logo, SEO) løbende
