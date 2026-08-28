# TODO – Selmersbo

Status for den nye selmersbo.dk.
Marker: 🛠 = udvikleropgave · 👤 = indhold I selv udfylder (via CMS'et på `/admin`).

## ✅ Færdigt og live

- **Forside** – hero + velkomst + **Aktuelle links** (seniorside, avisartikel, Oplev Hørsholm), alt i CMS
- **Nyheder** – fast besked, foredrag og månedens program (modal)
- **Aktiviteter** – 25 aktiviteter med status og "læs mere"-modal
- **Udflugter** – modal + tilmelding på kontoret
- **Udlejning** – rigtige vilkår og priser
- **Nyhedsbreve** – 13 måneder som læsbar tekst (modal)
- **Galleri** (14 billeder) + **Quiz**-side
- **Om os** – formål, daglig ledelse, bestyrelse (portrætter), frivillige
- **Generalforsamling** – dagsorden, indkaldelse, beretning, referater
- **Vedtægter** + **Privatlivspolitik** – egne sider, linket fra bunden
- **MobilePay** – nummer 95956 + logo + klikbar knap (skjules på iPad, hvor appen ikke findes)
- **Aktuelle links** peger på lokalt hostede PDF'er (tilbage-knappen virker)
- **Indstillinger** – kontakt + åbningstider ét sted
- **Årstidstemaer** (efterår/vinter/forår/sommer) · **Søg** · **Genveje** – alt i CMS
- **Statisk kort** på forsiden der linker til Google Maps (ingen cookies)
- **404-side** · **SEO** (sitemap, robots.txt, OG-billede, canonical/Open Graph)
- **Redaktør-guide** på dansk (REDAKTOER-GUIDE.md + delt printvenlig side)
- **Statistik-side** (`/statistik`, kun for bestyrelsen): besøgstal, mest besøgte sider,
  mest åbnede aktiviteter / udflugter / nyhedsbreve, telefon/PC. Live fra Vercel Web
  Analytics, anonymt/cookiefrit, opdaterer sig selv (~10 min cache). Kræver
  miljøvariablen `VERCEL_TOKEN` i Vercel (er sat op).
- **Redirect** `/mobile-pay` → `/mobilepay`
- CMS på `/admin` med GitHub-login, automatisk deploy til Vercel

## 🔧 Gjenstår

### Indhold I selv udfylder 👤 (via CMS – ikke nødvendigt for lancering)
1. **Aktivitetsbilleder: færdige.** 22 af 25 har foto (hentet fra selmersbo.dk);
   de sidste 3 (sygeplejeklinik, yoga, gymnastik) har egne ikoner, da der ikke
   findes fotos. Nye fotos kan altid lægges ind i CMS.
2. Flere **galleribilleder** efter behov.

### Lancering 🛠
3. **Domæne-cutover**: peg `selmersbo.dk` mod Vercel (kræver adgang til hvor domænet
   er registreret / DNS). Indtil da lever siden på `selmersbo.vercel.app`.
   Skift evt. `site` i `astro.config.mjs` hvis nødvendigt.
