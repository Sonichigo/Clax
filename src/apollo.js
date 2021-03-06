import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";

const headers = {'content-type': 'application/json','x-hasura-admin-secret': '2f42e1411a67b39e1282d8bc9516a893'};
const getHeaders = () => {
  return headers;
};

const cache = new InMemoryCache();

const wsLink = new WebSocketLink({
  uri: "ws://lahdrhtfgvlbsymursey.nhost.run/v1/graphql",
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      return { headers: getHeaders() };
    },
  },
});

const httpLink = new HttpLink({
  uri: "https://lahdrhtfgvlbsymursey.nhost.run/v1/graphql",
  headers: getHeaders()
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link,
  cache
});

