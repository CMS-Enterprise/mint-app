import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOMilestone($id: UUID!) {
    mtoMilestone(id: $id) {
      id
      name
      key
      facilitatedBy
      needBy
      status
      riskIndicator
      addedFromMilestoneLibrary
      isDraft
      commonMilestone {
        key
        commonSolutions {
          key
        }
      }
      categories {
        category {
          id
          name
        }
        subCategory {
          id
          name
        }
      }
      solutions {
        id
        name
        key
        status
        riskIndicator
        commonSolution {
          name
          key
          isAdded
        }
      }
    }
  }
`);
