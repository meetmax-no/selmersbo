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
public/images/        Rigtige fotos fra Selmersbo
src/
  data/site.ts        Kontaktinfo, åbningstider, menu, nyheder
  data/activities.ts  Aktiviteter (eksempeldata til udkastet)
  components/          Header, Footer, ActivityCard, Icon
  layouts/            BaseLayout
  pages/
    index.astro       Forsiden
    aktiviteter.astro Aktiviteter
```

## Bemærk

Aktivitetsdata og nogle nyheder er **eksempelindhold** til udkastet.
Rigtige fotos stammer fra den nuværende selmersbo.dk og bruges her som
pladsholdere for redesignet.
