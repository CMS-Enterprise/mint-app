import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateModelPlan($modelName: String!) {
    createModelPlan(modelName: $modelName) {
      id
      createdBy
      modelName
      basics {
        id
        modelPlanID
        modelCategory
        cmsCenters
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
        status
      }
      collaborators {
        id
        userAccount {
          id
          commonName
          email
          username
        }
        userID
        teamRoles
      }
    }
  }
`);
