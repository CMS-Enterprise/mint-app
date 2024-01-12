import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTDL($id: UUID!) {
    planTDL(id: $id) {
      id
      modelPlanID
      title
      idNumber
      dateInitiated
      note
    }
  }
`);
