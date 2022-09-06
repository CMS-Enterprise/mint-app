import { gql } from '@apollo/client';

export default gql`
  query GetAllModelPlans {
    modelPlanCollection {
      id
      modelName
      archived
      createdBy
      createdDts
      modifiedBy
      modifiedDts
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
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        readyForReviewBy
        readyForReviewDts
        status
      }
      status
    }
  }
`;
