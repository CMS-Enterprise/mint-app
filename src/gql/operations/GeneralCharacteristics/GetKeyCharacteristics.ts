import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetKeyCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        id
        agencyOrStateHelp
        agencyOrStateHelpOther
        agencyOrStateHelpNote
        alternativePaymentModelTypes
        alternativePaymentModelNote
        keyCharacteristics
        keyCharacteristicsNote
        keyCharacteristicsOther
        collectPlanBids
        collectPlanBidsNote
        managePartCDEnrollment
        managePartCDEnrollmentNote
        planContractUpdated
        planContractUpdatedNote
      }
    }
  }
`);
