import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOMilestoneCustom(
    $id: UUID!
    $name: String!
    $description: String
    $mtoCategoryID: UUID
  ) {
    createMTOMilestoneCustom(
      modelPlanID: $id
      name: $name
      description: $description
      mtoCategoryID: $mtoCategoryID
    ) {
      id
      name
    }
  }
`);
