import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetActiveModelWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id

          modifiesMedicareSavingsPrograms
          modifiesMedicareSavingsProgramsExample
          modifiesMedicareSavingsProgramsWhyNot

          bundlesPayments
          bundlesPaymentsExample
          bundlesPaymentsWhyNot

          offersRiskSharingArrangements
          offersRiskSharingArrangementsExample
          offersRiskSharingArrangementsWhyNot

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

          impactsMedicaidOnlyBeneficiaries
          impactsMedicaidOnlyBeneficiariesExample
          impactsMedicaidOnlyBeneficiariesWhyNot

          impactsHomeCommunityBasedServicePayments
          impactsHomeCommunityBasedServicePaymentsExample
          impactsHomeCommunityBasedServicePaymentsWhyNot

          impactsManagedCareWaivers
          impactsManagedCareWaiversExample
          impactsManagedCareWaiversWhyNot

          offersPatientIncentivesSafeHarborProtection
          offersPatientIncentivesSafeHarborProtectionExample
          offersPatientIncentivesSafeHarborProtectionWhyNot

          offersExpensesRemunerationSafeHarborProtection
          offersExpensesRemunerationSafeHarborProtectionExample
          offersExpensesRemunerationSafeHarborProtectionWhyNot
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
