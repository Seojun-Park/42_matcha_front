import {
  ApolloClient,
  ApolloLink,
  concat,
  gql,
  HttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const isLoggedInVar = makeVar(!!localStorage.getItem("Bearer"));

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
      },
    },
  },
});

const authMiddle = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: localStorage.getItem("Bearer") || "",
    },
  });
  return forward(operation);
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscription`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      Bearer: localStorage.getItem("Bearer") || "",
    },
  },
});

const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`,
});

const errLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) =>
      console.log("network graphql error: ", message)
    );
  }
});

const linkCombine = split(
  ({ query }) => {
    const { kind } = getMainDefinition(query);
    return kind === "OperationDefinition";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([errLink, concat(authMiddle, linkCombine)]),
  headers: {
    authorization: localStorage.getItem("Bearer") || "",
  },
  typeDefs,
});

export default client;
