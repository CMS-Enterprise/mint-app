import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMedicaidPaymentWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
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
      waiverInfo {
        suggestedCommonWaivers {
          ...CommonWaiver
        }
      }
    }
  }
`);
