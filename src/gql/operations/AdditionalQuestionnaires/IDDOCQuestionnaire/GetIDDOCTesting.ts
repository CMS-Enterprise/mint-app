import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIDDOCQuestionnaireTesting($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      questionnaires {
        iddocQuestionnaire {
          id
          uatTestDataNeeds
          stcTestDataNeeds
          testingTimelines
          # testingNote
          fileTypes
          # dataMonitoringFileOther
          responseTypes
          fileFrequency
        }
      }
    }
  }
`);
