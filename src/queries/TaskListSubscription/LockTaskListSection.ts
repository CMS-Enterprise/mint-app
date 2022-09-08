import { gql } from '@apollo/client';

export default gql`
  mutation LockTaskListSection(
    $modelPlanID: UUID!
    $section: TaskListSection!
  ) {
    lockTaskListSection(modelPlanID: $modelPlanID, section: $section)
  }
`;
