# Living Library Template

Config-driven conversational AI interface. One repo, swap `client.ts` per client.

## Architecture

- **Astro** — static HTML for SEO, React islands for interactivity
- **React** — chat interface hydrates client-side
- **Supabase** — backend (RAG pipeline, edge functions, pgvector)
- **Vercel** — hosting (swap to Coolify + Hetzner when scaling past 3-4 clients)

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd living-library
npm install

# 2. Set environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run locally
npm run dev
```

## Deploy to Vercel

```bash
# Via CLI
npx vercel

# Or connect the GitHub repo to Vercel dashboard
# Framework: Astro (auto-detected)
# Environment variables: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY
```

## New Client Checklist

1. Edit `src/config/client.ts` — name, slug, tagline, bio, topics, links, content items
2. Set Supabase env vars for their project
3. Deploy
4. (Future) Swap theme colors for client branding

## File Structure

```
src/
├── config/
│   └── client.ts          # ← THE ONLY FILE YOU CHANGE PER CLIENT
├── components/
│   ├── LivingLibrary.tsx   # Main orchestrator
│   ├── HudRings.tsx        # SVG animation
│   ├── ChatMessage.tsx     # Message bubbles + source citations
│   ├── ThinkingDots.tsx    # Loading indicator
│   └── SidePanel.tsx       # Content library + about panel
├── hooks/
│   └── useChat.ts          # API hook → Supabase edge function
├── layouts/
│   └── Base.astro          # HTML shell with SEO meta
├── pages/
│   └── index.astro         # Entry point
└── styles/
    └── global.css          # Animations + resets
```

## API Contract

The chat component calls your Supabase edge function:

```
POST ${SUPABASE_URL}/functions/v1/chat
Body: { message, client_slug, conversation_id }
Response: { message, conversation_id, sources[] }
```

## Migration to Coolify

When ready (3-4+ clients):

1. Change `astro.config.mjs`: remove `@astrojs/vercel` adapter, use `@astrojs/node` or pure static
2. Add `Dockerfile` (Coolify auto-detects Astro)
3. Point Coolify at the GitHub repo
4. Set env vars in Coolify dashboard
5. Done — same code, different host
