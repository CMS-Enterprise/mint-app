import { gql } from '@apollo/client';

export default gql`
  query GetModelSummary($id: UUID!) {
    modelPlan(id: $id) {
      modelName
      basics {
        goal
      }
      generalCharacteristics {
        keyCharacteristics
      }
      basics {
        applicationsStart
      }
      collaborators {
        fullName
      }
    }
  }
`;
