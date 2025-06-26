import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createMTOCommonSolutionMailboxContact(
    $key: MTOCommonSolutionKey!
    $mailboxTitle: String!
    $mailboxAddress: String!
    $isPrimary: Boolean!
    $receiveEmails: Boolean!
  ) {
    createMTOCommonSolutionMailboxContact(
      key: $key
      mailboxTitle: $mailboxTitle
      mailboxAddress: $mailboxAddress
      isTeam: true
      role: null
      isPrimary: $isPrimary
      receiveEmails: $receiveEmails
    ) {
      name
      email
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
