import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTimeline($id: UUID!) {
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
        createdDts
        modifiedDts
        status
      }
    }
  }
`);
