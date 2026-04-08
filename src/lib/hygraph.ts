// src/lib/hygraph.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.HYGRAPH_ENDPOINT;
if (!endpoint) {
  throw new Error('HYGRAPH_ENDPOINT mancante. Aggiungilo in .env.local');
}

// Hygraph client da usare SOLO lato server (non importarlo in componenti "use client")
export const hygraph = new GraphQLClient(endpoint);
