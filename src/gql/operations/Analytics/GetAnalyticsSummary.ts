import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAnalyticsSummary {
    analytics {
      changesPerModel {
        modelName
        numberOfChanges
        numberOfRecordChanges
      }
      changesPerModelBySection {
        modelName
        tableName
        numberOfChanges
        numberOfRecordChanges
      }
      changesPerModelOtherData {
        modelName
        section
        numberOfChanges
        numberOfRecordChanges
      }
      modelsByStatus {
        status
        numberOfModels
      }
      numberOfFollowersPerModel {
        modelName
        numberOfFollowers
      }
      numberOfModelsOverTime {
        monthYear
        numberOfModels
      }
    }
  }
`);
