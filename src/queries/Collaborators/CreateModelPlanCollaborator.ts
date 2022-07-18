import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlanCollaborator($input: PlanCollaboratorCreateInput!) {
    createPlanCollaborator(input: $input) {
      fullName
      teamRole
      euaUserID
      modelPlanID
    }
  }
`;
