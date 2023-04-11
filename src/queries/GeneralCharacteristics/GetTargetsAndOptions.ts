import { gql } from '@apollo/client';

export default gql`
  query GetTargetsAndOptions($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        id
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
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`;
