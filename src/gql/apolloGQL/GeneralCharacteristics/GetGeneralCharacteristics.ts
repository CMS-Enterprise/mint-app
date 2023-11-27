import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGeneralCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      existingModelLinks {
        id
        existingModelID
        currentModelPlanID
      }
      generalCharacteristics {
        id
        isNewModel
        currentModelPlanID
        existingModelID
        resemblesExistingModel
        resemblesExistingModelHow
        resemblesExistingModelNote
        hasComponentsOrTracks
        hasComponentsOrTracksDiffer
        hasComponentsOrTracksNote
      }
    }
  }
`);
