import { gql } from '@apollo/client';

export default gql`
  query GetProviderOptions($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        providerAdditionFrequency
        providerAdditionFrequencyOther
        providerAdditionFrequencyNote
        providerAddMethod
        providerAddMethodOther
        providerAddMethodNote
        providerLeaveMethod
        providerLeaveMethodOther
        providerLeaveMethodNote
        providerOverlap
        providerOverlapHierarchy
        providerOverlapNote
        status
      }
    }
  }
`;
