import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query echimpCRAndTDLS {
    echimpCRAndTDLS {
      __typename
      ... on EChimpCR {
        id
        versionNum
        initiator
        firstName
        lastName
        title
        sensitiveFlag
        implementationDate
        crSummary {
          rawContent
        }
        crStatus
        emergencyCrFlag
        relatedCrNumbers
        relatedCrTdlNumbers
        associatedModelUids
      }
      ... on EChimpTDL {
        id
        versionNum
        initiator
        firstName
        lastName
        title
        issuedDate
        status
        associatedModelUids
      }
    }
  }
`);
