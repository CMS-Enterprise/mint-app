import { graphql } from 'gql/gen/gql';

graphql(/* GraphQL */ `
  fragment BasicsMilestonesFields on PlanBasics {
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
      id
      commonName
    }
    readyForReviewDts
    status
  }
`);

export default graphql(/* GraphQL */ `
  query GetMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
        ...BasicsMilestonesFields
      }
    }
  }
`);
