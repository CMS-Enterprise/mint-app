import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCR($id: UUID!) {
    planCR(id: $id) {
      id
      title
      idNumber
      dateInitiated
      dateImplemented
      note
    }
  }
`);
