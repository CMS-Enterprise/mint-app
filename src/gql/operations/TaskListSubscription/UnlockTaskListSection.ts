import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UnlockTaskListSection(
    $modelPlanID: UUID!
    $section: LockableSection!
  ) {
    unlockTaskListSection(modelPlanID: $modelPlanID, section: $section)
  }
`);
