package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// iddocQuestionnaireLoaders is a struct that holds LoaderWrappers related to IDDOC Questionnaire
type iddocQuestionnaireLoaders struct {
	// ByID Gets an IDDOC questionnaire record by the supplied ID
	ByID LoaderWrapper[uuid.UUID, *models.IDDOCQuestionnaire]
	// ByModelPlanID Gets an IDDOC questionnaire record associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.IDDOCQuestionnaire]
}

var IDDOCQuestionnaire = &iddocQuestionnaireLoaders{
	ByID:          NewLoaderWrapper(batchIDDOCQuestionnaireByID),
	ByModelPlanID: NewLoaderWrapper(batchIDDOCQuestionnaireByModelPlanID),
}

func batchIDDOCQuestionnaireByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.IDDOCQuestionnaire] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.IDDOCQuestionnaire](ids, err)
	}

	data, err := storage.IDDOCQuestionnaireGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.IDDOCQuestionnaire](ids, err)
	}
	getKeyFunc := func(data *models.IDDOCQuestionnaire) uuid.UUID {
		return data.ID
	}
	return oneToOneDataLoader(ids, data, getKeyFunc)
}

func batchIDDOCQuestionnaireByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.IDDOCQuestionnaire] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.IDDOCQuestionnaire](modelPlanIDs, err)
	}

	data, err := storage.IDDOCQuestionnaireGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.IDDOCQuestionnaire](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.IDDOCQuestionnaire) uuid.UUID {
		return data.ModelPlanID
	}
	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)

}
