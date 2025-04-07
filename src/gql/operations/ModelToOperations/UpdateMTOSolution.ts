import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOSolution(
    $id: UUID!
    $changes: MTOSolutionChanges!
    $milestoneLinks: MTOMilestoneLinks
  ) {
    updateMTOSolution(
      id: $id
      changes: $changes
      milestoneLinks: $milestoneLinks
    ) {
      id
    }
  }
`);
