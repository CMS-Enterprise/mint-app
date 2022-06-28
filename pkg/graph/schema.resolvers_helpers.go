package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

// ConvertToPlanDocumentModel takes an auto-generated model plan input and converts it to a hand-written one
func ConvertToPlanDocumentModel(input *model.PlanDocumentInput) *models.PlanDocument {
	documentModel := models.PlanDocument{
		ModelPlanID:          input.ModelPlanID,
		VirusScanned:         false,
		VirusClean:           false,
		FileSize:             0,
		OtherTypeDescription: nil,
		OptionalNotes:        nil,
		DeletedAt:            nil,
	}

	if input.ID != nil {
		documentModel.ID = *input.ID
	}

	if input.DocumentParameters != nil {
		if input.DocumentParameters.FileName != nil {
			documentModel.FileName = *input.DocumentParameters.FileName
		}
		if input.DocumentParameters.FileType != nil {
			documentModel.FileType = *input.DocumentParameters.FileType
		}
		if input.DocumentParameters.DocumentType != nil {
			documentModel.DocumentType = *input.DocumentParameters.DocumentType
		}

		// TODO Replace documentModel.OtherTypeDescription with zero.String rather than check length manually
		if input.DocumentParameters.OtherTypeDescription != nil && len(*input.DocumentParameters.OtherTypeDescription) == 0 {
			documentModel.OtherTypeDescription = nil
		}

		// TODO Replace documentModel.OptionalNotes with zero.String rather than check length manually
		if input.DocumentParameters.OptionalNotes != nil && len(*input.DocumentParameters.OptionalNotes) == 0 {
			documentModel.OptionalNotes = nil
		}

		documentModel.FileSize = input.DocumentParameters.FileSize
	}

	return &documentModel
}
