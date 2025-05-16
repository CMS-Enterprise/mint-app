import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlan($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modifiedDts
      modifiedByUserAccount {
        commonName
      }
      opSolutionLastModifiedDts
      archived
      status
      taskListStatus
      isFavorite
      suggestedPhase {
        phase
        suggestedStatuses
      }
      basics {
        id
        clearanceStarts
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      collaborators {
        id
        userAccount {
          id
          commonName
          email
          username
        }
        userID
        teamRoles
        modelPlanID
        createdDts
      }
      dataExchangeApproach {
        id
        status
        modifiedDts
        modifiedByUserAccount {
          id
          commonName
        }
      }
      documents {
        id
        fileName
        fileType
      }
      echimpCRsAndTDLs {
        ... on EChimpCR {
          id
        }
        ... on EChimpTDL {
          id
        }
      }
      discussions {
        id
        content {
          rawContent
        }
        createdBy
        createdDts
        replies {
          id
          discussionID
          content {
            rawContent
          }
          createdBy
          createdDts
        }
      }
      generalCharacteristics {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      participantsAndProviders {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      beneficiaries {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      opsEvalAndLearning {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      payments {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      prepareForClearance {
        status
        modifiedDts: latestClearanceDts
      }
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        status
        recentEdit {
          id
          date
          actorName
        }
        milestones {
          id
          name
        }
      }
    }
  }
`);
