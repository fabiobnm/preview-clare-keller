// src/components/Menu/MenuServer.tsx
import { hygraph } from '@/lib/hygraph';
import { HOME_PAGES_QUERY, type HomePage } from '@/lib/queries/home';
import MenuClient from './MenuClient';

type MenuProps = {
  page?: string;
  itemBasis?: string;
  className?: string;
};

export default async function MenuServer({ page = 'default', itemBasis = '16.66%', className }: MenuProps) {
  const { homePages } = await hygraph.request<{ homePages: HomePage[] }>(HOME_PAGES_QUERY);
  const home = homePages?.[0] || null;

  return (
    <MenuClient
      page={page}
      itemBasis={itemBasis}
      className={className}
      home={home}
    />
  );
}
