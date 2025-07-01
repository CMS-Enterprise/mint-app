import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createMTOCommonSolutionUserContact(
    $key: MTOCommonSolutionKey!
    $userName: String!
    $role: String!
    $isPrimary: Boolean!
    $receiveEmails: Boolean!
  ) {
    createMTOCommonSolutionUserContact(
      key: $key
      userName: $userName
      isTeam: false
      role: $role
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
