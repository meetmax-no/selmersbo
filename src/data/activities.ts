// Representative example activities for a senior activity centre.
// NOTE: This is placeholder/demo content for the redesign mockup –
// Selmersbo replaces it with their real programme.

export type Activity = {
  title: string;
  icon: string; // key into Icon.astro
  day: string;
  text: string;
};

export const activities: Activity[] = [
  {
    title: 'Kor & sang',
    icon: 'music',
    day: 'Mandag',
    text: 'Syng sammen i et hyggeligt fællesskab – alle stemmer er velkomne, ingen erfaring nødvendig.',
  },
  {
    title: 'Stolegymnastik',
    icon: 'heart',
    day: 'Tirsdag',
    text: 'Blid træning af balance, styrke og bevægelighed – tilpasset alle og med god tid til en snak.',
  },
  {
    title: 'Bridge & kortspil',
    icon: 'cards',
    day: 'Tirsdag',
    text: 'Fast spil for både øvede og nybegyndere. Kom alene eller med en makker.',
  },
  {
    title: 'IT-hjælp',
    icon: 'device',
    day: 'Torsdag',
    text: 'Få hjælp til mobil, MitID, e-Boks og computer af frivillige – helt i dit eget tempo.',
  },
  {
    title: 'Foredrag',
    icon: 'mic',
    day: 'Torsdag',
    text: 'Spændende oplægsholdere om rejser, historie, natur og aktuelle emner.',
  },
  {
    title: 'Håndarbejde',
    icon: 'thread',
    day: 'Fredag',
    text: 'Strik, hækling og kreative projekter i godt selskab omkring det store bord.',
  },
  {
    title: 'Fællesspisning',
    icon: 'plate',
    day: 'Fredag',
    text: 'Et varmt måltid og et endnu varmere fællesskab. Tilmelding i huset.',
  },
  {
    title: 'Udflugter',
    icon: 'bus',
    day: 'Månedligt',
    text: 'Ture ud i det blå til seværdigheder, museer og natur i og omkring Hørsholm.',
  },
];

// Simple weekly rhythm for the schedule section (demo content).
export const weekPlan: { day: string; items: string[] }[] = [
  { day: 'Mandag', items: ['Kor & sang', 'Café åben'] },
  { day: 'Tirsdag', items: ['Stolegymnastik', 'Bridge & kortspil'] },
  { day: 'Onsdag', items: ['Lukket'] },
  { day: 'Torsdag', items: ['IT-hjælp', 'Foredrag'] },
  { day: 'Fredag', items: ['Håndarbejde', 'Fællesspisning'] },
];
