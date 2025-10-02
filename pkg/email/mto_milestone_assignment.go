package email

import (
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
	solutions []string,
) MilestoneAssignedBodyContent {
	return MilestoneAssignedBodyContent{
		ModelName:       modelPlan.ModelName,
		ModelID:         modelPlan.ID.String(),
		ClientAddress:   clientAddress,
		MilestoneTitle:  *milestone.Name,
		MilestoneStatus: string(milestone.Status),
		NeedByDate:      milestone.NeedBy.Format("01/02/2006"),
		RiskIndicator:   string(milestone.RiskIndicator),
		Solutions:       solutions,
	}
}
