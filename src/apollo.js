import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = createHttpLink({
  uri: 'http://localhost:8081/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8081/subscriptions',
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('token'), // token will be send on connecting to WS
      refreshToken: localStorage.getItem('refreshToken'),
    },
  },
});

const authLink = setContext((_, { headers }) => {  /* eslint-disable */
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ['x-token']: token ? token : '',
      ['x-refresh-token']: refreshToken ? refreshToken : '',
    }
  }
});

const tokenAfterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const { response: { headers } } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return response;
  });
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  tokenAfterwareLink.concat(authLink.concat(httpLink)),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
