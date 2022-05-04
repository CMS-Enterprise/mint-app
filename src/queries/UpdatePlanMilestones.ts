import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanMilestones($input: PlanMilestonesInput!) {
    updatePlanMilestones(input: $input) {
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
