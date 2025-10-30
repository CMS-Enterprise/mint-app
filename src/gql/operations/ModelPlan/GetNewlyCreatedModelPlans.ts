import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetNewlyCreatedModelPlans {
    modelPlanCollection(filter: NEWLY_CREATED) {
      id
      modelName
      abbreviation
      createdDts
      modifiedDts
      discussions {
        id
      }
    }
  }
`);
