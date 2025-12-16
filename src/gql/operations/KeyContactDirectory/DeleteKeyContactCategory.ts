import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation deleteKeyContactCategory($id: UUID!) {
    deleteKeyContactCategory(id: $id) {
      id
      category
    }
  }
`);
