package sqlqueries

import _ "embed"

// planDiscussionAndNumberOfRepliesGetByID returns a planDiscussionWithNumberOfReplies object
//
//go:embed SQL/plan_discussion/and_number_of_replies_get_by_id.sql
var planDiscussionAndNumberOfRepliesGetByID string

// planDiscussionGetByModelPlanIDLoaderSQL returns a query that will fetch all plan discussions for a given model plan ID
//
//go:embed SQL/plan_discussion/get_by_model_plan_id_LOADER.sql
var planDiscussionGetByModelPlanIDLoaderSQL string

// planDiscussionCreateSQL returns a query to create a plan discussion
//
//go:embed SQL/plan_discussion/create.sql
var planDiscussionCreateSQL string

// planDiscussionUpdateSQL returns a query to update a plan discussion
//
//go:embed SQL/plan_discussion/update.sql
var planDiscussionUpdateSQL string

// planDiscussionDeleteSQL returns a query to delete a plan discussion
//
//go:embed SQL/plan_discussion/delete.sql
var planDiscussionDeleteSQL string

// planDiscussionGetByID returns a query to get a plan discussion by id
//
//go:embed SQL/plan_discussion/get_by_id.sql
var planDiscussionGetByID string

// getUserRoleSQL returns a query to get most recent user role based on discussions/replies
//
//go:embed SQL/plan_discussion/get_most_recent_user_role.sql
var getUserRoleSQL string

// planDiscussionScripts holds all the relevant SQL related to Translated Audit changes
type planDiscussionScripts struct {
	//  returns a planDiscussionWithNumberOfReplies object by a specific ID
	GetWithNumberOfRepliesAtTimeByID string
	// a query that returns a list of discussions for a given list of model plan ids
	GetByModelPlanIDLoader string

	Create      string
	Update      string
	Delete      string
	GetByID     string
	GetUserRole string
}

// PlanDiscussion holds all the SQL scrips related to the PlanDiscussion Entity
var PlanDiscussion = planDiscussionScripts{
	GetWithNumberOfRepliesAtTimeByID: planDiscussionAndNumberOfRepliesGetByID,
	GetByModelPlanIDLoader:           planDiscussionGetByModelPlanIDLoaderSQL,
	Create:                           planDiscussionCreateSQL,
	Update:                           planDiscussionUpdateSQL,
	Delete:                           planDiscussionDeleteSQL,
	GetByID:                          planDiscussionGetByID,
	GetUserRole:                      getUserRoleSQL,
}
