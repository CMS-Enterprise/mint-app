package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// MTOReadyForReviewTemplateName is the template name for the MTO ready for review email
const MTOReadyForReviewTemplateName string = "mto_ready_for_review"

//go:embed templates/mto_ready_for_review_body.html
var mtoReadyForReviewBodyTemplate string

//go:embed templates/mto_ready_for_review_subject.html
var mtoReadyForReviewSubjectTemplate string

type mtoReadyForReviewEmails struct {
	// The email to be sent when an MTO is marked ready for review
	ReadyForReview *emailtemplates.GenEmailTemplate[MTOReadyForReviewSubjectContent, MTOReadyForReviewBodyContent]
}

var MTOReadyForReview = mtoReadyForReviewEmails{
	ReadyForReview: NewEmailTemplate[MTOReadyForReviewSubjectContent, MTOReadyForReviewBodyContent](
		MTOReadyForReviewTemplateName,
		mtoReadyForReviewSubjectTemplate,
		mtoReadyForReviewBodyTemplate,
	),
}
