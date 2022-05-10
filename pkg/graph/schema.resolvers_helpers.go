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
	var cmsCenters []string
	for _, item := range mpi.CmsCenters {
		cmsCenters = append(cmsCenters, string(item))
	}

	plan := models.ModelPlan{
		ModelName:     mpi.ModelName,
		ModelCategory: mpi.ModelCategory,
		CMSCenters:    cmsCenters,
		CMSOther:      mpi.CmsOther,
		CMMIGroups:    cmmiGroup,
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
	milestoneModel := models.PlanMilestones{
		ModelPlanID:             *input.ModelPlanID,
		CompleteICIP:            input.CompleteIcip,
		ClearanceStarts:         input.ClearanceStarts,
		ClearanceEnds:           input.ClearanceEnds,
		Announced:               input.Announced,
		ApplicationsStart:       input.ApplicationsStart,
		ApplicationsEnd:         input.ApplicationsEnd,
		PerformancePeriodStarts: input.PerformancePeriodStarts,
		PerformancePeriodEnds:   input.PerformancePeriodEnds,
		WrapUpEnds:              input.WrapUpEnds,
		HighLevelNote:           input.HighLevelNote,
		PhasedIn:                input.PhasedIn,
		PhasedInNote:            input.PhasedInNote,
		CreatedBy:               input.CreatedBy,
		CreatedDts:              input.CreatedDts,
		ModifiedBy:              input.ModifiedBy,
		ModifiedDts:             input.ModifiedDts,
	}

	if input.ID != nil {
		milestoneModel.ID = *input.ID
	}
	if input.Status != nil {
		milestoneModel.Status = *input.Status
	}

	return &milestoneModel
}

// ConvertToPlanDocumentModel takes an auto-generated model plan input and converts it to a hand-written one
func ConvertToPlanDocumentModel(input *model.PlanDocumentInput) *models.PlanDocument {
	documentModel := models.PlanDocument{
		ModelPlanID:          input.ModelPlanID,
		FileType:             nil,
		Bucket:               nil,
		FileKey:              nil,
		VirusScanned:         false,
		VirusClean:           false,
		FileName:             nil,
		FileSize:             0,
		DocumentType:         nil,
		OtherTypeDescription: nil,
		DeletedAt:            nil,
		CreatedBy:            nil,
		CreatedDts:           nil,
		ModifiedBy:           nil,
		ModifiedDts:          nil,
	}

	if input.ID != nil {
		documentModel.ID = *input.ID
	}

	if input.DocumentParameters != nil {
		documentModel.FileName = input.DocumentParameters.FileName
		documentModel.FileSize = input.DocumentParameters.FileSize
		documentModel.FileType = input.DocumentParameters.FileType
		documentModel.DocumentType = input.DocumentParameters.DocumentType
		documentModel.OtherTypeDescription = input.DocumentParameters.OtherTypeDescription
	}

	return &documentModel
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
	if dri.ID != nil {
		reply.ID = *dri.ID
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
