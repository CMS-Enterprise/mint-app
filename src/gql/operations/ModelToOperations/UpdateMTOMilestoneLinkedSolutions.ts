import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation GetMTOMilestone($id: UUID!, $solutionLinks: MTOSolutionLinks!) {
    mtoMilestoneUpdateLinkedSolutions(id: $id, solutionLinks: $solutionLinks) {
      id
    }
  }
`);
