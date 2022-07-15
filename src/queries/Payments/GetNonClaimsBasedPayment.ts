import { gql } from '@apollo/client';

export default gql`
  query GetNonClaimsBasedPayment($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        nonClaimsPayments
        nonClaimsPaymentOther
        paymentCalculationOwner
        numberPaymentsPerPayCycle
        numberPaymentsPerPayCycleNote
        sharedSystemsInvolvedAdditionalClaimPayment
        sharedSystemsInvolvedAdditionalClaimPaymentNote
        planningToUseInnovationPaymentContractor
        planningToUseInnovationPaymentContractorNote
        fundingStructure
      }
    }
  }
`;
