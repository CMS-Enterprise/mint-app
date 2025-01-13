import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOMilestoneLinkedSolutions(
    $id: UUID!
    $solutionLinks: MTOSolutionLinks!
  ) {
    mtoMilestoneUpdateLinkedSolutions(id: $id, solutionLinks: $solutionLinks) {
      id
    }
  }
`);
