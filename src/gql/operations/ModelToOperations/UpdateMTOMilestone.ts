import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOMilestone(
    $id: UUID!
    $changes: MTOMilestoneChanges!
    $solutionLinks: MTOSolutionLinks
  ) {
    updateMTOMilestone(
      id: $id
      changes: $changes
      solutionLinks: $solutionLinks
    ) {
      id
    }
  }
`);
