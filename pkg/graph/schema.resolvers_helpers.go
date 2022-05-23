package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

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
