import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetProgramWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          suggestedWaivers {
            id
            commonWaiver {
              name
              waiverType
            }
          }
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
    }
  }
`);
