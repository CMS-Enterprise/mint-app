import { gql } from '@apollo/client';

export default gql`
  query GetDataSharing($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        iddocSupport
        dataSharingStarts
        dataSharingStartsOther
        dataSharingFrequency
        dataSharingFrequencyOther
        dataSharingStartsNote
        dataCollectionStarts
        dataCollectionStartsOther
        dataCollectionFrequency
        dataCollectionFrequencyOther
        dataCollectionFrequencyNote
        qualityReportingStarts
        qualityReportingStartsOther
        qualityReportingStartsNote
      }
    }
  }
`;
