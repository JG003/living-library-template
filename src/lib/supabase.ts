/**
 * Living Library — Supabase Data Layer
 *
 * Fetches content items for the side panel.
 * Runs client-side (the chat component is a React island).
 */
import { client } from '@/config/client';

export interface ContentItem {
  title: string;
  type: string;
  url: string | null;
  date: string;
}

/**
 * Fetch content library items for the current client.
 * Uses the anon key — RLS ensures only this client's data is returned
 * when filtered by client_id.
 */
export async function fetchContentItems(): Promise<ContentItem[]> {
  const { supabaseUrl, supabaseAnonKey, slug } = client;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing — using empty content list');
    return [];
  }

  try {
    // Step 1: Get client_id from slug
    const clientRes = await fetch(
      `${supabaseUrl}/rest/v1/clients?slug=eq.${slug}&select=id`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );
    if (!clientRes.ok) throw new Error(`clients lookup failed: ${clientRes.status}`);
    const clients = await clientRes.json();
    if (!clients.length) {
      console.warn(`No client found for slug "${slug}"`);
      return [];
    }
    const clientId = clients[0].id;

    // Step 2: Fetch content items for this client
    const contentRes = await fetch(
      `${supabaseUrl}/rest/v1/content_items?client_id=eq.${clientId}&select=title,content_type,url,published_at&order=published_at.desc&limit=50`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    );
    if (!contentRes.ok) throw new Error(`content_items fetch failed: ${contentRes.status}`);
    const items = await contentRes.json();

    // Deduplicate by title (chunks create multiple rows per article)
    const seen = new Set<string>();
    const unique: ContentItem[] = [];
    for (const item of items) {
      if (seen.has(item.title)) continue;
      seen.add(item.title);
      unique.push({
        title: item.title,
        type: (item.content_type || 'ARTICLE').toUpperCase(),
        url: item.url,
        date: item.published_at
          ? new Date(item.published_at).toISOString().split('T')[0]
          : '',
      });
    }

    return unique;
  } catch (err) {
    console.error('Failed to fetch content items:', err);
    return [];
  }
}
