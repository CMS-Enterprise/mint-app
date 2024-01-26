import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTargetsAndOptions($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        id
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
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`);
