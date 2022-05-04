import { gql } from '@apollo/client';

export default gql`
  mutation CreatePlanMilestones($input: PlanMilestonesInput!) {
    createPlanMilestones(input: $input) {
      id
      modelPlanID
      completeICIP
      clearanceStarts
      clearanceEnds
      announced
      applicationsStart
      applicationsEnd
      performancePeriodStarts
      performancePeriodEnds
      wrapUpEnds
      highLevelNote
      phasedIn
      phasedInNote
    }
  }
`;
