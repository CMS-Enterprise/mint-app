import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllWaiverAssessmentSurvey($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        modelCategory
        additionalModelCategories
        cmsCenters
        cmmiGroups
      }
      generalCharacteristics {
        id
        isNewModel
        existingModel
        currentModelPlanID
        existingModelID
        resemblesExistingModel
        resemblesExistingModelWhyHow
        resemblesExistingModelHow
        resemblesExistingModelWhich {
          names
        }
        resemblesExistingModelOtherSpecify
        resemblesExistingModelOtherSelected
        resemblesExistingModelOtherOption
        participationInModelPrecondition
        participationInModelPreconditionWhich {
          names
        }
        participationInModelPreconditionOtherSpecify
        participationInModelPreconditionOtherSelected
        participationInModelPreconditionOtherOption
        participationInModelPreconditionWhyHow
        keyCharacteristics
        keyCharacteristicsOther
        collectPlanBids
        managePartCDEnrollment
        planContractUpdated
        geographiesTargeted
        geographiesTargetedTypes
        geographiesStatesAndTerritories
        geographiesRegionTypes
        geographiesTargetedTypesOther
        geographiesTargetedAppliedTo
        geographiesTargetedAppliedToOther
        waiversRequired
        waiversRequiredTypes
      }

      questionnaires {
        waiverAssessmentSurvey {
          id
          status
          isComplete
          completedByUserAccount {
            id
            commonName
          }
          completedDts
          modifiedDts
          createdDts
          waivers {
            id
            willUseWaiver
            notUsingReason
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
