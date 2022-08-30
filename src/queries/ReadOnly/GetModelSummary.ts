import { gql } from '@apollo/client';

export default gql`
  query GetModelSummary($id: UUID!) {
    modelPlan(id: $id) {
      modelName
      modifiedDts
      status
      basics {
        goal
        applicationsStart
      }
      generalCharacteristics {
        keyCharacteristics
      }
      collaborators {
        fullName
      }
    }
  }
`;
