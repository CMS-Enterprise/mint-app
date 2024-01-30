import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllGeneralCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      generalCharacteristics {
        id
        isNewModel
        existingModel
        resemblesExistingModel
        resemblesExistingModelHow
        resemblesExistingModelNote
        resemblesExistingModelWhich {
          names
        }
        resemblesExistingModelOtherSpecify
        resemblesExistingModelOtherSelected
        resemblesExistingModelOtherOption
        hasComponentsOrTracks
        hasComponentsOrTracksDiffer
        hasComponentsOrTracksNote
        alternativePaymentModelTypes
        alternativePaymentModelNote
        keyCharacteristics
        keyCharacteristicsOther
        keyCharacteristicsNote
        collectPlanBids
        collectPlanBidsNote
        managePartCDEnrollment
        managePartCDEnrollmentNote
        planContractUpdated
        planContractUpdatedNote
        careCoordinationInvolved
        careCoordinationInvolvedDescription
        careCoordinationInvolvedNote
        additionalServicesInvolved
        additionalServicesInvolvedDescription
        additionalServicesInvolvedNote
        communityPartnersInvolved
        communityPartnersInvolvedDescription
        communityPartnersInvolvedNote
        geographiesTargeted
        geographiesTargetedTypes
        geographiesStatesAndTerritories
        geographiesRegionTypes
        geographiesTargetedTypesOther
        geographiesTargetedAppliedTo
        geographiesTargetedAppliedToOther
        geographiesTargetedNote
        participationOptions
        participationOptionsNote
        agreementTypes
        agreementTypesOther
        multiplePatricipationAgreementsNeeded
        multiplePatricipationAgreementsNeededNote
        rulemakingRequired
        rulemakingRequiredDescription
        rulemakingRequiredNote
        authorityAllowances
        authorityAllowancesOther
        authorityAllowancesNote
        waiversRequired
        waiversRequiredTypes
        waiversRequiredNote
        status
      }
    }
  }
`);
