// src/lib/getHomeCached.ts
import { unstable_cache } from 'next/cache';
import { hygraph } from '@/lib/hygraph';
import { HOME_PAGES_QUERY, type HomePage } from '@/lib/queries/home';

export const getHomeCached = unstable_cache(
  async () => {
    const { homePages } = await hygraph.request<{ homePages: HomePage[] }>(HOME_PAGES_QUERY);
    return homePages?.[0] ?? null;
  },
  ['home:page'],                 // chiave cache
  { revalidate: 300 }            // 5 minuti; cambia a tuo gusto
);
