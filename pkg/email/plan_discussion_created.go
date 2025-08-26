package email

import (
	"html/template"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// PlanDiscussionCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionCreatedSubjectContent struct {
	ModelName         string
	ModelAbbreviation string
	UserName          string
}

// PlanDiscussionCreatedBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionCreatedBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	UserName          string
	DiscussionContent template.HTML // the rich text content of the discussion. It is written as template.HTML to allow it be rendered as HTML with the templating library
	ModelID           string
	ModelName         string
	Role              string
}

// constructor for PlanDiscussionCreatedBodyContent
func NewPlanDiscussionCreatedBodyContent(
	clientAddress string,
	planDiscussion *models.PlanDiscussion,
	modelPlan *models.ModelPlan,
	userName string,
	role string,
) *PlanDiscussionCreatedBodyContent {
	return &PlanDiscussionCreatedBodyContent{
		ClientAddress:     clientAddress,
		DiscussionID:      planDiscussion.ID.String(),
		UserName:          userName,
		DiscussionContent: planDiscussion.Content.RawContent.ToTemplate(),
		ModelID:           modelPlan.ID.String(),
		ModelName:         modelPlan.ModelName,
		Role:              role,
	}
}
