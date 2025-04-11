package sqlqueries

import _ "embed"

//go:embed SQL/email/operational_solution_selected_details_get.sql
var operationalSolutionSelectedDetailsGet string

//go:embed SQL/email/mto_solution_selected_details_get.sql
var mtoSolutionSelectedDetailsGet string

//go:embed SQL/email/discussion_reply_to_originator_details_get.sql
var discussionReplyToOriginatorDetailsGet string

type emailScripts struct {
	OperationalSolutionSelectedDetailsGet string
	MTOSolutionSelectedDetailsGet         string
	DiscussionReplyToOriginatorDetailsGet string
}

// Email houses all the sql for getting data for email from the database
var Email = emailScripts{
	OperationalSolutionSelectedDetailsGet: operationalSolutionSelectedDetailsGet,
	MTOSolutionSelectedDetailsGet:         mtoSolutionSelectedDetailsGet,
	DiscussionReplyToOriginatorDetailsGet: discussionReplyToOriginatorDetailsGet,
}
