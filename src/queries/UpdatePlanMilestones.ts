import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanMilestones($id: UUID!, $changes: PlanMilestoneChanges!) {
    updatePlanMilestones(id: $id, changes: $changes) {
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
