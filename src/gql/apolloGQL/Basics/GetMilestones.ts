import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  query GetMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
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
        phasedIn
        phasedInNote
        readyForReviewByUserAccount {
          ...ReadyForReviewUserFragment
        }
        readyForReviewDts
        status
      }
    }
  }
`);
