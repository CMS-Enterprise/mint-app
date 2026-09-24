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
      status
      taskListStatus
      tasks {
        id
        key
        state
        status
        completedDts
        documents {
          id
          fileName
          fileType
          documentType
          planTaskID
        }
      }
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
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
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
      questionnaires {
        dataExchangeApproach {
          id
          status
          modifiedDts
          modifiedByUserAccount {
            id
            commonName
          }
        }
        iddocQuestionnaire {
          id
          taskListStatus
          needed
          modifiedDts
          modifiedByUserAccount {
            id
            commonName
          }
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
        topic
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
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
      }
      participantsAndProviders {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
      }
      beneficiaries {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
      }
      opsEvalAndLearning {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
      }
      payments {
        id
        modifiedDts
        modifiedByUserAccount {
          commonName
        }
        status
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
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
        readyForClearanceDts
        readyForClearanceByUserAccount {
          commonName
        }
      }
    }
  }
`);
