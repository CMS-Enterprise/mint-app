import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlanCollaborator($input: PlanCollaboratorCreateInput!) {
    createPlanCollaborator(input: $input) {
      teamRole
      userAccount {
        commonName
        email
      }
      userID
      modelPlanID
    }
  }
`;
