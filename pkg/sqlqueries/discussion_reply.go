package sqlqueries

import _ "embed"

//go:embed SQL/discussion_reply/create.sql
var discussionReplyCreateSQL string

//go:embed SQL/discussion_reply/update.sql
var discussionReplyUpdateSQL string

//go:embed SQL/discussion_reply/delete.sql
var discussionReplyDeleteSQL string

//go:embed SQL/discussion_reply/get_by_id.sql
var discussionReplyGetByID string

//go:embed SQL/discussion_reply/get_by_discussion_id_LOADER.sql
var discussionReplyGetByDiscussionIDLoaderSQL string

type discussionReplyScripts struct {
	Create                  string
	Update                  string
	Delete                  string
	GetByID                 string
	GetByDiscussionIDLoader string
}

// DiscussionReply houses all the sql for getting data for discussion reply from the database
var DiscussionReply = discussionReplyScripts{
	Create:                  discussionReplyCreateSQL,
	Update:                  discussionReplyUpdateSQL,
	Delete:                  discussionReplyDeleteSQL,
	GetByID:                 discussionReplyGetByID,
	GetByDiscussionIDLoader: discussionReplyGetByDiscussionIDLoaderSQL,
}
