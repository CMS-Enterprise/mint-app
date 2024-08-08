import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetFunding($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        fundingSource
        fundingSourcePatientProtectionInfo
        fundingSourceMedicareAInfo
        fundingSourceMedicareBInfo
        fundingSourceOther
        fundingSourceNote
        fundingSourceR
        fundingSourceRPatientProtectionInfo
        fundingSourceRMedicareAInfo
        fundingSourceRMedicareBInfo
        fundingSourceROther
        fundingSourceRNote
        payRecipients
        payRecipientsOtherSpecification
        payRecipientsNote
        payType
        payTypeNote
        payClaims
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`);
