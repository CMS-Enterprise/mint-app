import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOMilestone($id: UUID!) {
    deleteMTOMilestone(id: $id)
  }
`);
