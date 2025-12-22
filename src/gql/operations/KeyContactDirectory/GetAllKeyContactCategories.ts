import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllKeyContactCategories {
    keyContactCategory {
      id
      name
    }
  }
`);
