import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createKeyContactMailbox(
    $mailboxTitle: String!
    $mailboxAddress: String!
    $subjectArea: String!
    $subjectCategoryID: UUID!
  ) {
    createKeyContactMailbox(
      mailboxTitle: $mailboxTitle
      mailboxAddress: $mailboxAddress
      subjectArea: $subjectArea
      subjectCategoryID: $subjectCategoryID
    ) {
      id
      name
      email
      subjectArea
      subjectCategoryID
    }
  }
`);
