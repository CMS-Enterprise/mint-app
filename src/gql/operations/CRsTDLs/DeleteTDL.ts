import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteTDL($id: UUID!) {
    deletePlanTDL(id: $id) {
      id
      modelPlanID
      idNumber
      dateInitiated
      title
      note
    }
  }
`);
