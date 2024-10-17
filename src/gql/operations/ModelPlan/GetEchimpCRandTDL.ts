import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetEchimpCrandTDL($id: UUID!) {
    modelPlan(id: $id) {
      echimpCRsAndTDLs {
        ... on EChimpCR {
          id
          title
          emergencyCrFlag
          sensitiveFlag
          crStatus
          implementationDate
          initiator
          crSummary {
            rawContent
          }
          relatedCrTdlNumbers
        }
        ... on EChimpTDL {
          id
          title
          issuedDate
        }
      }
    }
  }
`);
