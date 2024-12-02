import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOSolutionCustom(
    $modelPlanID: UUID!
    $solutionType: MTOSolutionType!
    $name: String!
    $pocName: String!
    $pocEmail: String!
  ) {
    createMTOSolutionCustom(
      modelPlanID: $modelPlanID
      solutionType: $solutionType
      name: $name
      pocName: $pocName
      pocEmail: $pocEmail
    ) {
      id
      name
      status
      pocName
      pocEmail
    }
  }
`);
