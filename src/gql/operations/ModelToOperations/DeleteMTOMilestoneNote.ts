import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOMilestoneNote($input: MTOMilestoneNoteDeleteInput!) {
    deleteMTOMilestoneNote(input: $input) {
      id
    }
  }
`);
