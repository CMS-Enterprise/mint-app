import { gql } from '@apollo/client';

export default gql`
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
`;
