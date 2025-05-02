import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOCategory($id: UUID!) {
    deleteMTOCategory(id: $id)
  }
`);
