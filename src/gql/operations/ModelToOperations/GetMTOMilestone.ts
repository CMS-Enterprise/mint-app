import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOMilestone($id: UUID!) {
    mtoMilestone(id: $id) {
      id
      name
      description
      key
      responsibleComponent
      facilitatedBy
      facilitatedByOther
      assignedTo
      assignedToUserAccount {
        id
        commonName
        username
        email
      }
      needBy
      status
      riskIndicator
      addedFromMilestoneLibrary
      isDraft
      commonMilestone {
        key
        description
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
      notes {
        id
        content
        createdDts
        createdByUserAccount {
          id
          commonName
          username
        }
      }
    }
  }
`);
