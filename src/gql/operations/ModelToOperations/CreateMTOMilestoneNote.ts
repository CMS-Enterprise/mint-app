import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOMilestoneNote($input: MTOMilestoneNoteCreateInput!) {
    createMTOMilestoneNote(input: $input) {
      id
      content
      createdBy
      createdByUserAccount {
        id
        commonName
      }
      createdDts
    }
  }
`);
