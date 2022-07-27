import { gql } from '@apollo/client';

export default gql`
  query GetModelPlans {
    modelPlanCollection {
      id
      modelName
      # modelCategory # TODO: GARY
      # cmsCenters # TODO: GARY
      # NO CMS OTHER???? TODO
      # cmmiGroups # TODO: GARY
      status
      createdBy
      createdDts
      modifiedDts
      collaborators {
        id
        fullName
        teamRole
      }
      discussions {
        status
        replies {
          resolution
        }
      }
    }
  }
`;
