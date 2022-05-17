import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      id
      modelPlanID
      modelType
      problem
      goal
      testInventions
      note
    }
  }
`;
