import { gql } from '@apollo/client';

export default gql`
  mutation DeleteModelPlanCollaborator($input: PlanCollaboratorInput!) {
    deletePlanCollaborator(input: $input) {
      fullName
      teamRole
      euaUserID
      modelPlanID
    }
  }
`;
