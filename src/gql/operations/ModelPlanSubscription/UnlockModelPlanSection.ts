import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UnlockModelPlanSection(
    $modelPlanID: UUID!
    $section: LockableSection!
  ) {
    unlockLockableSection(modelPlanID: $modelPlanID, section: $section)
  }
`);
