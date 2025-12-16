import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation updateKeyContactCategory(
    $id: UUID!
    $changes: KeyContactCategoryUpdateChanges!
  ) {
    updateKeyContactCategory(id: $id, changes: $changes) {
      id
      category
    }
  }
`);
