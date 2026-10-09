import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateWaiverAssessmentSurvey(
    $id: UUID!
    $changes: WaiverAssessmentSurveyChanges!
  ) {
    updateWaiverAssessmentSurvey(id: $id, changes: $changes) {
      id
    }
  }
`);
