import { gql } from '@apollo/client';

export default gql`
  query GetOperationalNeed($id: UUID!) {
    operationalNeed(id: $id) {
      id
      modelPlanID
      name
      key
      nameOther
      needed
      solutions(includeNotNeeded: true) {
        id
        name
        key
        pocName
        pocEmail
        needed
        nameOther
      }
    }
  }
`;
