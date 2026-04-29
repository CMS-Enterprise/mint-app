import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteCommonMilestone($id: UUID!) {
    archiveMTOCommonMilestone(id: $id) {
      id
    }
  }
`);
