import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UnlockTaskListSection(
    $modelPlanID: UUID!
    $section: TaskListSection!
  ) {
    unlockTaskListSection(modelPlanID: $modelPlanID, section: $section)
  }
`);
