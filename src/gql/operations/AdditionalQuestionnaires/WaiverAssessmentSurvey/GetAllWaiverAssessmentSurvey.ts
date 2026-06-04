import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllWaiverAssessmentSurvey($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
        waiverAssessmentSurvey {
          id
          status
          modifiedDts
          createdDts
          waivers {
            id
            commonWaiver {
              name
              waiverType
            }
          }

          # Page 3 - Medicare payment waivers
          modifiesMedicareSavingsPrograms
          modifiesMedicareSavingsProgramsExample
          modifiesMedicareSavingsProgramsWhyNot
          bundlesPayments
          bundlesPaymentsExample
          bundlesPaymentsWhyNot
          offersRiskSharingArrangements
          offersRiskSharingArrangementsExample
          offersRiskSharingArrangementsWhyNot

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
