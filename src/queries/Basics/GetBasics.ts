import { gql } from '@apollo/client';

export default gql`
  query GetBasics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
        id
        modelType
        problem
        goal
        testInterventions
        note
      }
    }
  }
`;
