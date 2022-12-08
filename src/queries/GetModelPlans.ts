import { gql } from '@apollo/client';

export default gql`
  query GetModelPlans($includeAll: Boolean!, $isMAC: Boolean!) {
    modelPlanCollection(includeAll: $includeAll) {
      id
      modelName
      status
      nameHistory(sort: DESC)
      createdBy
      createdDts
      modifiedDts
      basics {
        clearanceStarts
        applicationsStart @include(if: $isMAC)
      }
      generalCharacteristics @include(if: $isMAC) {
        keyCharacteristics
      }
      payments @include(if: $isMAC) {
        paymentStartDate
      }
      collaborators {
        id
        fullName
        teamRole
      }
      discussions {
        status
        replies {
          resolution
        }
      }
      crTdls @include(if: $isMAC) {
        idNumber
      }
    }
  }
`;
