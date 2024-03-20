import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteModelPlanDocument($id: UUID!) {
    deletePlanDocument(id: $id)
  }
`);
