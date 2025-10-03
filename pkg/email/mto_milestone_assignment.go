package email

import (
	"strings"

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
	SolutionsList   string
}

func NewMilestoneAssignedBodyContent(
	clientAddress string,
	modelPlan *models.ModelPlan,
	milestone *models.MTOMilestone,
	solutions []string,
) MilestoneAssignedBodyContent {
	var milestoneTitle = "No Title Set"
	var needByDate = "No Date Set"
	var milestoneStatus = "Not Set"
	var milestoneRisk = "Not Set"
	if milestone != nil {
		milestoneStatus = string(milestone.Status)
		milestoneRisk = string(milestone.RiskIndicator)
	}
	if milestone != nil && milestone.Name != nil {
		milestoneTitle = *milestone.Name
	}
	if milestone != nil && milestone.NeedBy != nil {
		needByDate = milestone.NeedBy.Format("01/02/2006")
	}
	return MilestoneAssignedBodyContent{
		ModelName:       modelPlan.ModelName,
		ModelID:         modelPlan.ID.String(),
		ClientAddress:   clientAddress,
		MilestoneTitle:  milestoneTitle,
		MilestoneStatus: milestoneStatus,
		NeedByDate:      needByDate,
		RiskIndicator:   milestoneRisk,
		SolutionsList:   strings.Join(solutions, ", "),
	}
}
