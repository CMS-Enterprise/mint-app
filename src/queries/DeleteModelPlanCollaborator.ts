import { gql } from '@apollo/client';

export default gql`
  mutation DeleteModelPlanCollaborator($id: UUID!) {
    deletePlanCollaborator(id: $id) {
      fullName
      teamRole
      euaUserID
      modelPlanID
    }
  }
`;
