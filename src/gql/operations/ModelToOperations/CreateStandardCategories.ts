import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateStandardCategories($modelPlanID: UUID!) {
    createStandardCategories(modelPlanID: $modelPlanID)
  }
`);
