import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanCollaborator($input: PlanCollaboratorInput!) {
    updatePlanCollaborator(input: $input) {
      fullName
      teamRole
      euaUserID
      cmsCenter
      modelPlanID
    }
  }
`;
