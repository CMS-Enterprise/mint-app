package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

// ConvertToModelPlan takes an auto-generated model plan input and converts it to a hand-written one
func ConvertToModelPlan(mpi *model.ModelPlanInput) *models.ModelPlan {
	// TODO: We should probably have a better way to handle enum arrays
	var cmmiGroup []string
	for _, item := range mpi.CmmiGroups {
		cmmiGroup = append(cmmiGroup, string(item))
	}

	plan := models.ModelPlan{
		ModelName:     mpi.ModelName,
		ModelCategory: mpi.ModelCategory,
		CMSCenter:     mpi.CmsCenter,
		CMMIGroup:     cmmiGroup,
		Archived:      mpi.Archived,
		Status:        mpi.Status,
		CreatedBy:     mpi.CreatedBy,
		CreatedDts:    mpi.CreatedDts,
		ModifiedBy:    mpi.ModifiedBy,
		ModifiedDts:   mpi.ModifiedDts,
	}

	if mpi.ID != nil {
		plan.ID = *mpi.ID
	}
	return &plan

}

// ConvertToPlanBasics takes an auto-generated plan basics input and converts it to a hand-written one
func ConvertToPlanBasics(mpi *model.PlanBasicsInput) *models.PlanBasics {
	basics := models.PlanBasics{
		ModelPlanID:    *mpi.ModelPlanID,
		ModelType:      mpi.ModelType,
		Problem:        mpi.Problem,
		Goal:           mpi.Goal,
		TestInventions: mpi.TestInventions,
		Note:           mpi.Note,
		CreatedBy:      mpi.CreatedBy,
		CreatedDts:     mpi.CreatedDts,
		ModifiedBy:     mpi.ModifiedBy,
		ModifiedDts:    mpi.ModifiedDts,
	}

	if mpi.ID != nil {
		basics.ID = *mpi.ID
	}
	if mpi.Status != nil {
		basics.Status = *mpi.Status
	}

	return &basics
}

// ConvertToPlanMilestonesModel takes an auto-generated model plan input and converts it to a hand-written one
func ConvertToPlanMilestonesModel(input *model.PlanMilestonesInput) *models.PlanMilestones {
	model := models.PlanMilestones{
		ModelPlanID:             *input.ModelPlanID,
		EnterCMSClearance:       input.EnterCMSClearance,
		EnterHMSOMBClearance:    input.EnterHMSOMBClearance,
		Cleared:                 input.Cleared,
		Announced:               input.Announced,
		ApplicationsDue:         input.ApplicationsDue,
		ParticipantsAnnounced:   input.ParticipantsAnnounced,
		PerformancePeriodStarts: input.PerformancePeriodStarts,
		PerformancePeriodEnds:   input.PerformancePeriodEnds,
		CreatedBy:               input.CreatedBy,
		CreatedDts:              input.CreatedDts,
		ModifiedBy:              input.ModifiedBy,
		ModifiedDts:             input.ModifiedDts,
	}

	if input.ID != nil {
		model.ID = *input.ID
	}

	return &model
}

// ConvertToPlanCollaborator takes an auto-generated plan collaborator input and converts it to a hand-written one
func ConvertToPlanCollaborator(pci *model.PlanCollaboratorInput) *models.PlanCollaborator {
	collaborator := models.PlanCollaborator{
		ModelPlanID: pci.ModelPlanID,
		EUAUserID:   pci.EuaUserID,
		FullName:    pci.FullName,
		TeamRole:    pci.TeamRole,
		CreatedBy:   pci.CreatedBy,
		CreatedDts:  pci.CreatedDts,
		ModifiedBy:  pci.ModifiedBy,
		ModifiedDts: pci.ModifiedDts,
	}

	if pci.ID != nil {
		collaborator.ID = *pci.ID
	}
	return &collaborator

}

//ConvertToPlanDiscussion takes and auto-generated plan discussion input and converts it to a hand-written one
func ConvertToPlanDiscussion(pdi *model.PlanDiscussionInput) *models.PlanDiscussion {
	discussion := models.PlanDiscussion{

		ModelPlanID: pdi.ModelPlanID,
		Content:     pdi.Content,
	}
	if pdi.ID != nil {
		discussion.ID = *pdi.ID
	}
	if pdi.Status != nil {
		discussion.Status = *pdi.Status
	}
	if pdi.CreatedBy != nil {
		discussion.CreatedBy = *pdi.CreatedBy
	}
	if pdi.CreatedDts != nil {
		discussion.CreatedDts = *pdi.CreatedDts
	}
	if pdi.ModifiedBy != nil {
		discussion.ModifiedBy = *pdi.ModifiedBy

	}
	if pdi.ModifiedDts != nil {
		discussion.ModifiedDts = *pdi.ModifiedDts
	}

	return &discussion
}

//ConvertToDiscussionReply takes and auto-generated discussion reply input and converts it to a hand-written one
func ConvertToDiscussionReply(dri *model.DiscussionReplyInput) *models.DiscussionReply {
	reply := models.DiscussionReply{
		DiscussionID: dri.DiscussionID,
		Content:      dri.Content,
		Resolution:   dri.Resolution,
	}

	if dri.CreatedBy != nil {
		reply.CreatedBy = *dri.CreatedBy
	}
	if dri.CreatedDts != nil {
		reply.CreatedDts = *dri.CreatedDts
	}
	if dri.ModifiedBy != nil {
		reply.ModifiedBy = *dri.ModifiedBy

	}
	if dri.ModifiedDts != nil {
		reply.ModifiedDts = *dri.ModifiedDts
	}

	return &reply
}
