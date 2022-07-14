import { gql } from '@apollo/client';

export default gql`
  query GetOpsEvalAndLearning($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
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
    }
  }
`;
