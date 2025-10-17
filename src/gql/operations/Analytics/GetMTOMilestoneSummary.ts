import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOMilestoneSummary {
    modelPlanCollection(filter: INCLUDE_ALL) {
      id
      modelName
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        milestones {
          id
          key
          name
          description
          status
          riskIndicator
          needBy
          responsibleComponent
          facilitatedBy
          facilitatedByOther
          assignedToPlanCollaborator {
            id
            userAccount {
              id
              commonName
              email
            }
          }
          notes {
            id
            content
            createdDts
          }
        }
      }
    }
  }
`);
