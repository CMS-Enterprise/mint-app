"""GraphQL queries for Analytics operations."""

from gql import gql

GET_ANALYTICS_SUMMARY = gql("""
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
""")
