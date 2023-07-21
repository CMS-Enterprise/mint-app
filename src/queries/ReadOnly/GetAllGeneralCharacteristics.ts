import { gql } from '@apollo/client';

export default gql`
  query GetAllGeneralCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      existingModelLinks {
        id
        existingModel {
          id
          modelName
        }
        currentModelPlan {
          id
          modelName
        }
      }
      generalCharacteristics {
        id
        isNewModel
        existingModel
        resemblesExistingModel
        resemblesExistingModelHow
        resemblesExistingModelNote
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
`;
