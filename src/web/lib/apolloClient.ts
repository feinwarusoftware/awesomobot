import ApolloClient from "apollo-boost";
import fetch from "isomorphic-unfetch";


const client = new ApolloClient({
  uri: "http://localhost/api/v3/graphql",
  fetch
});

export default client;
