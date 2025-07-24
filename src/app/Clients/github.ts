import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

/**
 * If a GitHub token is provided, add it to the headers
 */
const githubHeaders = GITHUB_TOKEN
  ? {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`
      }
    }
  : {};

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
