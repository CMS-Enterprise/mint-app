import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createKeyContactUser(
    $userName: String!
    $subjectArea: String!
    $subjectCategoryID: UUID!
  ) {
    createKeyContactUser(
      userName: $userName
      subjectArea: $subjectArea
      subjectCategoryID: $subjectCategoryID
    ) {
      id
      name
      email
      subjectArea
      subjectCategoryID
      userAccount {
        id
        commonName
        email
        username
      }
    }
  }
`);
