import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UnlockAllSections($modelPlanID: UUID!) {
    unlockAllLockableSections(modelPlanID: $modelPlanID) {
      modelPlanID
      section
      # lockedBy
      lockedByUserAccount {
        id
        username
        commonName
      }
      isAssessment
    }
  }
`);
