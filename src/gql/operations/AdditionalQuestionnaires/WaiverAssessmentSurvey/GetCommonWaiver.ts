import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCommonWaiver($id: UUID!) {
    commonWaiver(id: $id) {
      id
      name
      description
      participationAgreementLanguageLink
      cmmiWaiverPointOfContact
      waiverType
      waiverFocus
      whatIsWaived
      hasStandardizationEffort
      hasClaimsDataOrRREGAnalysis
      isUsedInActiveModels
    }
  }
`);
