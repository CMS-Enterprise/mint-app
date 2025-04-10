import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionsAndMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        status
        recentEdit {
          modifiedDts
        }
        solutions {
          id
          type
          key
          name
          facilitatedBy
          neededBy
          status
          riskIndicator
          addedFromSolutionLibrary
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
