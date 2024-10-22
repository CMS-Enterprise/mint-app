import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetNewMethodologiesAndConsiderations($id: UUID!) {
    modelPlan(id: $id) {
      id
      dataExchangeApproach {
        id
        willImplementNewDataExchangeMethods
        newDataExchangeMethodsDescription
        newDataExchangeMethodsNote
        additionalDataExchangeConsiderationsDescription
        isDataExchangeApproachComplete
        markedCompleteByUserAccount {
          id
          commonName
        }
        markedCompleteDts
      }
    }
  }
`);
