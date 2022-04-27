import { gql } from '@apollo/client';

export default gql`
  mutation CreatePlanBasics($input: PlanBasicsInput!) {
    createPlanBasics(input: $input) {
      id
    }
  }
`;
