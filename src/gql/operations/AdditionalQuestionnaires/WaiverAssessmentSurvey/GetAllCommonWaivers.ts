import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllCommonWaivers {
    commonWaivers {
      id
      name
      waiverType
    }
  }
`);
