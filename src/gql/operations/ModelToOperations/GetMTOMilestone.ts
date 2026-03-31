import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOMilestone($id: UUID!) {
    mtoMilestone(id: $id) {
      id
      mtoCommonMilestoneID
      name
      description
      responsibleComponent
      facilitatedBy
      facilitatedByOther
      assignedTo
      assignedToPlanCollaborator {
        id
        userAccount {
          id
          commonName
          email
        }
      }
      needBy
      status
      riskIndicator
      addedFromMilestoneLibrary
      isDraft
      commonMilestone {
        id
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
