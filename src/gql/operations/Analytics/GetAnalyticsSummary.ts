import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAnalyticsSummary {
    analytics {
      changesPerModel {
        modelName
        numberOfChanges
        numberOfRecordChanges
        modelPlanId
      }
      changesPerModelBySection {
        modelName
        numberOfChanges
        numberOfRecordChanges
        modelPlanId
        tableName
      }
      changesPerModelOtherData {
        modelName
        numberOfChanges
        numberOfRecordChanges
        modelPlanId
        section
      }
      modelsByStatus {
        numberOfModels
        status
      }
      numberOfFollowersPerModel {
        modelName
        modelPlanId
        numberOfFollowers
      }
      totalNumberOfModels {
        totalNumberOfModels
      }
    }
  }
`);
