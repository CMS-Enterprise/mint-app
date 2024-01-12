import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteCR($id: UUID!) {
    deletePlanCR(id: $id) {
      id
      modelPlanID
      idNumber
      dateInitiated
      title
      note
    }
  }
`);
