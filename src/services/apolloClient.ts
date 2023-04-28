import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://survivor-indexer.bibliothecadao.xyz:8080/goerli-graphql",
  cache: new InMemoryCache(),
});
