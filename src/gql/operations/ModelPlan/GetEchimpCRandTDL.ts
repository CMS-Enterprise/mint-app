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
