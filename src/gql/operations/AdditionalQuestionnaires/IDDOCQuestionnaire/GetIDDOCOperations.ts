import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIDDOCQuestionnaireOperations($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      questionnaires {
        iddocQuestionnaire {
          id
          technicalContactsIdentified
          technicalContactsIdentifiedDetail
          technicalContactsIdentifiedNote
          captureParticipantInfo
          captureParticipantInfoNote
          icdOwner
          draftIcdDueDate
          icdNote
        }
      }
    }
  }
`);
