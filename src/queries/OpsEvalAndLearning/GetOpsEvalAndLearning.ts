import { gql } from '@apollo/client';

export default gql`
  query GetOpsEvalAndLearning($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        agencyOrStateHelp
        agencyOrStateHelpOther
        agencyOrStateHelpNote
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
        modifiedDts
      }
    }
  }
`;
