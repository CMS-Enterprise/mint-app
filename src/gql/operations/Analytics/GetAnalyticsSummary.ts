import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAnalyticsSummary {
    analytics {
      changesPerModel {
        modelName
        numberOfChanges
        numberOfRecordChanges
        modelPlanID
      }
      changesPerModelBySection {
        modelName
        numberOfChanges
        numberOfRecordChanges
        modelPlanID
        tableName
      }
      changesPerModelOtherData {
        modelName
        numberOfChanges
        numberOfRecordChanges
        modelPlanID
        section
      }
      modelsByStatus {
        numberOfModels
        status
      }
      numberOfFollowersPerModel {
        modelName
        modelPlanID
        numberOfFollowers
      }
      totalNumberOfModels {
        totalNumberOfModels
      }
      numberOfModelsOverTime {
        monthYear
        numberOfModels
      }
    }
  }
`);
