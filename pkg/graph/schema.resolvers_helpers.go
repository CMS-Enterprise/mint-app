package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

// ConvertToModelPlan takes an auto-generated model plan input and converts it to a handwritten one
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

// ConvertToPlanBasics takes an auto-generated plan basics input and converts it to a handwritten one
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

// ConvertToPlanMilestonesModel takes an auto-generated model plan input and converts it to a handwritten one
func ConvertToPlanMilestonesModel(input *model.PlanMilestonesInput) *models.PlanMilestones {
	milestoneModel := models.PlanMilestones{
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
		milestoneModel.ID = *input.ID
	}

	return &milestoneModel
}

// ConvertToPlanDocumentModel takes an auto-generated model plan input and converts it to a handwritten one
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

// ConvertToPlanCollaborator takes an auto-generated plan collaborator input and converts it to a handwritten one
func ConvertToPlanCollaborator(pci *model.PlanCollaboratorInput) *models.PlanCollaborator {
	collaborator := models.PlanCollaborator{
		ModelPlanID: pci.ModelPlanID,
		EUAUserID:   pci.EuaUserID,
		FullName:    pci.FullName,
		CMSCenter:   pci.CmsCenter,
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
