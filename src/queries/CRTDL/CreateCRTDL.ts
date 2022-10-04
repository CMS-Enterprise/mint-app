import { gql } from '@apollo/client';

export default gql`
  mutation CreateCRTDL($input: PlanCrTdlCreateInput!) {
    createPlanCrTdl(input: $input) {
      modelPlanID
      title
      idNumber
      dateInitiated
      note
    }
  }
`;
