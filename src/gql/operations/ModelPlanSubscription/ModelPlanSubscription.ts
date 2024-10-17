import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  subscription ModelPlanSubscription($modelPlanID: UUID!) {
    onLockLockableSectionContext(modelPlanID: $modelPlanID) {
      changeType
      lockStatus {
        modelPlanID
        section
        lockedByUserAccount {
          id
          username
          commonName
        }
        isAssessment
      }
      actionType
    }
  }
`);
