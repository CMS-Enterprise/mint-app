import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanBasics($input: PlanBasicsInput!) {
    updatePlanBasics(input: $input) {
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
