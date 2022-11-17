import { gql } from '@apollo/client';

export default gql`
  query GetOperationalSolution($id: UUID!) {
    operationalSolution(id: $id) {
      id
      key
      needed
      name
      nameOther
      pocName
      pocEmail
    }
  }
`;
