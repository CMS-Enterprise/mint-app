import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createKeyContactCategory($category: String!) {
    createKeyContactCategory(category: $category) {
      id
      category
    }
  }
`);
