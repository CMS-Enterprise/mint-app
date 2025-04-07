import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOMilestoneCustom(
    $id: UUID!
    $name: String!
    $mtoCategoryID: UUID
  ) {
    createMTOMilestoneCustom(
      modelPlanID: $id
      name: $name
      mtoCategoryID: $mtoCategoryID
    ) {
      id
      name
    }
  }
`);
