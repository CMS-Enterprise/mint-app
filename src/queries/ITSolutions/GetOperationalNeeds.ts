import { gql } from '@apollo/client';

export default gql`
  query GetOperationalNeeds($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      isCollaborator
      operationalNeeds {
        id
        modelPlanID
        name
        key
        nameOther
        needed
        modifiedDts
        solutions {
          id
          status
          name
          mustStartDts
          mustFinishDts
          needed
          nameOther
          key
          pocEmail
          pocName
          createdBy
          createdDts
        }
      }
    }
  }
`;
