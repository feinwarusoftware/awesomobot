import fetch from "isomorphic-unfetch";
import Head from "next/head";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";

let globalApolloClient = null;

function createApolloClient(initialState = {}) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "http://localhost/api/v3/gql",
      credentials: "same-origin",
      fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  });
}

function initApolloClient(initalState = {}) {
  // new client for every server-side req - no dada sharing between reqs
  if (typeof window === "undefined") {
    return createApolloClient(initalState);
  }

  // reuse client on client-side
  if (globalApolloClient == null) {
    globalApolloClient = createApolloClient(initalState);
  }

  return globalApolloClient;
}

export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient ?? initApolloClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  if (process.env.NODE_ENV !== "production") {
    const displayName = PageComponent.displayName || PageComponent.name || "Component";

    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.");
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps != null) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx;

      const apolloClient = (ctx.apolloClient = initApolloClient());

      let pageProps = {};
      if (PageComponent.getInitialProps != null) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      if (typeof window === "undefined") {
        if (ctx.res != null && ctx.res.finished) {
          return pageProps;
        }

        if (ssr) {
          try {
            const { getDataFromTree } = await import("@apollo/react-ssr");

            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch(error) {
            console.error('Error while running `getDataFromTree`', error);
          }

          Head.rewind();
        }
      }

      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    }
  }

  return WithApollo;
}
