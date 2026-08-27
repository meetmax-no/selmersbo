// Central place for Selmersbo's real contact & practical information.
// Content taken from the current selmersbo.dk – edit here to update the whole site.

export const site = {
  theme: 'efteraar',
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
  facebook: 'https://www.facebook.com/groups/146686506050448',
  mobilepay: '95956',
  hours: [
    { day: 'Mandag', time: '09.30 – 16.00' },
    { day: 'Tirsdag', time: '09.30 – 16.00' },
    { day: 'Onsdag', time: 'Lukket', closed: true },
    { day: 'Torsdag', time: '09.30 – 16.00' },
    { day: 'Fredag', time: '09.30 – 14.00' },
  ],
  footerLinks: [
    { label: 'Søg', url: '/soeg' },
    { label: 'Om os', url: '/om-os' },
    { label: 'MobilePay', url: '/mobilepay' },
    { label: 'Vedtægter', url: '/dokumenter/vedtaegter' },
    { label: 'Privatlivspolitik', url: '/dokumenter/privatlivspolitik' },
    { label: 'Facebook', url: 'https://www.facebook.com/groups/146686506050448' },
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

// News lives in the "nyheder" content collection (src/content/nyheder/),
// edited through the CMS.
