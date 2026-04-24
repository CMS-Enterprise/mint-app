"""GraphQL queries for MCP Resources (read-only browseable data)."""

from gql import gql

GET_MODEL_PLAN_RESOURCE = gql("""
    query GetModelPlanResource($id: UUID!) {
        modelPlan(id: $id) {
            id
            modelName
            abbreviation
            status
            createdDts
            modifiedDts
            basics {
                goal
                performancePeriodStarts
                performancePeriodEnds
                wrapUpEnds
                completeICIP
                clearanceStarts
                clearanceEnds
                announced
                applicationsStart
                applicationsEnd
            }
            collaborators {
                userAccount {
                    commonName
                    email
                }
                teamRoles
            }
        }
    }
""")
