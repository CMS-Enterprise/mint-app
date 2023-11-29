import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllBasics($id: UUID!) {
    modelPlan(id: $id) {
      id
      nameHistory(sort: DESC)
      basics {
        id
        demoCode
        amsModelID
        modelCategory
        additionalModelCategories
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
`);
