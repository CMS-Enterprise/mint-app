import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetLastCommit($owner: String!, $repo: String!, $path: String!) {
    repository(owner: $owner, name: $repo) {
      object(expression: "main") {
        ... on Commit {
          history(first: 1, path: $path) {
            edges {
              node {
                committedDate
                oid
              }
            }
          }
        }
      }
    }
  }
`);
