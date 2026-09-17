import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          # Page 6 - Waiver selections for this model plan
          waivers {
            id
            commonWaiverID
            willUseWaiver
            notUsingReason
            commonWaiver {
              id
              name
              waiverType
              waiverFocus
            }
          }
        }
      }
      waiverInfo {
        suggestedCommonWaivers {
          ...CommonWaiver
        }
        unusedCommonWaivers {
          ...CommonWaiver
        }
      }
    }
  }
`);
