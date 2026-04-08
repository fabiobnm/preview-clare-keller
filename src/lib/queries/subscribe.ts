// Query + tipi per il modello "SUBSCRIBE"
export type Subscribe = {
  text?: { markdown: string | null } | null;
};

export const SUBSCRIBE_PAGE_QUERY = /* GraphQL */ `
query Subscribes {
    subscribes(first: 1, orderBy: updatedAt_DESC) {
    text{markdown}
    }
  }
`;
