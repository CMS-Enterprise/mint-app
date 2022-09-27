import { gql } from '@apollo/client';

export default gql`
  mutation DeleteCRTDL($id: UUID!) {
    deletePlanCrTdl(id: $id) {
      idNumber
    }
  }
`;
