import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGeneralCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        id
        isNewModel
        currentModelPlanID
        existingModelID
        resemblesExistingModel
        resemblesExistingModelWhyHow
        resemblesExistingModelHow
        resemblesExistingModelNote
        resemblesExistingModelWhich {
          links {
            id
            existingModelID
            currentModelPlanID
          }
        }
        resemblesExistingModelOtherSpecify
        resemblesExistingModelOtherSelected
        resemblesExistingModelOtherOption
        hasComponentsOrTracks
        hasComponentsOrTracksDiffer
        hasComponentsOrTracksNote
      }
    }
  }
`);
