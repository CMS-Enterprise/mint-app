package sqlqueries

import _ "embed"

//go:embed SQL/plan_collaborator/create.sql
var planCollaboratorCreateSQL string

//go:embed SQL/plan_collaborator/update.sql
var planCollaboratorUpdateSQL string

//go:embed SQL/plan_collaborator/delete.sql
var planCollaboratorDeleteSQL string

//go:embed SQL/plan_collaborator/fetch_by_id.sql
var planCollaboratorFetchByIDSQL string

//go:embed SQL/plan_collaborator/get_by_model_plan_id_LOADER.sql
var planCollaboratorGetByModelPlanIDLoaderSQL string

type planCollaboratorScripts struct {
	// Holds the SQL query to create an PlanCollaborator
	Create string
	// Holds the SQL query to update an PlanCollaborator
	Update string
	// Holds the SQL query to delete an PlanCollaborator
	Delete string
	// Holds the SQL query to get a single PlanCollaborator
	GetByID string
	// Holds the SQL query to return all PlanCollaborators for a provided JSONArray of ids
	CollectionGetByIDLoader string
	// Holds the SQL query to return all PlanCollaborator for a given ModelPlanID.
	CollectionGetByModelPlanIDLoader string
}

// planCollaborator holds all the SQL scrips related to the planCollaborator Entity
var PlanCollaborator = planCollaboratorScripts{
	Create:                           planCollaboratorCreateSQL,
	Update:                           planCollaboratorUpdateSQL,
	Delete:                           planCollaboratorDeleteSQL,
	GetByID:                          planCollaboratorFetchByIDSQL,
	CollectionGetByIDLoader:          planCollaboratorFetchByIDSQL,
	CollectionGetByModelPlanIDLoader: planCollaboratorGetByModelPlanIDLoaderSQL,
}
