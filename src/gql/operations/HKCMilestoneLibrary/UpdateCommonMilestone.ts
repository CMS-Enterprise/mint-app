import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation updateMTOCommonMilestone(
    $id: UUID!
    $changes: MTOCommonMilestoneChanges!
    $commonSolutions: [MTOCommonSolutionKey!]
  ) {
    updateMTOCommonMilestone(
      id: $id
      changes: $changes
      commonSolutions: $commonSolutions
    ) {
      id
      name
    }
  }
`);
