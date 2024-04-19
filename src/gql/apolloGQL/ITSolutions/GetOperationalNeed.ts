import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetOperationalNeed($id: UUID!, $includeNotNeeded: Boolean = true) {
    operationalNeed(id: $id) {
      id
      modelPlanID
      name
      key
      nameOther
      needed
      solutions(includeNotNeeded: $includeNotNeeded) {
        id
        name
        key
        pocName
        pocEmail
        needed
        nameOther
        isOther
        isCommonSolution
        otherHeader
        mustStartDts
        mustFinishDts
        status
      }
    }
  }
`);
