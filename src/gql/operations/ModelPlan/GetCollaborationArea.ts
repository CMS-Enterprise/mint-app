import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCollaborationArea($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      createdDts
      mostRecentEdit {
        id
        date
      }
      opSolutionLastModifiedDts
      status
      taskListStatus
      isFavorite
      suggestedPhase {
        phase
        suggestedStatuses
      }
      basics {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
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
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
      }
      participantsAndProviders {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
      }
      beneficiaries {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
      }
      opsEvalAndLearning {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
      }
      payments {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
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
      timeline {
        id
        modifiedDts
        modifiedByUserAccount {
          id
          commonName
        }
        datesAddedCount
        upcomingTimelineDate {
          date
          dateField
        }
        status
      }
    }
  }
`);
