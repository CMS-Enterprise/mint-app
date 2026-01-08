package email

import (
	"strings"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

type MTOMilestoneAssignedSubjectContent struct {
	ModelName string
}

type MTOMilestoneAssignedBodyContent struct {
	ModelName       string
	ModelID         string
	ClientAddress   string
	MilestoneTitle  string
	MilestoneStatus string
	NeedByDate      string
	RiskIndicator   string
	SolutionsList   string
}

func NewMTOMilestoneAssignedBodyContent(
	clientAddress string,
	modelPlan *models.ModelPlan,
	milestone *models.MTOMilestone,
	solutions []string,
) MTOMilestoneAssignedBodyContent {
	var milestoneTitle = "No Title Set"
	var needByDate = "No Date Set"
	var milestoneStatus = "Not Set"
	var milestoneRisk = "Not Set"
	if milestone != nil {
		milestoneStatus = milestone.Status.Humanize()
		milestoneRisk = milestone.RiskIndicator.Humanize()

		if milestone.Name != nil {
			milestoneTitle = *milestone.Name
		}

		if milestone.NeedBy != nil {
			needByDate = milestone.NeedBy.Format("01/02/2006")
		}
	}

	return MTOMilestoneAssignedBodyContent{
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
