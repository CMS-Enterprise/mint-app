import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const githubApolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.github.com/graphql',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  }),
  cache: new InMemoryCache()
});

export default githubApolloClient;
