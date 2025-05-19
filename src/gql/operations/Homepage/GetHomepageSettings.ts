import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetHomepageSettings {
    userViewCustomization {
      id
      viewCustomization
      solutions
    }
  }
`);
