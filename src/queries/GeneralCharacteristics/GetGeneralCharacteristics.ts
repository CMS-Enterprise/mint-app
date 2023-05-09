import { gql } from '@apollo/client';

export default gql`
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
        existingModel
        resemblesExistingModel
        resemblesExistingModelHow
        resemblesExistingModelNote
        hasComponentsOrTracks
        hasComponentsOrTracksDiffer
        hasComponentsOrTracksNote
      }
    }
  }
`;
