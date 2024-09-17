package email

import (
	"html/template"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// DiscussionReplyCreatedOriginatorSubject is the subject for hte email
type DiscussionReplyCreatedOriginatorSubject struct {
	ModelName         string
	ModelAbbreviation string
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
	ReplyCount        int
	Replies           []DiscussionReplyEmailContent // two most recent  replies with all relevant reply information
}

// DiscussionReplyEmailContent represents the replies for a discussion
// These will be sorted from newest to oldest.
type DiscussionReplyEmailContent struct {
	UserName string // the full name of the user replying to email
	ID       uuid.UUID
	Role     string
	Content  template.HTML // rich text with tagging etc
}

// DiscussionReplyEmailContentDB represents the replies for a discussion and are returned direvtly from teh database with extended properties
type DiscussionReplyEmailContentDB struct {
	CommonName          string                     `json:"commonName" db:"common_name"` // Name of user who created the reply
	Email               string                     `json:"email" db:"email"`            // Email of user who created reply
	ID                  uuid.UUID                  `json:"id" db:"id"`
	DiscussionID        uuid.UUID                  `json:"discussionID" db:"discussion_id"`
	Role                *models.DiscussionUserRole `json:"userRole" db:"user_role"`
	UserRoleDescription *string                    `json:"userRoleDescription" db:"user_role_description"`
	Content             models.TaggedHTML          `json:"content" db:"content"`
	IsAssessment        bool                       `json:"isAssessment" db:"is_assessment"`
	CreatedDts          time.Time                  `json:"createdDts" db:"created_dts"`
}

// ToDiscussionReplyEmailContent converts DiscussionReplyEmailContentDB to the form needed for the email
func (dreb *DiscussionReplyEmailContentDB) ToDiscussionReplyEmailContent() DiscussionReplyEmailContent {
	return DiscussionReplyEmailContent{
		UserName: dreb.CommonName,
		ID:       dreb.ID,
		Role:     dreb.Role.Humanize(models.ValueOrEmpty(dreb.UserRoleDescription)),
		Content:  dreb.Content.RawContent.ToTemplate(),
	}
}

// DiscussionRepliesEmailContentDBToEmailForm converts an array of db contents to the form needed for email
func DiscussionRepliesEmailContentDBToEmailForm(drebs []*DiscussionReplyEmailContentDB) []DiscussionReplyEmailContent {
	replyEmails := lo.Map(drebs, func(reply *DiscussionReplyEmailContentDB, _ int) DiscussionReplyEmailContent {
		return reply.ToDiscussionReplyEmailContent()
	})
	return replyEmails
}
