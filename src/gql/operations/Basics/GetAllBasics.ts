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
        phasedIn
        phasedInNote
        createdDts
        modifiedDts
        status
      }
    }
  }
`);
