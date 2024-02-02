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
        resemblesExistingModelHow
        resemblesExistingModelNote
        resemblesExistingModelWhich {
          links {
            id
            existingModelID
            currentModelPlanID
            fieldName
            model {
              ... on ExistingModel {
                modelName
                stage
                numberOfParticipants
                keywords
              }
              ... on ModelPlan {
                modelName
                abbreviation
              }
            }
          }
        }
        hasComponentsOrTracks
        hasComponentsOrTracksDiffer
        hasComponentsOrTracksNote
      }
    }
  }
`);
