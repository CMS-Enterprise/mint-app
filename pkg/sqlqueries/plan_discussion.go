package sqlqueries

import _ "embed"

// planDiscussionAndNumberOfRepliesGetByID returns a planDiscussionWithNumberOfReplies object
//
//go:embed SQL/plan_discussion/and_number_of_replies_get_by_id.sql
var planDiscussionAndNumberOfRepliesGetByID string

// planDiscussionScripts holds all the relevant SQL related to Translated Audit changes
type planDiscussionScripts struct {
	//  returns a planDiscussionWithNumberOfReplies object by a specific ID
	GetWithNumberOfRepliesAtTimeByID string
}

// PlanDiscussion holds all the SQL scrips related to the PlanDiscussion Entity
var PlanDiscussion = planDiscussionScripts{
	GetWithNumberOfRepliesAtTimeByID: planDiscussionAndNumberOfRepliesGetByID,
}
