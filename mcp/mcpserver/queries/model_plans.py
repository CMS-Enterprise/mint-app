"""GraphQL queries for Model Plan operations."""

from gql import gql

GET_MODEL_PLAN_DETAILS = gql("""
    query GetModelPlanDetails($id: UUID!) {
        modelPlan(id: $id) {
            id
            modelName
            abbreviation
            status
            createdDts
            modifiedDts
            basics {
                id
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
        }
    }
""")

GET_MODEL_PLAN_TIMELINE = gql("""
    query GetModelPlanTimeline($id: UUID!) {
        modelPlan(id: $id) {
            id
            basics {
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
        }
    }
""")

GET_MODEL_COLLABORATORS = gql("""
    query GetCollaborators($id: UUID!) {
        modelPlan(id: $id) {
            id
            collaborators {
                id
                userID
                teamRoles
                userAccount {
                    id
                    username
                    commonName
                    email
                }
            }
        }
    }
""")

LIST_MODEL_PLANS = gql("""
    query ListModelPlans($filter: ModelPlanFilter!) {
        modelPlanCollection(filter: $filter) {
            id
            modelName
            abbreviation
            status
            createdDts
            modifiedDts
        }
    }
""")
