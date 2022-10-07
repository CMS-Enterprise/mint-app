import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanBase($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modifiedDts
      status
    }
  }
`;
