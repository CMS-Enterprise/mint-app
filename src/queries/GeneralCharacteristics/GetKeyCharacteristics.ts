import { gql } from '@apollo/client';

export default gql`
  query GetKeyCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        id
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
      operationalNeeds {
        modifiedDts
      }
    }
  }
`;
