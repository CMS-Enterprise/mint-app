import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCustomMTOSolutions($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        solutions {
          id
          name
          addedFromSolutionLibrary
        }
      }
    }
  }
`);
