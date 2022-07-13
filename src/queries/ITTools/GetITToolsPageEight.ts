import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageEight($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        modelLearningSystems
      }
      payment
      itTools {
        id
        oelEducateBeneficiaries
        oelEducateBeneficiariesOther
        oelEducateBeneficiariesNote
        pMakeClaimsPayments
        pMakeClaimsPaymentsOther
        pMakeClaimsPaymentsNote
        pInformFfs
        pInformFfsOther
        pInformFfsNote
      }
    }
  }
`;
