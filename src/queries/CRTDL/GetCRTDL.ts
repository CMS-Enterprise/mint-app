import { gql } from '@apollo/client';

export default gql`
  query GetCRTDL($id: UUID!) {
    crTdl(id: $id) {
      id
      modelPlanID
      title
      idNumber
      dateInitiated
      note
    }
  }
`;
