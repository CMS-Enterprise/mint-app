import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation ReorderMTOCategory($id: UUID!, $newOrder: Int!, $parentID: UUID) {
    reorderMTOCategory(id: $id, newOrder: $newOrder, parentID: $parentID) {
      id
    }
  }
`);
