package email

import (
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

type MilestoneAssignedSubjectContent struct {
	ModelName string
}

type MilestoneAssignedBodyContent struct {
	ModelName       string
	ModelID         string
	ClientAddress   string
	MilestoneTitle  string
	MilestoneStatus string
	NeedByDate      string
	RiskIndicator   string
	Solutions       []string
}

func NewMilestoneAssignedBodyContent(
	clientAddress string,
	modelPlan *models.ModelPlan,
	milestone *models.MTOMilestone,
	assignedUser *authentication.UserAccount,
	solutions []string,
) MilestoneAssignedBodyContent {
	var milestoneTitle string
	var needByDate string
	if milestone != nil && milestone.Name != nil {
		milestoneTitle = *milestone.Name
	} else {
		milestoneTitle = ""
	}
	if milestone != nil && milestone.NeedBy != nil {
		needByDate = milestone.NeedBy.Format("01/02/2006")
	} else {
		needByDate = ""
	}
	return MilestoneAssignedBodyContent{
		ModelName:       modelPlan.ModelName,
		ModelID:         modelPlan.ID.String(),
		ClientAddress:   clientAddress,
		MilestoneTitle:  milestoneTitle,
		MilestoneStatus: string(milestone.Status),
		NeedByDate:      needByDate,
		RiskIndicator:   string(milestone.RiskIndicator),
		Solutions:       solutions,
	}
}
