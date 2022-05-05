import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlanCollaborator($input: PlanCollaboratorInput!) {
    createPlanCollaborator(input: $input) {
      fullName
      teamRole
      euaUserID
      modelPlanID
    }
  }
`;
