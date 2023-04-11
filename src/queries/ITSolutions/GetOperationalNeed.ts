import { gql } from '@apollo/client';

export default gql`
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
        isOther
        name
        key
        pocName
        pocEmail
        needed
        nameOther
        mustStartDts
        mustFinishDts
        status
      }
    }
  }
`;
