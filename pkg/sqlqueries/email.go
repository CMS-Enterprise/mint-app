package sqlqueries

import _ "embed"

//go:embed SQL/email/solution_selected_details_get.sql
var solutionSelectedDetailsGet string

//go:embed SQL/email/discussion_reply_to_originator_details_get.sql
var discussionReplyToOriginatorDetailsGet string

type emailScripts struct {
	SolutionSelectedDetailsGet            string
	DiscussionReplyToOriginatorDetailsGet string
}

// Email houses all the sql for getting data for email from the database
var Email = emailScripts{
	SolutionSelectedDetailsGet:            solutionSelectedDetailsGet,
	DiscussionReplyToOriginatorDetailsGet: discussionReplyToOriginatorDetailsGet,
}
