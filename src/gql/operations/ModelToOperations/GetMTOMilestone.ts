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
      categories {
        category {
          id
        }
        subCategory {
          id
        }
      }
      # solutions {
      #   id
      #   name
      #   key
      # }
    }
  }
`);
