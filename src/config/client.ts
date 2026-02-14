/**
 * Living Library — Client Configuration
 *
 * This is the ONLY file you change per client.
 * Everything else is template code.
 */

export const client = {
  // ── Identity ──
  name: 'Josh Galt',
  slug: 'josh-galt',
  tagline: 'Artist · Athlete · Entrepreneur',
  bio: `Josh Galt is an entrepreneur, explorer, and lifelong student of nature. A former extreme whitewater athlete and sports/lifestyle model (Nike, Adidas, Men's Health), he's spent nearly two decades as a #GlobalNomad — long before hashtags were even a thing — living and working in over 70 countries.

He splits his time between Latin America and Southeast Asia's booming ASEAN region, keeping boots on the ground in as many new places as he can each year.

Josh transitioned from exploring remote, epic whitewater rivers to building brands at the frontier of health, wellness, and sustainability. Today his focus is on bioactive nutrition leading regenerative systems — a vision he calls "Waste to Soil to Superfoods" and is encapsulated in the new hive-fermented™ superfood called BEEGHEE®.

Before this, in 2020 he co-founded Point68 Insect Beauty in partnership with Sibu®, launching the world's first premium cosmetic line based on insect oil. The brand won Best Skincare Product at LOHAS Hong Kong 2021.

Earlier, in 2017, he created Entovegan, an experimental nutrition project demonstrating the power of insects + plants as a sustainable dietary framework. Though no longer actively promoting it, Entovegan has grown into a global movement introducing edible insects to the plant-based community.

And previously, Josh spent over a decade creating, competing in, and directing outdoor adventure sports events. Highlights include serving as Water Director for Primal Quest®, billed as "The World's Most Challenging Human Endurance Competition", directing the first two Riverboarding World Championships, and founding the World Riverboarding Association as its first President.

After 20+ years as a pioneer in the whitewater industry, Josh was named one of "110 Outdoor Ambassadors of the Past 110 Years" by Gear Junkie, joining a list that included many of his own heroes.`,
  siteTitle: 'Josh Galt — Living Library',
  siteDescription:
    'Ask Josh anything. An AI-powered conversational interface trained on his complete body of work.',
  domain: 'joshgalt.com',

  // ── Supabase ──
  supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '',

  // ── Chat topic pills (initial state) ──
  topics: [
    { label: 'Whitewater', q: "Tell me about Josh's history in whitewater sports" },
    { label: 'Spirituality', q: 'What is the Bad At My Religion podcast about?' },
    { label: 'Fermentation', q: 'What is BEEGHEE and how did it start?' },
    { label: 'Technology', q: 'What does Josh think about AI and technology?' },
  ],

  // Content items fetched from Supabase at runtime (see lib/supabase.ts)

  // ── External links (about panel) ──
  links: [
    { label: 'joshgalt.com', url: 'https://joshgalt.com' },
    { label: 'BEEGHEE', url: 'https://beeghee.com' },
    { label: 'Bad At My Religion', url: '#' },
    { label: 'Face Level', url: '#' },
    { label: 'Anabasis Intelligence', url: 'https://anabasisintelligence.com' },
  ],

  // ── Theme (Minority Report aesthetic) ──
  theme: {
    bg: '#080c14',
    text: '#e0e4ec',
    dim: '#5a6280',
    muted: '#2a3048',
    cyan: '#00d4ff',
    cyanMed: 'rgba(0,212,255,0.25)',
    cyanLow: 'rgba(0,212,255,0.08)',
    cyanGlow: 'rgba(0,212,255,0.04)',
    amber: '#f5a623',
    amberLow: 'rgba(245,166,35,0.1)',
    border: 'rgba(255,255,255,0.05)',
    borderLit: 'rgba(0,212,255,0.2)',
    panel: 'rgba(255,255,255,0.025)',
    panelHover: 'rgba(255,255,255,0.05)',
  },
} as const;

export type ClientConfig = typeof client;
