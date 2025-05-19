import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation RenameMTOCategory($id: UUID!, $name: String!) {
    renameMTOCategory(id: $id, name: $name) {
      id
      name
      isUncategorized
    }
  }
`);
