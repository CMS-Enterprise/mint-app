import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOCommonSolutionSystemOwner($id: UUID!) {
    deleteMTOCommonSolutionSystemOwner(id: $id) {
      id
      key
      ownerType
      cmsComponent
    }
  }
`);
