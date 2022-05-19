import { gql } from '@apollo/client';

export default gql`
  mutation DeleteModelPlanDocument($input: PlanDocumentInput!) {
    deletePlanDocument(input: $input)
  }
`;
