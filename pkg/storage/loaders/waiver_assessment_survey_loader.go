package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// waiverAssessmentSurveyLoaders is a struct that holds LoaderWrappers related to the WaiverAssessmentSurvey
type waiverAssessmentSurveyLoaders struct {
	// ByModelPlanID gets a WaiverAssessmentSurvey associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.WaiverAssessmentSurvey]
}

var WaiverAssessmentSurvey = &waiverAssessmentSurveyLoaders{
	ByModelPlanID: NewLoaderWrapper(batchWaiverAssessmentSurveyByModelPlanID),
}

func batchWaiverAssessmentSurveyByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.WaiverAssessmentSurvey] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.WaiverAssessmentSurvey](modelPlanIDs, err)
	}

	data, err := storage.WaiverAssessmentSurveyGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.WaiverAssessmentSurvey](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.WaiverAssessmentSurvey) uuid.UUID {
		return data.ModelPlanID
	}
	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)
}
