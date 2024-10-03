import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation LockTaskListSection(
    $modelPlanID: UUID!
    $section: LockableSection!
  ) {
    lockTaskListSection(modelPlanID: $modelPlanID, section: $section)
  }
`);
