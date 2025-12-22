import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation updateKeyContactCategory($id: UUID!, $name: String!) {
    updateKeyContactCategory(id: $id, name: $name) {
      id
      name
    }
  }
`);
