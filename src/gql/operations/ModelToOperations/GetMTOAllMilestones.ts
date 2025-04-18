import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
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
          status
          riskIndicator
          solutions {
            key
          }
        }
      }
    }
  }
`);
