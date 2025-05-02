import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOMilestone(
    $modelPlanID: UUID!
    $commonMilestoneKey: MTOCommonMilestoneKey!
    $commonSolutions: [MTOCommonSolutionKey!]
  ) {
    createMTOMilestoneCommon(
      modelPlanID: $modelPlanID
      commonMilestoneKey: $commonMilestoneKey
      commonSolutions: $commonSolutions
    ) {
      id
      name
    }
  }
`);
