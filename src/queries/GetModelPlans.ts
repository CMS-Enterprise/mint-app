import { gql } from '@apollo/client';

export default gql`
  query GetModelPlans($filter: ModelPlanFilter!, $isMAC: Boolean!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
      status
      nameHistory(sort: DESC)
      createdBy
      createdDts
      modifiedDts
      basics {
        id
        clearanceStarts
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
        userAccount {
          id
          commonName
        }
        teamRole
      }
      discussions {
        id
        status
        replies {
          id
          resolution
        }
      }
      crTdls @include(if: $isMAC) {
        idNumber
      }
    }
  }
`;
