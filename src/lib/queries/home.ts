// Query + tipi per il modello "Home Page"
export type ImageAsset = {
  id?: string | null;
  url: string;
};

export type HomePage = {
  copyright?: string | null;
  x?: string ;
  threads?: string ;
  instagram?: string ;
  youtube?: string ;

  images?: ImageAsset[] | null;

  title?: string | null;
  subtitle?: string | null;

  logoDesktop?: { url?: string | null } | null;
  logoMobile?: { url?: string | null } | null;
};

export const HOME_PAGES_QUERY = /* GraphQL */ `
  query HomePages {
    homePages(first: 1, orderBy: updatedAt_DESC) {
      logoDesktop { url }
      logoMobile  { url }
      images (first:100){ id url }
      instagram
      threads
      x
      youtube
      copyright
    }
  }
`;
