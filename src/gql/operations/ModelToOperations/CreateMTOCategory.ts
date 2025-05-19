import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOCategory($id: UUID!, $name: String!, $parentID: UUID) {
    createMTOCategory(modelPlanID: $id, name: $name, parentID: $parentID) {
      id
      name
      isUncategorized
    }
  }
`);
