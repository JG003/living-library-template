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
  tagline: 'Writer · Entrepreneur · Explorer',
  bio: 'Writer, entrepreneur, explorer. 70+ countries. Founder of BEEGHEE. Host of Bad At My Religion.',
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

  // ── Content library items (fetched from Supabase at build time, or hardcoded for MVP) ──
  contentItems: [
    { title: 'BAMR Death is Access to Life', type: 'BLOG', date: '2025-12-19' },
    { title: 'BAMR Who Holds The Truth', type: 'BLOG', date: '2025-12-03' },
    { title: 'GALTmode → Venturopoly: Christopher Hill', type: 'BLOG', date: '2025-11-06' },
    { title: 'AI: Less Artificial, More Ancient Intelligence', type: 'BLOG', date: '2025-09-30' },
    { title: 'GALTmode → What Is Your Price', type: 'BLOG', date: '2025-09-20' },
    { title: 'POLISHING CHOSEN ALTARS', type: 'BLOG', date: '2025-08-19' },
    { title: 'Insanity, Delusion, & The Power of Clarity', type: 'BLOG', date: '2025-10-13' },
  ],

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
