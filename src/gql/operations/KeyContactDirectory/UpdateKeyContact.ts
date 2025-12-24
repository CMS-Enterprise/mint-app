import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation updateKeyContact($id: UUID!, $changes: KeyContactUpdateChanges!) {
    updateKeyContact(id: $id, changes: $changes) {
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
