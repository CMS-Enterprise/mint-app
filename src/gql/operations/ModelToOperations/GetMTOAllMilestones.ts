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
          id
          name
          commonSolutions {
            key
          }
        }
        milestones {
          id
          mtoCommonMilestoneID
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
