package sqlqueries

import _ "embed"

// planCollaboratorCreateSQL creates a Plan Collaborator entry in the database
//
//go:embed SQL/plan_collaborator/create.sql
var planCollaboratorCreateSQL string

// planCollaboratorUpdateSQL updates a Plan Collaborator entry in the database
//
//go:embed SQL/plan_collaborator/update.sql
var planCollaboratorUpdateSQL string

// planCollaboratorDeleteSQL deletes a Plan Collaborator entry in the database
//
//go:embed SQL/plan_collaborator/delete.sql
var planCollaboratorDeleteSQL string

// planCollaboratorGetByIDSQL returns a Plan Collaborator entry in the database. When possible, the data loader version should be preferred
//
//go:embed SQL/plan_collaborator/get_by_id.sql
var planCollaboratorGetByIDSQL string

// planCollaboratorGetByIDLoaderSQL returns a Collection of Plan Collaborator entries from the database. It expects a JSON array of IDs, which represent the id of the entry
//
//go:embed SQL/plan_collaborator/get_by_id_LOADER.sql
var planCollaboratorGetByIDLoaderSQL string

// planCollaboratorGetByModelPlanIDLoaderSQL  returns a Collection of Plan Collaborator entries from the database. It expects a JSON array of model_plan_ids, the result can be processed to return all collaborators for various model plans
//
//go:embed SQL/plan_collaborator/get_by_model_plan_id_LOADER.sql
var planCollaboratorGetByModelPlanIDLoaderSQL string

// planCollaboratorGetCountByUserID returns the number of Plan Collaborator entries in the database for a given user_id
//
//go:embed SQL/plan_collaborator/get_count_by_user_id.sql
var planCollaboratorGetCountByUserID string

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
	// Holds the SQL query to return the number of PlanCollaborators for a given user_id
	GetCountByUserID string
}

// PlanCollaborator holds all the SQL scrips related to the Plan Collaborator Entity
var PlanCollaborator = planCollaboratorScripts{
	Create:                           planCollaboratorCreateSQL,
	Update:                           planCollaboratorUpdateSQL,
	Delete:                           planCollaboratorDeleteSQL,
	GetByID:                          planCollaboratorGetByIDSQL,
	CollectionGetByIDLoader:          planCollaboratorGetByIDLoaderSQL,
	CollectionGetByModelPlanIDLoader: planCollaboratorGetByModelPlanIDLoaderSQL,
	GetCountByUserID:                 planCollaboratorGetCountByUserID,
}
