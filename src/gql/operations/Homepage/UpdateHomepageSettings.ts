import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateHomepageSettings($changes: UserViewCustomizationChanges!) {
    updateUserViewCustomization(changes: $changes) {
      id
    }
  }
`);
