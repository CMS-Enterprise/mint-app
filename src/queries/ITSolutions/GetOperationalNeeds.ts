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
        solutions {
          solutions {
            id
            status
            mustStartDts
            archived
            nameOther
            key
            pocEmail
            pocName
            createdBy
            createdDts
          }
          possibleSolutions {
            id
            name
            key
          }
        }
      }
    }
  }
`;
