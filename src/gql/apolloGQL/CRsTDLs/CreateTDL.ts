import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateTDL($input: PlanTDLCreateInput!) {
    createPlanTDL(input: $input) {
      id
      modelPlanID
      idNumber
      dateInitiated
      title
      note
    }
  }
`);
