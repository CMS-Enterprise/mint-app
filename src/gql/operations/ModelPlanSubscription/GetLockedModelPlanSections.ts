import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetLockedModelPlanSections($modelPlanID: UUID!) {
    lockableSectionLocks(modelPlanID: $modelPlanID) {
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
