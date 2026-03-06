import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelToOperationsMatrix($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        status
        categories {
          id
          name
          isUncategorized
          subCategories {
            id
            name
            isUncategorized
            milestones {
              id
              mtoCommonMilestoneID
              name
              facilitatedBy
              facilitatedByOther
              assignedToPlanCollaborator {
                id
                userAccount {
                  id
                  commonName
                }
              }
              needBy
              status
              riskIndicator
              addedFromMilestoneLibrary
              isDraft
              solutions {
                id
                name
                key
              }
            }
          }
        }
        milestones {
          id
          mtoCommonMilestoneID
          name
        }
        commonMilestones {
          isSuggested
          isAdded
        }
        recentEdit {
          id
          date
          actorName
        }
      }
    }
  }
`);
