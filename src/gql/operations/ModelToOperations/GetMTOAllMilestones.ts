import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        commonMilestones {
          key
          name
          commonSolutions {
            key
          }
        }
        milestones {
          id
          key
          name
          solutions {
            key
          }
        }
      }
    }
  }
`);
