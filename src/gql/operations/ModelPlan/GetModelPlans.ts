import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlans($filter: ModelPlanFilter!, $isMAC: Boolean!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
      status
      abbreviation
      nameHistory(sort: DESC)
      createdBy
      createdDts
      modifiedDts
      isFavorite
      isCollaborator
      mostRecentEdit {
        id
        date
      }
      basics {
        id
        demoCode
        amsModelID
        modelCategory
        additionalModelCategories
      }
      timeline {
        id
        clearanceStarts
        performancePeriodStarts
        applicationsStart @include(if: $isMAC)
      }
      generalCharacteristics @include(if: $isMAC) {
        id
        keyCharacteristics
      }
      payments @include(if: $isMAC) {
        id
        paymentStartDate
      }
      collaborators {
        id
        userID
        userAccount {
          id
          commonName
          email
          username
        }
        teamRoles
      }
      discussions {
        id
        replies {
          id
        }
      }
      echimpCRsAndTDLs {
        ... on EChimpCR {
          id
        }
        ... on EChimpTDL {
          id
        }
      }
    }
  }
`);
