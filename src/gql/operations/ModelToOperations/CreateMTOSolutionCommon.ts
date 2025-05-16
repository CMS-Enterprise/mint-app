import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOSolutionCommon(
    $modelPlanID: UUID!
    $milestonesToLink: [UUID!]!
    $key: MTOCommonSolutionKey!
  ) {
    createMTOSolutionCommon(
      modelPlanID: $modelPlanID
      milestonesToLink: $milestonesToLink
      key: $key
    ) {
      id
    }
  }
`);
