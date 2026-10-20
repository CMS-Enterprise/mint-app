import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllCommonWaivers {
    commonWaivers {
      id
      name
      description
      waiverType
      waiverFocus
      hasStandardizationEffort
      hasClaimsDataOrRREGAnalysis
    }
  }
`);
