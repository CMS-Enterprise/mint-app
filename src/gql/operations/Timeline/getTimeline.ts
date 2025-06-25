import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query getTimeline($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      timeline {
        id
        completeICIP
        clearanceStarts
        clearanceEnds
        announced
        applicationsStart
        applicationsEnd
        performancePeriodStarts
        performancePeriodEnds
        highLevelNote
        wrapUpEnds
        readyForReviewByUserAccount {
          ...ReadyForReviewUserFragment
        }
        readyForReviewDts
        status
      }
    }
  }
`);
