import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        commonMilestones {
          name
          key
        }
        milestones {
          id
          key
          name
        }
      }
    }
  }
`);
