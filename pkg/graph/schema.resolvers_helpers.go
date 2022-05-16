package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

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
		OptionalNotes:        nil,
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
		documentModel.OptionalNotes = input.DocumentParameters.OptionalNotes
	}

	return &documentModel
}
