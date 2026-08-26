# Selmersbo – ny hjemmeside (designudkast 2026)

Moderne redesign af [selmersbo.dk](https://selmersbo.dk) for **Aktivhuset Selmersbo**,
et aktivitets- og samværshus for seniorer i Hørsholm.

Dette er et **designudkast (mockup)** med to sider – forsiden og en aktivitetsside –
bygget som fundament for videre udvikling.

## Hvad er nyt i forhold til den nuværende side

| Før (Bricksite) | Nu (dette udkast) |
| --- | --- |
| Grå baggrund, systemfont (Arial) | Varm, lys palet og rigtig webtypografi (Fraunces + Inter) |
| Korallrøde "fejl-lignende" lenkeblokke | Rolige nyhedskort med tydelig hierarki |
| Blandet ALL CAPS / spærret tekst | Konsistent typografisk skala, stor og læsbar |
| Intet klart førsteindtryk | Hero med rigtigt foto og tydelige knapper |
| Ustylet Google Maps-embed | Ryddigt lokationskort + link til kort |
| Ingen mobilmenu | Responsivt, mobil-først design |

Fokus: **varmt, roligt og let at bruge** – med god tilgængelighed (WCAG AA-kontrast,
store tekster, synligt tastaturfokus, "spring til indhold"-link).

## Teknologi

- [Astro](https://astro.build) 5 – statisk HTML, minimal JavaScript
- Selv-hostede variable fonts via `@fontsource-variable` (ingen eksterne kald)
- Ren CSS med design-tokens (`src/styles/global.css`)
- Kører på **Node 24** (se `.nvmrc`)

## Kom i gang

```bash
nvm use            # Node 24
npm install
npm run dev        # http://localhost:4321
npm run build      # statisk output i dist/
npm run preview    # forhåndsvis produktionsbuild
```

## Struktur

```
public/
  admin/              Sveltia CMS (redigering) – index.html + config.yml + bundle
  images/             Fotos (CMS uploader udflugts-billeder til images/udflugter)
src/
  content.config.ts   Skema for "udflugter"-collection (valideres ved build)
  content/udflugter/  Én Markdown-fil pr. udflugt (redigeres via CMS)
  data/site.ts        Kontaktinfo, åbningstider, menu, nyheder
  data/activities.ts  Aktiviteter (eksempeldata til udkastet)
  components/          Header, Footer, ActivityCard, Icon, PageHero, CtaBand
  layouts/            BaseLayout
  pages/
    index.astro       Forsiden
    aktiviteter.astro Aktiviteter (+ de øvrige sider)
    api/oauth/         GitHub-login til CMS (kører på Vercel)
```

## Redigering: Sveltia CMS

Indholdet styres gennem en headless CMS på `/admin`. Tre collections er
koblet på:

| Collection | Sider | Filer |
| --- | --- | --- |
| **Udflugter** | /udflugter | `src/content/udflugter/` |
| **Nyheder** | Forsiden + /nyheder | `src/content/nyheder/` |
| **Aktiviteter** | Forsiden + /aktiviteter | `src/content/aktiviteter/` |
| **Udlejning** (side + priser) | /udlejning | `src/content/udlejning/index.md` |

Redaktøren udfylder felter (fx titel, dato, tekst, billede) og gemmer –
ændringen bliver en commit i repoet, og Vercel bygger siden på ny.

**Prøv lokalt uden opsætning:**
1. `npm run dev`
2. Åbn `http://localhost:4321/admin/`
3. Klik **“Work with Local Repository”** og vælg denne mappe. Nu kan du oprette
   og redigere udflugter, og filerne skrives direkte i `src/content/udflugter/`.

**Produktion på Vercel (så redaktører kan logge ind i browseren):**
1. Opret en **GitHub OAuth App** (Settings → Developer settings → OAuth Apps):
   - *Homepage URL*: jeres Vercel-domæne
   - *Authorization callback URL*: `https://<domæne>/api/oauth/callback`
2. Sæt to **Environment Variables** i Vercel:
   - `GITHUB_OAUTH_ID` = OAuth App'ens Client ID
   - `GITHUB_OAUTH_SECRET` = Client Secret
3. Ret `base_url` i `public/admin/config.yml` til det domæne, der serverer siden.
4. Inviter redaktørerne som collaborators på `meetmax-no/selmersbo`.

Redaktørerne logger derefter ind med deres (gratis) GitHub-konto via
**“Sign In with GitHub”**. Kun 1–2 personer skal have adgang.

> Vi startede med **Udflugter** som spike. Resten af indholdet (nyheder,
> aktiviteter, m.m.) kan flyttes ind i tilsvarende collections på samme måde.

## Bemærk

Aktivitetsdata og nogle nyheder er stadig **eksempelindhold** til udkastet.
Fotos stammer fra den nuværende selmersbo.dk og bruges som pladsholdere.
