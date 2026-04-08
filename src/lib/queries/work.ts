export type Work = {
  id: string;
  project: string;
  year: string;
  info: {
    html: string;
  };
  links: LinkUnion[];
};

export type LinkUnion = Link; // estendibile se aggiungi altri componenti

export type Link = {
  __typename: "Link";
  title: string;
  url: string;
  notes?: {
    html: string;
  } | null;
};

export const WORK_PAGE_QUERY = /* GraphQL */ `
query Works {
  works (first: 200, orderBy: year_DESC) {
    id
    project
    year
    info { html }
    links {
      ... on Link {
        title
        url
        notes{html}
      }
    }
  }
}
`;
