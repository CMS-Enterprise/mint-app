import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMedicaidPaymentWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          suggestedWaivers {
            id
            commonWaiverID
            commonWaiver {
              id
              name
              waiverType
            }
          }
          # Page 5 - Medicaid payment waivers
          impactsMedicaidOnlyBeneficiaries
          impactsMedicaidOnlyBeneficiariesExample
          impactsMedicaidOnlyBeneficiariesWhyNot

          impactsHomeCommunityBasedServicePayments
          impactsHomeCommunityBasedServicePaymentsExample
          impactsHomeCommunityBasedServicePaymentsWhyNot

          impactsManagedCareWaivers
          impactsManagedCareWaiversExample
          impactsManagedCareWaiversWhyNot

          additionalMedicaidSpecificWaivers
        }
      }
    }
  }
`);
