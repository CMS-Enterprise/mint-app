import { gql } from '@apollo/client';

export default gql`
  mutation DeleteModelPlanDocument($id: UUID!) {
    deletePlanDocument(id: $id)
  }
`;
