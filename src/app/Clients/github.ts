import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

/**
 * If a GitHub token is provided, add it to the headers
 */
const githubHeaders = {};

const githubLink = new HttpLink({
  uri: 'https://api.github.com/graphql',
  ...githubHeaders
});

const githubApolloClient = new ApolloClient({
  link: githubLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

export default githubApolloClient;
