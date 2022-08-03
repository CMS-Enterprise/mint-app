import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageNine($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        nonClaimsPayments
        willRecoverPayments
      }
      itTools {
        id
        pNonClaimsBasedPayments
        pNonClaimsBasedPaymentsOther
        pNonClaimsBasedPaymentsNote
        pSharedSavingsPlan
        pSharedSavingsPlanOther
        pSharedSavingsPlanNote
        pRecoverPayments
        pRecoverPaymentsOther
        pRecoverPaymentsNote
      }
    }
  }
`;
