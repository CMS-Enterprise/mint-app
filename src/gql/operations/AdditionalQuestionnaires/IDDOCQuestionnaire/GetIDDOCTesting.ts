import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIDDOCQuestionnaireTesting($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      questionnaires {
        iddocQuestionnaire {
          id
          uatNeeds
          stcNeeds
          testingTimelines
          testingNote
          dataMonitoringFileTypes
          dataMonitoringFileOther
          dataResponseType
          dataResponseFileFrequency
        }
      }
    }
  }
`);
