import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCRTDLs($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      isCollaborator
      crs {
        id
        modelPlanID
        title
        idNumber
        dateInitiated
        dateImplemented
        note
      }
      tdls {
        id
        modelPlanID
        title
        idNumber
        dateInitiated
        note
      }
    }
  }
`);
