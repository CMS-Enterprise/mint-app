import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllBasics($id: UUID!) {
    modelPlan(id: $id) {
      id
      nameHistory(sort: DESC)
      isCollaborator
      basics {
        id
        demoCode
        amsModelID
        modelCategory
        additionalModelCategories
        cmsCenters
        cmmiGroups
        modelType
        modelTypeOther
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
`);
