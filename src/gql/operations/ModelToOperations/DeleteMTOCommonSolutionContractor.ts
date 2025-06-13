import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteMTOCommonSolutionContractor($id: UUID!) {
    deleteMTOCommonSolutionContractor(id: $id) {
      id
      key
      contractorTitle
      contractorName
    }
  }
`);
