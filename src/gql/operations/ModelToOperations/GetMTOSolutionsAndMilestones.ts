import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionsAndMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        solutions {
          id
          key
          name
          facilitatedBy
          neededBy
          status
          riskIndicator
          milestones {
            id
            name
          }
        }
        milestonesWithNoLinkedSolutions {
          id
          name
        }
      }
    }
  }
`);
