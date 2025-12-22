import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createKeyContactCategory($name: String!) {
    createKeyContactCategory(name: $name) {
      id
      name
    }
  }
`);
