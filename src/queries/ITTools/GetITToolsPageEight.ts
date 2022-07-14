import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageEight($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        modelLearningSystems
      }
      payments {
        id
        payType
        shouldAnyProvidersExcludedFFSSystems
      }
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
