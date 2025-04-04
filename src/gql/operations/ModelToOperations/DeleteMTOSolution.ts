import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOSolution($id: UUID!) {
    deleteMTOSolution(id: $id)
  }
`);
