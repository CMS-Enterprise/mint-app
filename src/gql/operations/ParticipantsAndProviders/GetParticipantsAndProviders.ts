import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetParticipantsAndProviders($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        participants
        medicareProviderType
        isNewTypeOfProvidersOrSuppliers
        statesEngagement
        participantsOther
        participantsNote
        participantsCurrentlyInModels
        participantsCurrentlyInModelsNote
        modelApplicationLevel
      }
    }
  }
`);
