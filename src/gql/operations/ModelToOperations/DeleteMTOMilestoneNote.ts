import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOMilestoneNote($id: UUID!) {
    deleteMTOMilestoneNote(id: $id) {
      id
    }
  }
`);
