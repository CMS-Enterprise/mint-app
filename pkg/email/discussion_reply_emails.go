package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// DiscussionReplyCreatedOriginatorTemplateName is the template name definition for the corresponding email template
const DiscussionReplyCreatedOriginatorTemplateName string = "discussion_reply_created_originator"

//go:embed templates/discussion_reply_created_originator_subject.html
var discussionReplyCreatedOriginatorSubjectTemplate string

//go:embed templates/discussion_reply_created_originator_body.html
var discussionReplyCreatedOriginatorBodyTemplate string

type discussionReplyEmails struct {
	// The email to be sent when a discussion reply is created to the originator
	CreatedOriginator *emailtemplates.GenEmailTemplate[DiscussionReplyCreatedOriginatorSubject, DiscussionReplyCreatedOriginatorBody]
}

var DiscussionReply = discussionReplyEmails{
	CreatedOriginator: NewEmailTemplate[DiscussionReplyCreatedOriginatorSubject, DiscussionReplyCreatedOriginatorBody](
		DiscussionReplyCreatedOriginatorTemplateName,
		discussionReplyCreatedOriginatorSubjectTemplate,
		discussionReplyCreatedOriginatorBodyTemplate,
	),
}
