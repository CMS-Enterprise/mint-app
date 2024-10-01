import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query echimpCRAndTDLS {
    echimpCRAndTDLS {
      __typename
      ... on EChimpCR {
        id
        initiator
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
        title
        issuedDate
        associatedModelUids
      }
    }
  }
`);
