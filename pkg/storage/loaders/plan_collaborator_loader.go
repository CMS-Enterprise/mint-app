package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

const (
	// DLIDKey is the key used to store and retrieve an id
	DLIDKey string = "id"
)

type planCollaboratorLoaders struct {
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.PlanCollaborator]
	ByID          LoaderWrapper[uuid.UUID, *models.PlanCollaborator]
}

var PlanCollaborators = &planCollaboratorLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanCollaboratorGetByModelPlanID),
	ByID:          NewLoaderWrapper(batchPlanCollaboratorGetByID),
}

// GetPlanCollaboratorByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Collaborator in one query
func batchPlanCollaboratorGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.PlanCollaborator] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanCollaborator](modelPlanIDs, err)
	}
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)

	collabs, err := dr.Store.PlanCollaboratorGetByModelPlanIDLOADER(logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanCollaborator](modelPlanIDs, err)
	}
	getKeyFunc := func(collab *models.PlanCollaborator) uuid.UUID {
		return collab.ModelPlanID
	}
	return oneToManyDataLoader(modelPlanIDs, collabs, getKeyFunc)

}

// batchPlanCollaboratorGetByID uses a DataLoader to aggregate a SQL call and return all Plan Collaborators for a collection of IDS in one query
func batchPlanCollaboratorGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.PlanCollaborator] {

	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanCollaborator](ids, err)
	}
	dr := loaders.DataReader

	collaborators, err := storage.PlanCollaboratorGetIDLOADER(dr.Store, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanCollaborator](ids, err)

	}
	getKeyFunc := func(data *models.PlanCollaborator) uuid.UUID {
		return data.ID
	}
	return oneToOneDataLoader(ids, collaborators, getKeyFunc)
}
