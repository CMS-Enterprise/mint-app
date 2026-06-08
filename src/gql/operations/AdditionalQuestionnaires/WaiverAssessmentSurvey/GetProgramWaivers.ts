import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetProgramWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          # Page 4 - Program waivers (Medicare Benefit Enhancements)
          impactsSiteOfCarePayments
          impactsSiteOfCarePaymentsExample
          impactsSiteOfCarePaymentsWhyNot

          modifiesCareTeamScopeOfPractice
          modifiesCareTeamScopeOfPracticeExample
          modifiesCareTeamScopeOfPracticeWhyNot

          modifiesCareDeliveryWithClaimsBasedPayments
          modifiesCareDeliveryWithClaimsBasedPaymentsExample
          modifiesCareDeliveryWithClaimsBasedPaymentsWhyNot

          modifiesQualityMeasurementsOrPaymentsViaWaivers
          modifiesQualityMeasurementsOrPaymentsViaWaiversExample
          modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot
        }
      }
      waiverInfo {
        suggestedCommonWaivers {
          ...SuggestedCommonWaiverFragment
        }
      }
    }
  }
`);
