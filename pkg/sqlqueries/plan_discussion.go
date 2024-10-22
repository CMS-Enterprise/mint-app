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

// planDiscussionScripts holds all the relevant SQL related to Translated Audit changes
type planDiscussionScripts struct {
	//  returns a planDiscussionWithNumberOfReplies object by a specific ID
	GetWithNumberOfRepliesAtTimeByID string
	// a query that returns a list of discussions for a given list of model plan ids
	GetByModelPlanIDLoader string
}

// PlanDiscussion holds all the SQL scrips related to the PlanDiscussion Entity
var PlanDiscussion = planDiscussionScripts{
	GetWithNumberOfRepliesAtTimeByID: planDiscussionAndNumberOfRepliesGetByID,
	GetByModelPlanIDLoader:           planDiscussionGetByModelPlanIDLoaderSQL,
}
