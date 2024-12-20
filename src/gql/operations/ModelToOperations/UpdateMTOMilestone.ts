import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOMilestone($id: UUID!, $changes: MTOMilestoneChanges!) {
    updateMTOMilestone(id: $id, changes: $changes) {
      id
    }
  }
`);
