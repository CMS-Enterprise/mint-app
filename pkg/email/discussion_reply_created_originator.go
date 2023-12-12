package email

import "html/template"

// DiscussionReplyCreatedOriginatorSubject is the subject for hte email
type DiscussionReplyCreatedOriginatorSubject struct {
	UserName string // The full name of the user replying
}

// DiscussionReplyCreatedOriginatorBody is the fields needed for reply body
type DiscussionReplyCreatedOriginatorBody struct {
	ClientAddress     string
	DiscussionID      string
	DiscussionContent template.HTML // rich text with tagging etc
	ModelID           string
	ModelName         string
	ModelAbbreviation string
	OriginatorName    string
	OriginatorRole    string
	Replies           []DiscussionReplyEmailContent // all relevant reply information
}

// DiscussionReplyEmailContent represents the replies for a discussion
// These will be sorted from newest to oldest.
type DiscussionReplyEmailContent struct {
	UserName string // the full name of the user replying to email
	Role     string
	Content  template.HTML // rich text with tagging etc
}
