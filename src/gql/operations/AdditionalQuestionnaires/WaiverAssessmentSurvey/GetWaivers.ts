import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          suggestedWaivers {
            id
            commonWaiver {
              name
            }
          }
          # Page 6 - Waiver selections for this model plan
          waivers {
            id
            commonWaiver {
              name
            }
          }
        }
      }
    }
  }
`);
