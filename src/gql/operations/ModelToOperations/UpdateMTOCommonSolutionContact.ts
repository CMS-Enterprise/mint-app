import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOCommonSolutionContact(
    $id: UUID!
    $input: MTOCommonSolutionContactUpdateChanges!
  ) {
    updateMTOCommonSolutionContact(id: $id, input: $input) {
      id
      key
      mailboxTitle
      mailboxAddress
      isTeam
      role
      isPrimary
      receiveEmails
    }
  }
`);
