import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOCommonSolutionContact($id: UUID!) {
    deleteMTOCommonSolutionContact(id: $id) {
      id
      key
      mailboxTitle
      mailboxAddress
      isTeam
      role
      isPrimary
      receiveEmails
      createdBy
    }
  }
`);
