import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlanCollaborator($input: PlanCollaboratorCreateInput!) {
    createPlanCollaborator(input: $input) {
      teamRoles
      userAccount {
        id
        commonName
        email
      }
      userID
      modelPlanID
    }
  }
`;
