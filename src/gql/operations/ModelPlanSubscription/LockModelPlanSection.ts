import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation LockModelPlanSection(
    $modelPlanID: UUID!
    $section: LockableSection!
  ) {
    lockLockableSection(modelPlanID: $modelPlanID, section: $section)
  }
`);
