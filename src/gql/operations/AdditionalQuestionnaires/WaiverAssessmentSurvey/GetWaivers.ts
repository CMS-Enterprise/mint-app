import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          isEmptyWaiversConfirmed
        }
      }
      waiverInfo {
        commonWaivers {
          id
          waiverType
          name
          isSuggested
          isAnswered
          willUseWaiver
          notUsingReason
          usingReason
        }
      }
    }
  }
`);
