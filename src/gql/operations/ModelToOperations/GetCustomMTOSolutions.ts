import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCustomMTOSolutions($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        solutions {
          id
          name
          addedFromSolutionLibrary
        }
      }
    }
  }
`);
