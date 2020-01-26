import fetch from "isomorphic-unfetch";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";

let globalApolloClient = null;

function createApolloClient(initialState = {}) {
  return new ApolloClient({
    ssrMode: window == null,
    link: new HttpLink({
      uri: "http://localhost/api/v3/gql",
      credentials: "same-origin",
      fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  });
}

function initApolloClient(initalState) {
  // new client for every server-side req - no dada sharing between reqs
  if (window == null) {
    return createApolloClient(initalState);
  }

  // reuse client on client-side
  if (globalApolloClient == null) {
    globalApolloClient = createApolloClient(initalState);
  }

  return globalApolloClient;
}

export function withApollo(PageComponent, { ssr = true } = {}) {
  const withApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient ?? initApolloClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  if (process.env.NODE_ENV !== "production") {
    const displayName = PageComponent
  }
}
