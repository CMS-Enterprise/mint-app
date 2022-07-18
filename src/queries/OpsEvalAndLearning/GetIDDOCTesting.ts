import { gql } from '@apollo/client';

export default gql`
  query GetIDDOCTesting($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        iddocSupport
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
`;
