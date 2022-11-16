import { gql } from '@apollo/client';

export default gql`
  query GetOperationalSolution($id: UUID!) {
    operationalSolution(id: $id) {
      id
      key
      nameOther
      pocName
      pocEmail
    }
  }
`;
