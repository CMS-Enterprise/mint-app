import { gql } from '@apollo/client';

export default gql`
  query GetAllBasics($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        modelCategory
        cmsCenters
        cmsOther
        cmmiGroups
        modelType
        problem
        goal
        testInterventions
        note
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
        status
      }
    }
  }
`;
