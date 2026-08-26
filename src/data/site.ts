// Central place for Selmersbo's real contact & practical information.
// Content taken from the current selmersbo.dk – edit here to update the whole site.

export const site = {
  name: 'Selmersbo',
  full: 'Aktivhuset Selmersbo',
  tagline: 'Aktivhuset i Hørsholm',
  manager: 'Anne Hooge-Hansen',
  address: {
    street: 'Selmersvej 13',
    zip: '2970',
    city: 'Hørsholm',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Selmersvej+13,+2970+H%C3%B8rsholm',
  },
  phone: '4849 4300',
  clinicPhone: '4849 4199',
  email: 'selmersbo@horsholm.dk',
  facebook: 'https://www.facebook.com/',
  hours: [
    { day: 'Mandag', time: '09.30 – 16.00' },
    { day: 'Tirsdag', time: '09.30 – 16.00' },
    { day: 'Onsdag', time: 'Lukket', closed: true },
    { day: 'Torsdag', time: '09.30 – 16.00' },
    { day: 'Fredag', time: '09.30 – 14.00' },
  ],
} as const;

// Main navigation – mirrors the current site's structure, all real routes.
export const nav = [
  { label: 'Forside', href: '/' },
  { label: 'Nyheder', href: '/nyheder' },
  { label: 'Nyhedsbreve', href: '/nyhedsbreve' },
  { label: 'Udflugter', href: '/udflugter' },
  { label: 'Aktiviteter', href: '/aktiviteter' },
  { label: 'Galleri', href: '/galleri' },
  { label: 'Udlejning', href: '/udlejning' },
  { label: 'Mobile Pay', href: '/mobilepay' },
  { label: 'Generalforsamling', href: '/generalforsamling' },
  { label: 'Om os', href: '/om-os' },
] as const;

// News / highlights – replaces the coral "error-looking" blocks on the old site.
export const news = [
  {
    tag: 'Seniorsiden',
    title: 'Seniorsiden for august og september 2026',
    text: 'Se det samlede program for de kommende to måneder – foredrag, udflugter og faste aktiviteter.',
    cta: 'Se seniorsiden',
  },
  {
    tag: 'I pressen',
    title: 'Artikel i Ugebladet, august 2026',
    text: 'Om Trommens samarbejde med aktivitetscentrene i Hørsholm Kommune.',
    cta: 'Læs artiklen',
  },
  {
    tag: 'Hørsholm',
    title: 'Oplev Hørsholm – ny hjemmeside',
    text: 'Kommunens nye side samler oplevelser, kultur og fællesskaber ét sted.',
    cta: 'Besøg Oplev Hørsholm',
  },
] as const;
