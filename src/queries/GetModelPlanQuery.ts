import { gql } from '@apollo/client';

export default gql`
  query GetModelPlan($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modifiedDts
      basics {
        id
      }
      milestones {
        id
      }
    }
  }
`;
