import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOMilestoneNote($input: MTOMilestoneNoteUpdateInput!) {
    updateMTOMilestoneNote(input: $input) {
      id
    }
  }
`);
