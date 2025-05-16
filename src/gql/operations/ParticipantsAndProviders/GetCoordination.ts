import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCoordination($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        participantRequireFinancialGuarantee
        participantRequireFinancialGuaranteeType
        participantRequireFinancialGuaranteeOther
        participantRequireFinancialGuaranteeNote
        coordinateWork
        coordinateWorkNote
        gainsharePayments
        gainsharePaymentsEligibility
        gainsharePaymentsEligibilityOther
        gainsharePaymentsTrack
        gainsharePaymentsNote
        participantsIds
        participantsIdsOther
        participantsIDSNote
      }
    }
  }
`);
