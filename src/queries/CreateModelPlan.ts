import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlan($modelName: String!) {
    createModelPlan(modelName: $modelName) {
      id
      createdBy
      modelName
      modelCategory
      cmsCenters
      cmsOther
      cmmiGroups
      basics {
        id
        modelPlanID
        modelType
        problem
        goal
        testInterventions
        note
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      milestones {
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
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      collaborators {
        id
        fullName
        euaUserID
        teamRole
      }
    }
  }
`;
