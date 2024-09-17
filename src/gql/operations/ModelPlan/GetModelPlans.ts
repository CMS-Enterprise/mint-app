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
      basics {
        id
        demoCode
        amsModelID
        modelCategory
        clearanceStarts
        performancePeriodStarts
        additionalModelCategories
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
      crs @include(if: $isMAC) {
        idNumber
      }
      tdls @include(if: $isMAC) {
        idNumber
      }
    }
  }
`);
