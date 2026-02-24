import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOMilestone(
    $modelPlanID: UUID!
    $commonMilestoneID: UUID!
    $commonSolutions: [MTOCommonSolutionKey!]
  ) {
    createMTOMilestoneCommon(
      modelPlanID: $modelPlanID
      commonMilestoneID: $commonMilestoneID
      commonSolutions: $commonSolutions
    ) {
      id
      name
    }
  }
`);
