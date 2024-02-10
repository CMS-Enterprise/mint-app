import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetPeopleImpacted($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      beneficiaries {
        id
        numberPeopleImpacted
        estimateConfidence
        confidenceNote
        beneficiarySelectionNote
        beneficiarySelectionOther
        beneficiarySelectionMethod
      }
    }
  }
`);
