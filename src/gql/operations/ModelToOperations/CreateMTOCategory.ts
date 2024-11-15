import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOCategory($id: UUID!, $name: String!) {
    createMTOCategory(modelPlanID: $id, name: $name) {
      id
      name
      isUncategorized
    }
  }
`);
