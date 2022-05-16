import { gql } from '@apollo/client';

export default gql`
  mutation DeleteModelPlanCollaborator($id: UUID!) {
    deletePlanCollaborator(id: $id) {
      id
      fullName
      teamRole
      euaUserID
      modelPlanID
    }
  }
`;
