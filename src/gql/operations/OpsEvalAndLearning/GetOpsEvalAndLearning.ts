import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetOpsEvalAndLearning($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        stakeholders
        stakeholdersOther
        stakeholdersNote
        helpdeskUse
        helpdeskUseNote
        contractorSupport
        contractorSupportOther
        contractorSupportHow
        contractorSupportNote
        iddocSupport
        iddocSupportNote
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`);
