import { gql } from '@apollo/client';

export default gql`
  query GetCRTDLs($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      isCollaborator
      crTdls {
        id
        modelPlanID
        title
        idNumber
        dateInitiated
        note
      }
    }
  }
`;
