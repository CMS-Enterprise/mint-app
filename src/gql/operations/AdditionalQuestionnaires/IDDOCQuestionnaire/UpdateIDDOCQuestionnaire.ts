import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateIDDOCQuestionnaire(
    $id: UUID!
    $changes: IDDOCQuestionnaireChanges!
  ) {
    updateIDDOCQuestionnaire(id: $id, changes: $changes) {
      id
    }
  }
`);
