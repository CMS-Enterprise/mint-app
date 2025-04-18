import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlanBase($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modifiedDts
      createdDts
      status
      mtoMatrix {
        status
        info {
          id
        }
      }
    }
  }
`);
