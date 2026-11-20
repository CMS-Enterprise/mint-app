package sqlqueries

import _ "embed"

//go:embed SQL/ctat_discussion/create.sql
var ctatDiscussionCreateSQL string

//go:embed SQL/ctat_discussion/get_by_ticket_id_LOADER.sql
var ctatDiscussionsByTicketIDLoaderSQL string

type ctatDiscussionScripts struct {
	Create              string
	GetByTicketIDLoader string
}

// CTATDiscussion houses all the SQL queries for CTAT discussions
var CTATDiscussion = ctatDiscussionScripts{
	Create:              ctatDiscussionCreateSQL,
	GetByTicketIDLoader: ctatDiscussionsByTicketIDLoaderSQL,
}
