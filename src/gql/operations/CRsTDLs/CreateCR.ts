import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateCR($input: PlanCRCreateInput!) {
    createPlanCR(input: $input) {
      id
      modelPlanID
      idNumber
      dateInitiated
      dateImplemented
      title
      note
    }
  }
`);
